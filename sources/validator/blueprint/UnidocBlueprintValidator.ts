import { Pack } from '@cedric-demongivert/gl-tool-collection'

import { UnidocEvent } from '../../event/UnidocEvent'

import { UnidocBlueprint } from '../../blueprint/UnidocBlueprint'
import { UnidocProducerEvent } from '../../producer/UnidocProducerEvent'
import { SubscribableUnidocConsumer } from '../../consumer/SubscribableUnidocConsumer'

import { UnidocValidationTreeManager } from '../../validation/UnidocValidationTreeManager'
import { UnidocValidationMessageType } from '../../validation/UnidocValidationMessageType'

import { UnidocValidator } from '../UnidocValidator'

import { UnidocBlueprintValidationProcess } from './UnidocBlueprintValidationProcess'

export class UnidocBlueprintValidator
  extends SubscribableUnidocConsumer<UnidocEvent>
  implements UnidocValidator {
  private _pass: Pack<UnidocBlueprintValidationProcess>
  private _nextPass: Pack<UnidocBlueprintValidationProcess>

  private _manager: UnidocValidationTreeManager

  public constructor(capacity: number = 32) {
    super()
    this._pass = Pack.any(capacity)
    this._nextPass = Pack.any(capacity)
    this._manager = new UnidocValidationTreeManager()
  }

  public fromProcess(process: UnidocBlueprintValidationProcess): UnidocBlueprintValidator {
    this._manager.fromBranch(process.branch)
    return this
  }

  public asMessageOfType(type: UnidocValidationMessageType): UnidocBlueprintValidator {
    this._manager.asMessageOfType(type)
    return this
  }

  public asVerboseMessage(): UnidocBlueprintValidator {
    this._manager.asVerboseMessage()
    return this
  }

  public asInformationMessage(): UnidocBlueprintValidator {
    this._manager.asInformationMessage()
    return this
  }

  public asWarningMessage(): UnidocBlueprintValidator {
    this._manager.asWarningMessage()
    return this
  }

  public asErrorMessage(): UnidocBlueprintValidator {
    this._manager.asErrorMessage()
    return this
  }

  public asFailureMessage(): UnidocBlueprintValidator {
    this._manager.asFailureMessage()
    return this
  }

  public ofCode(code: string): UnidocBlueprintValidator {
    this._manager.ofCode(code)
    return this
  }

  public withData(key: string, value: any): UnidocBlueprintValidator {
    this._manager.withData(key, value)
    return this
  }

  public produce(): UnidocBlueprintValidator {
    this._manager.produce()
    return this
  }

  public handleInitialization(): void {
    this._manager.initialize()
  }

  public handleProduction(value: UnidocEvent): void {
    this.validate(value)
  }

  public handleCompletion(): void {
    for (const process of this._pass) {
      process.continue()
      process.complete()
    }

    this._pass.clear()
    this._manager.complete()
  }

  public handleFailure(error: Error): void {
    console.error(error)
  }

  public validate(event: UnidocEvent) {
    if (this._pass.size > 0) {
      for (const process of this._pass) {
        process.continue()
        this._manager.validate(process.branch, event)
        process.validate(event)

        if (process.running) {
          this._nextPass.push(process)
        } else {
          this._manager.completeBranch(process.branch)
        }
      }

      this._pass.clear()
      this.swap()
    }
  }

  public execute(blueprint: UnidocBlueprint): void {
    const process: UnidocBlueprintValidationProcess = (
      new UnidocBlueprintValidationProcess(this)
    )

    process.enter(blueprint)
    process.branch.set(0, 0)

    this._pass.clear()
    this._nextPass.clear()
    this._pass.push(process)
  }

  public fork(process: UnidocBlueprintValidationProcess, fork: UnidocBlueprintValidationProcess): void {
    fork.branch.copy(this._manager.fork(process.branch).branch)
    this._manager.initializeBranch(fork.branch)
    this._pass.push(fork)
  }

  private swap(): void {
    const temporary: Pack<UnidocBlueprintValidationProcess> = this._pass
    this._pass = this._nextPass
    this._nextPass = temporary
  }

  /**
  * @see UnidocProducer.addEventListener
  */
  public addEventListener(event: UnidocProducerEvent, listener: any): void {
    this._manager.addEventListener(event, listener)
  }

  /**
  * @see UnidocProducer.removeEventListener
  */
  public removeEventListener(event: UnidocProducerEvent, listener: any): void {
    this._manager.removeEventListener(event, listener)
  }

  /**
  * @see UnidocProducer.removeAllEventListener
  */
  public removeAllEventListener(...parameters: [any?]): void {
    this._manager.removeAllEventListener(...parameters)
  }
}
