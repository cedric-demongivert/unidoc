import { Sequence } from '@cedric-demongivert/gl-tool-collection'
import { Pack } from '@cedric-demongivert/gl-tool-collection'

import { UnidocEvent } from '../../event/UnidocEvent'
import { UnidocBlueprint } from '../../blueprint/UnidocBlueprint'
import { UnidocValidationBranchIdentifier } from '../../validation/UnidocValidationBranchIdentifier'
import { UnidocValidationMessageType } from '../../validation/UnidocValidationMessageType'

import { TooManyErrors } from './messages/TooManyErrors'

import { UnidocBlueprintValidationState } from './UnidocBlueprintValidationState'
import { UnidocBlueprintValidator } from './UnidocBlueprintValidator'
import { UnidocBlueprintResolver } from './UnidocBlueprintResolver'

const MAX_ALLOWED_RECOVERIES: number = 5

export class UnidocBlueprintValidationProcess {
  /**
  * A view over the stack of states of this validation process.
  */
  public readonly states: Sequence<UnidocBlueprintValidationState>

  /**
  * The underlying stack of states of this validation process.
  */
  private readonly _states: Pack<UnidocBlueprintValidationState>

  private recoveries: number

  public readonly branch: UnidocValidationBranchIdentifier

  public readonly validator: UnidocBlueprintValidator

  public get running(): boolean {
    return this._states.size > 0
  }

  /**
  *
  */
  public constructor(validator: UnidocBlueprintValidator, capacity: number = 16) {
    this._states = Pack.any(capacity)
    this.states = this._states.view()
    this.validator = validator
    this.branch = new UnidocValidationBranchIdentifier()
    this.recoveries = 0
  }

  public asMessageOfType(type: UnidocValidationMessageType): UnidocBlueprintValidationProcess {
    this.validator.fromProcess(this).asMessageOfType(type)
    return this
  }

  public asVerboseMessage(): UnidocBlueprintValidationProcess {
    this.validator.fromProcess(this).asVerboseMessage()
    return this
  }

  public asInformationMessage(): UnidocBlueprintValidationProcess {
    this.validator.fromProcess(this).asInformationMessage()
    return this
  }

  public asWarningMessage(): UnidocBlueprintValidationProcess {
    this.validator.fromProcess(this).asWarningMessage()
    return this
  }

  public asErrorMessage(): UnidocBlueprintValidationProcess {
    this.validator.fromProcess(this).asErrorMessage()
    return this
  }

  public asFailureMessage(): UnidocBlueprintValidationProcess {
    this.validator.fromProcess(this).asFailureMessage()
    return this
  }

  public ofCode(code: string): UnidocBlueprintValidationProcess {
    this.validator.ofCode(code)
    return this
  }

  public withData(key: string, value: any): UnidocBlueprintValidationProcess {
    this.validator.withData(key, value)
    return this
  }

  public produce(): void {
    this.validator.produce()
  }

  /**
  * Called after the emission of an error.
  */
  public recover(): boolean {
    if (this.recoveries < MAX_ALLOWED_RECOVERIES) {
      this.recoveries += 1

      return true
    } else {
      this.asMessageOfType(TooManyErrors.TYPE)
        .ofCode(TooManyErrors.CODE)
        .withData(TooManyErrors.Data.RECOVERIES, MAX_ALLOWED_RECOVERIES)
        .produce()

      this.stop()

      return false
    }
  }

  /**
  *
  */
  public fork(): UnidocBlueprintValidationProcess {
    const fork: UnidocBlueprintValidationProcess = (
      new UnidocBlueprintValidationProcess(
        this.validator,
        this._states.capacity
      )
    )

    this.validator.fork(this, fork)

    fork.recoveries = this.recoveries

    for (const state of this._states) {
      fork._states.push(state.fork())
    }

    for (const state of fork._states) {
      state.onFork(fork)
    }

    return fork
  }


  /**
  *
  */
  public enter(state: UnidocBlueprint): void
  public enter(state: UnidocBlueprintValidationState): void
  public enter(parameter: UnidocBlueprint | UnidocBlueprintValidationState): void {
    let state: UnidocBlueprintValidationState;

    if (parameter instanceof UnidocBlueprintValidationState) {
      state = parameter
    } else {
      state = UnidocBlueprintResolver.resolve(parameter)
    }

    this._states.push(state)
    state.onEnter(this)
  }

  /**
  *
  */
  public exit(): void {
    this._states.last.onExit()
    this._states.pop()

    if (this._states.size > 0) {
      this._states.last.onResume()
    }
  }

  /**
  *
  */
  public stop(): void {
    while (this._states.size > 0) {
      this._states.last.onExit()
      this._states.pop()
    }
  }

  /**
  * Called to pursue the validation process.
  */
  public continue(): void {
    while (this._states.size > 0 && !this._states.last.doesRequireEvent()) {
      this._states.last.onContinue()
    }
  }

  /**
  * Called to pursue the validation process.
  *
  * @param next - The next available event to validate, if any.
  */
  public validate(event: UnidocEvent): void {
    if (this._states.size > 0) {
      this._states.last.onValidate(event)
    }
  }

  /**
  * Called to complete the validation process.
  *
  * @param previous - The previous event that was received, if any.
  */
  public complete(): void {
    if (this._states.size > 0) {
      this._states.last.onComplete()
    }
  }
}
