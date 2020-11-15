import { UnidocConsumer } from '../consumer/UnidocConsumer'
import { SubscribableUnidocConsumer } from '../consumer/SubscribableUnidocConsumer'

import { UnidocProducer } from '../producer/UnidocProducer'
import { UnidocProducerEvent } from '../producer/UnidocProducerEvent'

import { UnidocEventProducer } from '../event/UnidocEventProducer'
import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocEventType } from '../event/UnidocEventType'

import { UnidocBuffer } from '../buffer/UnidocBuffer'

import { UnidocStream } from './UnidocStream'
import { UnidocImportationFilterState } from './UnidocImportationFilterState'

const EMPTY_STRING: string = ''
const IMPORTATION_TAG: string = 'import'

export class UnidocImportationFilter
  extends SubscribableUnidocConsumer<UnidocEvent>
  implements UnidocConsumer<UnidocEvent>, UnidocProducer<UnidocEvent>
{
  private _output: UnidocEventProducer

  private _buffer: UnidocBuffer<UnidocEvent>

  private _stream: UnidocStream

  private _nextIdentifier: string

  private _state: UnidocImportationFilterState

  public constructor(stream: UnidocStream) {
    super()
    this._output = new UnidocEventProducer()
    this._stream = stream
    this._nextIdentifier = EMPTY_STRING
    this._buffer = UnidocBuffer.create(UnidocEvent.ALLOCATOR, 16)
    this._state = UnidocImportationFilterState.CONTENT
  }

  public handleInitialization(): void {
    this._output.initialize()
    this._buffer.clear()
    this._nextIdentifier = EMPTY_STRING
    this._state = UnidocImportationFilterState.CONTENT
  }

  public handleProduction(value: UnidocEvent): void {
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
      this._state = UnidocImportationFilterState.IMPORTATION_START
    } else {
      this._output.produce(value)
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
      this._output.produce(event)
    }

    this._output.produce(value)

    this._buffer.clear()
    this._nextIdentifier = ''
    this._state = UnidocImportationFilterState.CONTENT
  }

  private emitValidImportation(): void {
    this._buffer.clear()
    this._state = UnidocImportationFilterState.CONTENT
    this._stream.import(this._nextIdentifier)
    this._nextIdentifier = ''
  }


  public handleCompletion(): void {
    this._output.complete()
    this._buffer.clear()
    this._nextIdentifier = EMPTY_STRING
    this._state = UnidocImportationFilterState.CONTENT
  }

  public handleFailure(error: Error): void {
    console.error(error)
  }

  /**
  * @see UnidocProducer.addEventListener
  */
  public addEventListener(event: UnidocProducerEvent, listener: any) {
    this._output.addEventListener(event, listener)
  }

  /**
  * @see UnidocProducer.removeEventListener
  */
  public removeEventListener(event: UnidocProducerEvent, listener: any) {
    this._output.removeEventListener(event, listener)
  }

  /**
  * @see UnidocProducer.removeAllEventListener
  */
  public removeAllEventListener(...parameters: [any?]) {
    this._output.removeAllEventListener(...parameters)
  }
}
