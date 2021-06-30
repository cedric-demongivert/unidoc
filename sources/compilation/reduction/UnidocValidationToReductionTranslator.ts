import { UnidocFunction } from '../../stream/UnidocFunction'

import { UnidocValidationEvent } from '../../validation/UnidocValidationEvent'
import { UnidocValidationEventType } from '../../validation/UnidocValidationEventType'

import { UnidocReductionInput } from './UnidocReductionInput'
import { UnidocReductionInputBuilder } from './UnidocReductionInputBuilder'

export class UnidocValidationToReductionTranslator extends UnidocFunction<UnidocValidationEvent, UnidocReductionInput> {
  /**
  *
  */
  private _event: UnidocReductionInputBuilder

  /**
  *
  */
  public constructor() {
    super()
    this._event = new UnidocReductionInputBuilder()
  }

  /**
  * @see UnidocConsumer.handleInitialization
  */
  public start(): void {
    this.output.start()
    this._event.asStart()
    this.output.next(this._event.get())
  }

  /**
  * @see UnidocConsumer.handleProduction
  */
  public next(event: UnidocValidationEvent): void {
    switch (event.type) {
      case UnidocValidationEventType.VALIDATION:
        this._event.asEvent(event.event)
        this.output.next(this._event.get())
        return
      case UnidocValidationEventType.DOCUMENT_COMPLETION:
      case UnidocValidationEventType.MESSAGE:
        return
      case UnidocValidationEventType.BEGIN_GROUP:
        this._event.asGroupStart(event.group)
        this.output.next(this._event.get())
        return
      case UnidocValidationEventType.END_GROUP:
        this._event.asGroupEnd(event.group)
        this.output.next(this._event.get())
        return
      default:
        throw new Error(
          'Unable to map validation event of type ' +
          UnidocValidationEventType.toDebugString(event.type) + ' because ' +
          'no procedure was defined for that.'
        )
    }
  }

  /**
  * @see UnidocConsumer.handleCompletion
  */
  public success(): void {
    this._event.asEnd()
    this.output.next(this._event.get())
    this.output.success()
  }

  /**
  * @see UnidocConsumer.handleFailure
  */
  public failure(error: Error): void {
    this.output.fail(error)
  }
}
