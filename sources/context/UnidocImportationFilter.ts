import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocEventType } from '../event/UnidocEventType'

import { UnidocBuffer } from '../buffer/UnidocBuffer'

import { UnidocFunction } from '../stream/UnidocFunction'

import { UnidocImportationFilterState } from './UnidocImportationFilterState'
import { UnidocImportationProducer } from './UnidocImportationProducer'

/**
 * 
 */
const EMPTY_STRING: string = ''

/**
 * 
 */
const IMPORTATION_TAG: string = 'import'

/**
 * 
 */
export class UnidocImportationFilter extends UnidocFunction<UnidocEvent>
{
  /**
   * 
   */
  public readonly importations: UnidocImportationProducer

  /**
   * 
   */
  private _buffer: UnidocBuffer<UnidocEvent>

  /**
   * 
   */
  private _nextIdentifier: string

  /**
   * 
   */
  private _state: UnidocImportationFilterState

  /**
   * 
   */
  public constructor() {
    super()
    this.importations = new UnidocImportationProducer()

    this._nextIdentifier = EMPTY_STRING
    this._buffer = UnidocBuffer.create(UnidocEvent.ALLOCATOR, 16)
    this._state = UnidocImportationFilterState.CONTENT
  }

  /**
   * 
   */
  public start(): void {
    this.output.start()
    this.importations.start()

    this._buffer.clear()
    this._nextIdentifier = EMPTY_STRING
    this._state = UnidocImportationFilterState.CONTENT
  }

  public next(value: UnidocEvent): void {
    switch (this._state) {
      case UnidocImportationFilterState.CONTENT:
        return this.handleProductionAfterContent(value)
      case UnidocImportationFilterState.IMPORTATION_START:
        return this.handleProductionAfterImportationStart(value)
      case UnidocImportationFilterState.IMPORTATION_CONTENT:
        return this.handleProductionAfterImportationContent(value)
      case UnidocImportationFilterState.IMPORTATION_TRAILING_WHITESPACE:
        return this.handleProductionAfterTrailingWhitespace(value)
      default:
        throw new Error(
          'Unable to handle production in state #' + this._state + '(' +
          UnidocImportationFilterState.toString(this._state) + ') because ' +
          'no procedure was defined for that.'
        )
    }
  }

  private handleProductionAfterContent(value: UnidocEvent): void {
    if (value.type === UnidocEventType.START_TAG && value.tag === IMPORTATION_TAG) {
      this._buffer.push(value)
      this.importations.from(value.origin.from)
      this._state = UnidocImportationFilterState.IMPORTATION_START
    } else {
      this.output.next(value)
    }
  }

  private handleProductionAfterImportationStart(value: UnidocEvent): void {
    if (value.type === UnidocEventType.WHITESPACE) {
      this._buffer.push(value)
    } else if (value.type === UnidocEventType.WORD) {
      this._buffer.push(value)
      this._nextIdentifier += value.text
      this._state = UnidocImportationFilterState.IMPORTATION_CONTENT
    } else {
      this.handleInvalidImportationTag(value)
    }
  }

  private handleProductionAfterImportationContent(value: UnidocEvent): void {
    if (value.type === UnidocEventType.WHITESPACE) {
      this._buffer.push(value)
      this._state = UnidocImportationFilterState.IMPORTATION_TRAILING_WHITESPACE
    } else if (value.type === UnidocEventType.END_TAG) {
      if (value.tag === IMPORTATION_TAG) {
        this.importations.to(value.origin.to)
        this.emitValidImportation()
      } else {
        this.handleInvalidImportationTag(value)
      }
    } else if (value.type === UnidocEventType.WORD) {
      this._buffer.push(value)
      this._nextIdentifier += value.text
    } else {
      this.handleInvalidImportationTag(value)
    }
  }

  private handleProductionAfterTrailingWhitespace(value: UnidocEvent): void {
    if (value.type === UnidocEventType.WHITESPACE) {
      this._buffer.push(value)
      this._state = UnidocImportationFilterState.IMPORTATION_TRAILING_WHITESPACE
    } else if (value.type === UnidocEventType.END_TAG) {
      if (value.tag === IMPORTATION_TAG) {
        this.importations.to(value.origin.to)
        this.emitValidImportation()
      } else {
        this.handleInvalidImportationTag(value)
      }
    } else {
      this.handleInvalidImportationTag(value)
    }
  }

  private handleInvalidImportationTag(value: UnidocEvent): void {
    for (const event of this._buffer) {
      this.output.next(event)
    }

    this.output.next(value)

    this._buffer.clear()
    this._nextIdentifier = ''
    this._state = UnidocImportationFilterState.CONTENT
  }

  private emitValidImportation(): void {
    this._buffer.clear()
    this._state = UnidocImportationFilterState.CONTENT
    this.importations.ofResource(this._nextIdentifier)
    this._nextIdentifier = ''
    this.importations.next()
  }


  public success(): void {
    this.importations.success()
    this.output.success()

    this._buffer.clear()
    this._nextIdentifier = EMPTY_STRING
    this._state = UnidocImportationFilterState.CONTENT
  }

  public failure(error: Error): void {
    console.error(error)
  }
}
