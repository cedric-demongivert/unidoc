import { UnidocEvent } from '../event/UnidocEvent'

import { ListenableUnidocProducer } from '../producer/ListenableUnidocProducer'

import { UnidocValidationEvent } from './UnidocValidationEvent'
import { UnidocValidationMessage } from './UnidocValidationMessage'
import { UnidocValidationEventType } from './UnidocValidationEventType'

export class UnidocValidationEventProducer extends ListenableUnidocProducer<UnidocValidationEvent> {
  /**
  *
  */
  private readonly _event: UnidocValidationEvent

  /**
  *
  */
  private _index: number

  /**
  *
  */
  private _batch: number

  /**
  *
  */
  public constructor() {
    super()
    this._event = new UnidocValidationEvent()
    this._index = 0
    this._batch = 0
  }

  /**
  * @see ListenableUnidocProducer.fail
  */
  public fail(error: Error): void {
    super.fail(error)
  }

  /**
  * @see ListenableUnidocProducer.initialize
  */
  public initialize(): void {
    super.initialize()
  }



  /**
  *
  */
  public produceValidation(event: UnidocEvent): UnidocValidationEventProducer {
    this._event.asValidation(event)
    this.produce(this._event)
    return this
  }

  /**
  *
  */
  public produceDocumentCompletion(): UnidocValidationEventProducer {
    this._event.asDocumentCompletion()
    this.produce(this._event)
    return this
  }

  /**
  *
  */
  public produceBeginGroup(group: any): UnidocValidationEventProducer {
    this._event.asBeginGroup(group)
    this.produce(this._event)
    return this
  }

  /**
  *
  */
  public produceEndGroup(group: any): UnidocValidationEventProducer {
    this._event.asEndGroup(group)
    this.produce(this._event)
    return this
  }

  /**
  *
  */
  public produceMessage(message?: UnidocValidationMessage): UnidocValidationEventProducer {
    this._event.asMessage(message)
    this.produce(this._event)
    return this
  }

  /**
  * @see ListenableUnidocProducer.produce
  */
  public produce(event: UnidocValidationEvent = this._event): void {
    if (
      event.type === UnidocValidationEventType.VALIDATION ||
      event.type === UnidocValidationEventType.DOCUMENT_COMPLETION
    ) { this._batch += 1 }

    event.index = this._index
    event.batch = this._batch

    this._index += 1

    super.produce(event)
  }

  /**
  * @see ListenableUnidocProducer.complete
  */
  public complete(): void {
    super.complete()
  }

  /**
  *
  */
  public clear(): void {
    this._event.clear()
    this._index = 0
    this._batch = 0
    this.removeAllEventListener()
  }
}

export namespace UnidocValidationEventProducer {
  /**
  *
  */
  export function create(): UnidocValidationEventProducer {
    return new UnidocValidationEventProducer()
  }
}
