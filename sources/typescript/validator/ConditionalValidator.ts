import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocAssertion } from '../assertion/UnidocAssertion'
import { UnidocValidation } from '../Validation/UnidocValidation'

import { BaseUnidocValidator } from './BaseUnidocValidator'
import { UnidocValidator } from './UnidocValidator'

export class ConditionalValidator extends BaseUnidocValidator {
  private _assertions : UnidocAssertion[]
  private _validators : UnidocValidator[]
  private _instances  : UnidocValidator[]

  public constructor () {
    super()

    this.handleSubValidation = this.handleSubValidation.bind(this)

    this._assertions = []
    this._validators = []
    this._instances  = []
  }

  public whenTruthy (assertion : UnidocAssertion) : void {
    this._assertions.push(assertion)
  }

  public whenFalsy (assertion : UnidocAssertion) : void {
    this._assertions.push(UnidocAssertion.not(assertion))
  }

  public thenValidateUsing (validator : UnidocValidator) : void {
    this._validators.push(validator)
    this._instances.push(null)
  }

  private instantiate (index : number) : void {
    if (this._instances[index] == null) {
      const instance : UnidocValidator = this._validators[index].clone()
      instance.addEventListener('validation', this.handleSubValidation)
      this._instances[index] = instance
    }
  }

  private destroy (index : number) : void {
    if (this._instances[index] != null) {
      const instance : UnidocValidator = this._instances[index]
      this._instances[index] = null
      instance.complete()
      instance.removeEventListener('validation', this.handleSubValidation)
    }
  }

  /**
  * @see UnidocValidator#reset
  */
  public reset () : void {
    for (const assertion of this._assertions) {
      assertion.reset()
    }

    for (let index = 0, size = this._instances.length; index < size; ++index) {
      this._instances[index] = null
    }
  }

  /**
  * @see UnidocValidator#clear
  */
  public clear () : void {
    super.clear()

    this._validators.length = 0
    this._instances.length = 0
    this._assertions.length = 0
  }

  /**
  * @see BaseUnidocValidator#copy
  */
  public copy (toCopy : ConditionalValidator) : void {
    super.copy(toCopy)

    this._validators.length = 0
    this._instances.length = 0
    this._assertions.length = 0

    for (let index = 0, size = toCopy._assertions.length; index < size; ++index) {
      this._assertions.push(toCopy._assertions[index].clone())
      this._validators.push(toCopy._validators[index])
      this._instances.push(UnidocValidator.clone(toCopy._instances[index]))
    }
  }

  /**
  * @see UnidocValidator#next
  */
  public next (event : UnidocEvent) : void {
    for (let index = 0, size = this._assertions.length; index < size; ++index) {
      const assertion : UnidocAssertion = this._assertions[index]

      if (assertion.next(event)) {
        this.instantiate(index)
        this._instances[index].next(event)
      } else {
        this.destroy(index)
      }
    }
  }

  /**
  * @see UnidocValidator#complete
  */
  public complete () : void {
    for (let index = 0, size = this._assertions.length; index < size; ++index) {
      const assertion : UnidocAssertion = this._assertions[index]

      if (assertion.complete()) {
        this.instantiate(index)
        this._instances[index].complete()
      } else {
        this.destroy(index)
      }
    }
  }

  private handleSubValidation (validation : UnidocValidation) : void {
    this.emitValidation(validation)
  }

  /**
  * @see UnidocValidator#clone
  */
  public clone () : ConditionalValidator {
    const result : ConditionalValidator = new ConditionalValidator()

    result.copy(this)

    return result
  }
}
