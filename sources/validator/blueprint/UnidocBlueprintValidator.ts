import { SubscribableUnidocConsumer } from '../../consumer/SubscribableUnidocConsumer'
import { UnidocProducerEvent } from '../../producer/UnidocProducerEvent'
import { UnidocEvent } from '../../event/UnidocEvent'

import { UnidocBlueprint } from '../../blueprint/UnidocBlueprint'

import { UnidocValidator } from '../UnidocValidator'

import { UnidocTreeValidator } from '../tree/UnidocTreeValidator'

import { UnidocBlueprintValidationAutomata } from './UnidocBlueprintValidationAutomata'

export class UnidocBlueprintValidator
  extends SubscribableUnidocConsumer<UnidocEvent>
  implements UnidocValidator {
  private readonly _scheduler: UnidocTreeValidator

  public constructor() {
    super()
    this._scheduler = new UnidocTreeValidator()
  }

  public validateWith(blueprint: UnidocBlueprint): void {
    this._scheduler.execute(new UnidocBlueprintValidationAutomata(blueprint))
  }

  /**
  * @see UnidocConsumer.handleInitialization
  */
  public handleInitialization(): void {
    this._scheduler.handleInitialization()
  }

  /**
  * @see UnidocConsumer.handleProduction
  */
  public handleProduction(value: UnidocEvent): void {
    this._scheduler.handleProduction(value)
  }

  /**
  * @see UnidocConsumer.handleCompletion
  */
  public handleCompletion(): void {
    this._scheduler.handleCompletion()
  }

  /**
  * @see UnidocConsumer.handleFailure
  */
  public handleFailure(error: Error): void {
    this._scheduler.handleFailure(error)
  }

  /**
  * @see UnidocProducer.addEventListener
  */
  public addEventListener(event: UnidocProducerEvent, listener: any) {
    this._scheduler.addEventListener(event, listener)
  }

  /**
  * @see UnidocProducer.removeEventListener
  */
  public removeEventListener(event: UnidocProducerEvent, listener: any) {
    this._scheduler.removeEventListener(event, listener)
  }

  /**
  * @see UnidocProducer.removeAllEventListener
  */
  public removeAllEventListener(...parameters: [any?]) {
    this._scheduler.removeAllEventListener(...parameters)
  }
}
