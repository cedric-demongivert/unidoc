import { UnidocValidation } from '../validation/UnidocValidation'

import { ValidationBus } from './ValidationBus'
import { ValidationElement } from './ValidationElement'
import { ValidationState } from './ValidationState'

const VALIDATION : UnidocValidation = new UnidocValidation()

export class StaticValidationElement implements ValidationElement {
  /**
  * Underlying validation bus.
  */
  private readonly _bus : ValidationBus

  /**
  * The validation state of this element.
  */
  private _state : ValidationState

  /**
  * @see ValidationElement.validation
  */
  public readonly validation : UnidocValidation

  /**
  * @see ValidationElement.state
  */
  public get state () : ValidationState {
    return this._state
  }

  public constructor (bus : ValidationBus) {
    this._bus = bus
    this._state = ValidationState.DEFAULT
    this.validation = VALIDATION
  }

  /**
  * @see ValidationElement.emit
  */
  public emit (validation : UnidocValidation) : void {
    this._bus.emit(validation)
    this._state = Math.max(
      this._state,
      ValidationState.fromValidationType(validation.type)
    )
  }

  /**
  * @see ValidationElement.complete
  */
  public complete () : void {
    if (this._state === ValidationState.NEUTRAL) {
      this._state = ValidationState.SUCCESS
    }
  }

  /**
  * @see ValidationElement.reset
  */
  public reset () : void {
    this._state = ValidationState.DEFAULT
  }
}
