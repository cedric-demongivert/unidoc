import { SubscribableUnidocConsumer } from '../../consumer/SubscribableUnidocConsumer'
import { UnidocProducerEvent } from '../../producer/UnidocProducerEvent'
import { UnidocEvent } from '../../event/UnidocEvent'
import { UnidocBlueprint } from '../../blueprint/UnidocBlueprint'

import { UnidocTreeValidator } from '../tree/UnidocTreeValidator'

import { UnidocValidator } from '../UnidocValidator'

import { UnidocBlueprintValidationAutomata } from './UnidocBlueprintValidationAutomata'

export class UnidocBlueprintValidator
  extends SubscribableUnidocConsumer<UnidocEvent>
  implements UnidocValidator {
  private readonly _tree: UnidocTreeValidator

  public constructor() {
    super()
    this._tree = new UnidocTreeValidator()
  }

  public validateWith(blueprint: UnidocBlueprint): void {
    this._tree.execute(new UnidocBlueprintValidationAutomata(blueprint))
  }

  /**
  * @see UnidocConsumer.handleInitialization
  */
  public handleInitialization(): void {
    this._tree.handleInitialization()
  }

  /**
  * @see UnidocConsumer.handleProduction
  */
  public handleProduction(value: UnidocEvent): void {
    this._tree.handleProduction(value)
  }

  /**
  * @see UnidocConsumer.handleCompletion
  */
  public handleCompletion(): void {
    this._tree.handleCompletion()
  }

  /**
  * @see UnidocConsumer.handleFailure
  */
  public handleFailure(error: Error): void {
    this._tree.handleFailure(error)
  }

  /**
  * @see UnidocProducer.addEventListener
  */
  public addEventListener(event: UnidocProducerEvent, listener: any) {
    this._tree.addEventListener(event, listener)
  }

  /**
  * @see UnidocProducer.removeEventListener
  */
  public removeEventListener(event: UnidocProducerEvent, listener: any) {
    this._tree.removeEventListener(event, listener)
  }

  /**
  * @see UnidocProducer.removeAllEventListener
  */
  public removeAllEventListener(...parameters: [any?]) {
    this._tree.removeAllEventListener(...parameters)
  }
}
