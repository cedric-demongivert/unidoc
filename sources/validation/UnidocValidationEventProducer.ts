import { UnidocEvent } from '../event/UnidocEvent'

import { UnidocPublisher } from '../stream/UnidocPublisher'
import { UnidocObject } from '../UnidocObject'

import { UnidocValidationEvent } from './UnidocValidationEvent'
import { UnidocValidationMessage } from './UnidocValidationMessage'
import { UnidocValidationEventType } from './UnidocValidationEventType'

/**
 * 
 */
export class UnidocValidationEventProducer extends UnidocPublisher<UnidocValidationEvent> {
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
   * 
   */
  public fail(error: Error): void {
    this.output.fail(error)
  }

  /**
   * 
   */
  public start(): void {
    this.output.start()
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
   * 
   */
  public produce(event: UnidocValidationEvent = this._event): void {
    if (
      event.type === UnidocValidationEventType.VALIDATION ||
      event.type === UnidocValidationEventType.DOCUMENT_COMPLETION
    ) { this._batch += 1 }

    event.index = this._index
    event.batch = this._batch

    this._index += 1

    this.output.next(event)
  }

  /**
   * 
   */
  public success(): void {
    this.output.success()
  }

  /**
  *
  */
  public clear(): void {
    this._event.clear()
    this._index = 0
    this._batch = 0
    this.off()
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
