import { SubscribableUnidocConsumer } from '../../consumer/SubscribableUnidocConsumer'
import { UnidocProducer } from '../../producer/UnidocProducer'

import { UnidocValidationEvent } from '../../validation/UnidocValidationEvent'
import { UnidocValidationEventType } from '../../validation/UnidocValidationEventType'

import { UnidocReductionInputProducer } from './UnidocReductionInputProducer'
import { UnidocReductionInput } from './UnidocReductionInput'

export class UnidocValidationToReductionTranslator extends SubscribableUnidocConsumer<UnidocValidationEvent> implements UnidocProducer<UnidocReductionInput> {
  /**
  *
  */
  private _output: UnidocReductionInputProducer

  /**
  *
  */
  public constructor() {
    super()
    this._output = new UnidocReductionInputProducer()
  }

  /**
  * @see UnidocConsumer.handleInitialization
  */
  public handleInitialization(): void {
    this._output.initialize()
  }

  /**
  * @see UnidocConsumer.handleProduction
  */
  public handleProduction(event: UnidocValidationEvent): void {
    switch (event.type) {
      case UnidocValidationEventType.CREATION:
        this._output.produceStart()
        return
      case UnidocValidationEventType.TERMINATION:
        this._output.produceEnd()
        return
      case UnidocValidationEventType.FORK:
      case UnidocValidationEventType.FORKED:
      case UnidocValidationEventType.MERGE:
        throw new Error(
          'Trying to map a validation tree to a reduction stream, please ' +
          'reduce your tree to only one branch in order to reduce it.'
        )
      case UnidocValidationEventType.VALIDATION:
        this._output.produceEvent(event.event)
        return
      case UnidocValidationEventType.DOCUMENT_COMPLETION:
      case UnidocValidationEventType.MESSAGE:
        return
      case UnidocValidationEventType.BEGIN_GROUP:
        this._output.produceGroupStart(event.group)
        return
      case UnidocValidationEventType.END_GROUP:
        this._output.produceGroupEnd(event.group)
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
  public handleCompletion(): void {
    this._output.complete()
  }

  /**
  * @see UnidocConsumer.handleFailure
  */
  public handleFailure(error: Error): void {
    this._output.fail(error)
  }

  /**
  * @see UnidocProducer.addEventListener
  */
  public addEventListener(event: any, listener: any): void {
    this._output.addEventListener(event, listener)
  }

  /**
  * @see UnidocProducer.removeEventListener
  */
  public removeEventListener(event: any, listener: any): void {
    this._output.removeEventListener(event, listener)
  }

  /**
  * @see UnidocProducer.removeAllEventListener
  */
  public removeAllEventListener(...parameters: [any?]): void {
    this._output.removeAllEventListener(...parameters)
  }
}
