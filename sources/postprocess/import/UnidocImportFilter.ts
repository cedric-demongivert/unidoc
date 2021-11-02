import { getExtension as getMimeExtension, getType as getMimeFromExtension } from 'mime'

import { UnidocEvent } from '../../event/UnidocEvent'
import { UnidocEventType } from '../../event/UnidocEventType'

import { UnidocBuffer } from '../../buffer/UnidocBuffer'

import { UnidocSink } from '../../stream/UnidocSink'
import { UnidocFunction } from '../../stream/UnidocFunction'
import { Empty } from '../../Empty'

import { UnidocImportFilterState } from './UnidocImportFilterState'
import { UnidocImport } from './UnidocImport'
import { UnidocImportBuilder } from './UnidocImportBuilder'

/**
 * 
 */
const IMPORTATION_TAG: string = 'import'

/**
 * 
 */
export class UnidocImportFilter extends UnidocFunction<UnidocEvent>
{
  /**
   * 
   */
  public readonly importations: UnidocSink<UnidocImport>

  /**
   * 
   */
  private readonly _builder: UnidocImportBuilder

  /**
   * 
   */
  private readonly _buffer: UnidocBuffer<UnidocEvent>

  /**
   * 
   */
  private _uri: string

  /**
   * 
   */
  private _typedef: string | undefined

  /**
   * 
   */
  private _state: UnidocImportFilterState

  /**
   * 
   */
  public constructor() {
    super()
    this.importations = new UnidocSink()

    this._builder = new UnidocImportBuilder()
    this._buffer = UnidocBuffer.create(UnidocEvent.ALLOCATOR, 16)
    this._uri = Empty.STRING
    this._typedef = undefined
    this._state = UnidocImportFilterState.CONTENT
  }

  /**
   * 
   */
  public start(): void {
    this.output.start()
    this.importations.start()

    this._buffer.clear()
    this._builder.clear()
    this._uri = Empty.STRING
    this._typedef = undefined
    this._state = UnidocImportFilterState.CONTENT
  }

  /**
   * 
   */
  public next(value: UnidocEvent): void {
    switch (this._state) {
      case UnidocImportFilterState.CONTENT:
        return this.nextAfterContent(value)
      case UnidocImportFilterState.LEADING_WHITESPACE:
        return this.nextAfterLeadingWhitespace(value)
      case UnidocImportFilterState.URI:
        return this.nextAfterURI(value)
      case UnidocImportFilterState.URI_TRAILING_WHITESPACE:
        return this.nextAfterURITrailingWhitespace(value)
      case UnidocImportFilterState.TYPEDEF:
        return this.nextAfterTypedef(value)
      case UnidocImportFilterState.TYPEDEF_VALUE:
        return this.nextAfterTypedefValue(value)
      case UnidocImportFilterState.TYPEDEF_TRAILING_WHITESPACE:
        return this.nextAfterTypedefTrailingWhitespace(value)
      default:
        throw new Error(
          'Unable to handle next event in state ' +
          UnidocImportFilterState.toDebugString(this._state) +
          ' because no procedure was defined for that.'
        )
    }
  }

  /**
   * 
   */
  private nextAfterContent(value: UnidocEvent): void {
    if (value.type === UnidocEventType.START_TAG && value.tag === IMPORTATION_TAG) {
      this._buffer.push(value)
      this._builder.setFrom(value.origin.from)
      this._state = UnidocImportFilterState.LEADING_WHITESPACE
    } else {
      this.output.next(value)
    }
  }

  /**
   * 
   */
  private nextAfterLeadingWhitespace(value: UnidocEvent): void {
    if (value.type === UnidocEventType.WHITESPACE) {
      this._buffer.push(value)
    } else if (value.type === UnidocEventType.WORD) {
      this._buffer.push(value)
      this._uri += value.text
      this._state = UnidocImportFilterState.URI
    } else {
      this.handleInvalidImportationTag(value)
    }
  }

  /**
   * 
   */
  private nextAfterURI(value: UnidocEvent): void {
    if (value.type === UnidocEventType.WHITESPACE) {
      this._buffer.push(value)
      this._state = UnidocImportFilterState.URI_TRAILING_WHITESPACE
    } else if (value.type === UnidocEventType.END_TAG) {
      this._builder.setTo(value.origin.to)
      this.emitValidImportation()
    } else if (value.type === UnidocEventType.WORD) {
      this._buffer.push(value)
      this._uri += value.text
    } else {
      this.handleInvalidImportationTag(value)
    }
  }

  /**
   * 
   */
  private nextAfterURITrailingWhitespace(value: UnidocEvent): void {
    if (value.type === UnidocEventType.WHITESPACE) {
      this._buffer.push(value)
    } else if (value.type === UnidocEventType.END_TAG) {
      this._builder.setTo(value.origin.to)
      this.emitValidImportation()
    } else if (value.type === UnidocEventType.WORD && value.text === 'as') {
      this._state = UnidocImportFilterState.TYPEDEF
    } else {
      this.handleInvalidImportationTag(value)
    }
  }

  /**
   * 
   */
  private nextAfterTypedef(value: UnidocEvent): void {
    if (value.type === UnidocEventType.WHITESPACE) {
      this._buffer.push(value)
    } else if (value.type === UnidocEventType.WORD) {
      this._buffer.push(value)
      this._typedef = value.text
      this._state = UnidocImportFilterState.TYPEDEF_VALUE
    } else {
      this.handleInvalidImportationTag(value)
    }
  }

  /**
   * 
   */
  private nextAfterTypedefValue(value: UnidocEvent): void {
    if (value.type === UnidocEventType.WHITESPACE) {
      this._buffer.push(value)
      this._state = UnidocImportFilterState.TYPEDEF_TRAILING_WHITESPACE
    } else if (value.type === UnidocEventType.WORD) {
      this._buffer.push(value)
      this._typedef += value.text
    } else {
      this.handleInvalidImportationTag(value)
    }
  }

  /**
   * 
   */
  private nextAfterTypedefTrailingWhitespace(value: UnidocEvent): void {
    if (value.type === UnidocEventType.WHITESPACE) {
      this._buffer.push(value)
    } else if (value.type === UnidocEventType.END_TAG) {
      this._builder.setTo(value.origin.to)
      this.emitValidImportation()
    } else {
      this.handleInvalidImportationTag(value)
    }
  }

  /**
   * 
   */
  private handleInvalidImportationTag(value: UnidocEvent): void {
    for (const event of this._buffer) {
      this.output.next(event)
    }

    this.output.next(value)

    this._buffer.clear()
    this._builder.clear()
    this._uri = Empty.STRING
    this._typedef = undefined
    this._state = UnidocImportFilterState.CONTENT
  }

  /**
   * 
   */
  private emitValidImportation(): void {
    this._buffer.clear()
    this._state = UnidocImportFilterState.CONTENT
    this._builder.fromURI(this._uri)

    if (this._typedef != null) {
      const typedef: string = this._typedef

      this._builder.setMime(
        getMimeExtension(typedef) == null ? getMimeFromExtension(typedef) || 'application/octet-stream' : typedef
      )

      this._typedef = undefined
    }

    this._uri = Empty.STRING
    this.importations.next(this._builder.get())
  }

  /**
   * 
   */
  public success(): void {
    this.importations.success()
    this.output.success()

    this._buffer.clear()
    this._uri = Empty.STRING
    this._typedef = undefined
    this._state = UnidocImportFilterState.CONTENT
  }

  /**
   * 
   */
  public failure(error: Error): void {
    this.output.fail(error)
  }
}
