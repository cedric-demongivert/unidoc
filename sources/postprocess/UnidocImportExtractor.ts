import { getExtension as getMimeExtension, getType as getMimeFromExtension } from 'mime'

import { Pack } from '@cedric-demongivert/gl-tool-collection'

import { UTF32CodeUnit, UTF32String } from '../symbol'
import { UnidocEvent, UnidocEventType } from '../event'
import { UnidocSink, UnidocProcess } from '../stream'
import { UnidocImport, UnidocImportScheme } from '../context'

import { UnidocImportExtractorState } from './UnidocImportExtractorState'

/**
 * 
 */
const IMPORTATION_TAG: UTF32String = UTF32String.fromString('import')

/**
 * 
 */
const AS_TEXT: UTF32String = UTF32String.fromString('as')

/**
 * 
 */
export class UnidocImportExtractor extends UnidocProcess<UnidocEvent>
{
  /**
   * 
   */
  public readonly imports: UnidocSink<UnidocImport>

  /**
   * 
   */
  private readonly _import: UnidocImport

  /**
   * 
   */
  private readonly _buffer: Pack<UnidocEvent>

  /**
   * 
   */
  private readonly _uri: UTF32String

  /**
   * 
   */
  private readonly _typedef: UTF32String

  /**
   * 
   */
  private _state: UnidocImportExtractorState

  /**
   * 
   */
  public constructor() {
    super()
    this.imports = new UnidocSink()

    this._import = new UnidocImport()
    this._buffer = Pack.instance(UnidocEvent.ALLOCATOR, 16)
    this._uri = UTF32String.allocate(32)
    this._typedef = UTF32String.allocate(32)
    this._state = UnidocImportExtractorState.CONTENT
  }

  /**
   * 
   */
  public start(): void {
    this.output.start()
    this.imports.start()

    this.startContent()
  }

  /**
   * 
   */
  public next(value: UnidocEvent): void {
    if (this._state !== UnidocImportExtractorState.CONTENT) {
      this._buffer.push(value)
    }

    switch (this._state) {
      case UnidocImportExtractorState.CONTENT:
        return this.nextAfterContent(value)
      case UnidocImportExtractorState.LEADING_WHITESPACE:
        return this.nextAfterLeadingWhitespace(value)
      case UnidocImportExtractorState.URI:
        return this.nextAfterURI(value)
      case UnidocImportExtractorState.URI_TRAILING_WHITESPACE:
        return this.nextAfterURITrailingWhitespace(value)
      case UnidocImportExtractorState.TYPEDEF:
        return this.nextAfterTypedef(value)
      case UnidocImportExtractorState.TYPEDEF_VALUE:
        return this.nextAfterTypedefValue(value)
      case UnidocImportExtractorState.TYPEDEF_TRAILING_WHITESPACE:
        return this.nextAfterTypedefTrailingWhitespace(value)
      default:
        throw new Error(
          `Unable to handle next event in state ${UnidocImportExtractorState.toDebugString(this._state)} ` +
          'because no procedure was defined for that.'
        )
    }
  }

  /**
   * 
   */
  private nextAfterContent(value: UnidocEvent): void {
    if (value.type === UnidocEventType.START_TAG && value.symbols.equals(IMPORTATION_TAG)) {
      this._buffer.push(value)
      this._state = UnidocImportExtractorState.LEADING_WHITESPACE
    } else {
      this.output.next(value)
    }
  }

  /**
   * 
   */
  private nextAfterLeadingWhitespace(value: UnidocEvent): void {
    if (value.type === UnidocEventType.WHITESPACE) {
      return
    } else if (value.type === UnidocEventType.WORD) {
      this._uri.concat(value.symbols)
      this._state = UnidocImportExtractorState.URI
    } else {
      this.handleInvalidImportationTag()
    }
  }

  /**
   * 
   */
  private nextAfterURI(value: UnidocEvent): void {
    if (value.type === UnidocEventType.WHITESPACE) {
      this._state = UnidocImportExtractorState.URI_TRAILING_WHITESPACE
    } else if (value.type === UnidocEventType.END_TAG) {
      this.emitValidImportation()
    } else if (value.type === UnidocEventType.WORD) {
      this._uri.concat(value.symbols)
    } else {
      this.handleInvalidImportationTag()
    }
  }

  /**
   * 
   */
  private nextAfterURITrailingWhitespace(value: UnidocEvent): void {
    if (value.type === UnidocEventType.WHITESPACE) {
      return
    } else if (value.type === UnidocEventType.END_TAG) {
      this.emitValidImportation()
    } else if (value.type === UnidocEventType.WORD && value.symbols.equals(AS_TEXT)) {
      this._state = UnidocImportExtractorState.TYPEDEF
    } else {
      this.handleInvalidImportationTag()
    }
  }

  /**
   * 
   */
  private nextAfterTypedef(value: UnidocEvent): void {
    if (value.type === UnidocEventType.WHITESPACE) {
      return
    } else if (value.type === UnidocEventType.WORD) {
      this._typedef.concat(value.symbols)
      this._state = UnidocImportExtractorState.TYPEDEF_VALUE
    } else {
      this.handleInvalidImportationTag()
    }
  }

  /**
   * 
   */
  private nextAfterTypedefValue(value: UnidocEvent): void {
    if (value.type === UnidocEventType.WHITESPACE) {
      this._state = UnidocImportExtractorState.TYPEDEF_TRAILING_WHITESPACE
    } else if (value.type === UnidocEventType.WORD) {
      this._buffer.push(value)
      this._typedef.concat(value.symbols)
    } else {
      this.handleInvalidImportationTag()
    }
  }

  /**
   * 
   */
  private nextAfterTypedefTrailingWhitespace(value: UnidocEvent): void {
    if (value.type === UnidocEventType.WHITESPACE) {
      return
    } else if (value.type === UnidocEventType.END_TAG) {
      this.emitValidImportation()
    } else {
      this.handleInvalidImportationTag()
    }
  }

  /**
   * 
   */
  private handleInvalidImportationTag(): void {
    for (const event of this._buffer) {
      this.output.next(event)
    }

    this.startContent()
  }

  /**
   * 
   */
  private getSchemeIndex(): number {
    const token: UTF32String = this._uri

    for (let index = 2, size = token.size; index < size; ++index) {
      if (
        token.get(index) === UTF32CodeUnit.SOLIDUS &&
        token.get(index - 1) === UTF32CodeUnit.SOLIDUS &&
        token.get(index - 2) === UTF32CodeUnit.COLON
      ) {
        return index - 2
      }
    }

    return -1
  }

  /**
   * 
   */
  private emitValidImportation(): void {
    const result: UnidocImport = this._import

    result.clear()

    for (const event of this._buffer) {
      result.origin.concat(event.origin)
    }

    const uri: UTF32String = this._uri
    const schemeIndex: number = this.getSchemeIndex()

    if (schemeIndex < 0) {
      result.scheme = UnidocImportScheme.FILE
      result.identifier = uri.toString()
    } else {
      result.scheme = UnidocImportScheme.get(uri.toString(0, schemeIndex))
      result.identifier = uri.toString(schemeIndex + 3)
    }

    const typedef: UTF32String = this._typedef

    if (typedef.size > 0) {
      const typedefValue: string = typedef.toString()
      result.mime = getMimeExtension(typedefValue) == null ? getMimeFromExtension(typedefValue) || UnidocImport.OCTET_STREAM_MIME : typedefValue
    }

    this.imports.next(result)
    this.startContent()
  }

  /**
   * 
   */
  public success(): void {
    this.imports.success()
    this.output.success()

    this.startContent()
  }

  /**
   * 
   */
  private startContent(): void {
    this._buffer.clear()
    this._uri.clear()
    this._typedef.clear()
    this._state = UnidocImportExtractorState.CONTENT
  }

  /**
   * 
   */
  public failure(error: Error): void {
    this.output.failure(error)
  }
}

/**
 * 
 */
export namespace UnidocImportExtractor {
  /**
   * 
   */
  export function create(): UnidocImportExtractor {
    return new UnidocImportExtractor()
  }
}