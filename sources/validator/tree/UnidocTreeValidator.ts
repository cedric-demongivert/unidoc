import { Pack } from '@cedric-demongivert/gl-tool-collection'

import { UnidocEvent } from '../../event/UnidocEvent'

import { UnidocProducerEvent } from '../../producer/UnidocProducerEvent'
import { SubscribableUnidocConsumer } from '../../consumer/SubscribableUnidocConsumer'

import { UnidocValidator } from '../UnidocValidator'

import { UnidocValidationTreeManager } from '../../validation/UnidocValidationTreeManager'
import { UnidocValidationMessageType } from '../../validation/UnidocValidationMessageType'

import { UnidocBranchValidator } from './UnidocBranchValidator'
import { UnidocBranchAutomata } from './UnidocBranchAutomata'

export class UnidocTreeValidator
  extends SubscribableUnidocConsumer<UnidocEvent>
  implements UnidocValidator {
  private _pass: Pack<UnidocBranchValidator>
  private _nextPass: Pack<UnidocBranchValidator>

  private _manager: UnidocValidationTreeManager

  public constructor(capacity: number = 32) {
    super()
    this._pass = Pack.any(capacity)
    this._nextPass = Pack.any(capacity)
    this._manager = new UnidocValidationTreeManager()
  }

  public fromBranch(branch: UnidocBranchValidator): UnidocTreeValidator {
    this._manager.fromBranch(branch.branch)
    return this
  }

  public asMessageOfType(type: UnidocValidationMessageType): UnidocTreeValidator {
    this._manager.asMessageOfType(type)
    return this
  }

  public asVerboseMessage(): UnidocTreeValidator {
    this._manager.asVerboseMessage()
    return this
  }

  public asInformationMessage(): UnidocTreeValidator {
    this._manager.asInformationMessage()
    return this
  }

  public asWarningMessage(): UnidocTreeValidator {
    this._manager.asWarningMessage()
    return this
  }

  public asErrorMessage(): UnidocTreeValidator {
    this._manager.asErrorMessage()
    return this
  }

  public asFailureMessage(): UnidocTreeValidator {
    this._manager.asFailureMessage()
    return this
  }

  public ofCode(code: string): UnidocTreeValidator {
    this._manager.ofCode(code)
    return this
  }

  public withData(key: string, value: any): UnidocTreeValidator {
    this._manager.withData(key, value)
    return this
  }

  public produce(): UnidocTreeValidator {
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
    for (const branch of this._pass) {
      branch.complete()
    }

    if (this._pass.size > 0) {
      this._pass.last.last()
      this._pass.clear()
    }

    this._manager.complete()
  }

  public handleFailure(error: Error): void {
    console.error(error)
  }

  public validate(event: UnidocEvent) {
    if (this._pass.size > 0) {
      for (const branch of this._pass) {
        branch.validate()
        this._manager.validate(branch.branch, event)
        branch.validate(event)

        if (branch.running) {
          this._nextPass.push(branch)
        }
      }

      if (this._nextPass.size <= 0) {
        this._pass.last.last()
      }

      for (const branch of this._pass) {
        if (!branch.running) {
          this._manager.completeBranch(branch.branch)
        }
      }

      this._pass.clear()
      this.swap()
    }
  }

  public continue(process: UnidocBranchValidator) {
    this._nextPass.push(process)
  }

  public execute(automata: UnidocBranchAutomata): void {
    const branch: UnidocBranchValidator = new UnidocBranchValidator(this)
    branch.automata = automata
    branch.branch.set(0, 0)

    this._pass.clear()
    this._nextPass.clear()
    this._pass.push(branch)
  }

  public fork(branch: UnidocBranchValidator, automata: UnidocBranchAutomata): void {
    const nextBranch: UnidocBranchValidator = new UnidocBranchValidator(this)
    nextBranch.branch.copy(this._manager.fork(branch.branch).branch)
    nextBranch.automata = automata

    this._manager.initializeBranch(nextBranch.branch)
    nextBranch.initialize()

    this._pass.push(nextBranch)
  }

  private swap(): void {
    const temporary: Pack<UnidocBranchValidator> = this._pass
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
