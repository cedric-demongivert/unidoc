import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocValidation } from '../validation/UnidocValidation'

import { BaseUnidocValidator } from './BaseUnidocValidator'
import { UnidocValidator } from './UnidocValidator'

export class CompositeValidator extends BaseUnidocValidator {
  private _validators : Set<UnidocValidator>
  private _instances : UnidocValidator[]

  /**
  * Build a new composite validator.
  *
  * @param [validators=[]] validators - Child validators to add to this composite validator.
  */
  public constructor (validators : Iterable<UnidocValidator> = []) {
    super()

    this.handleSubValidation = this.handleSubValidation.bind(this)

    this._validators = new Set<UnidocValidator>()
    this._instances = []

    for (const validator of validators) {
      this._validators.add(validator)
    }
  }

  /**
  * Add the given validator to this composite validator.
  *
  * @param validator - A validator to add to this composite validator.
  */
  public addValidator (validator : UnidocValidator) : void {
    this._validators.add(validator)
  }

  /**
  * Remove the given validator from this composite validator.
  *
  * @param validator - A validator to remove from this composite validator.
  */
  public deleteValidator (validator : UnidocValidator) : void {
    this._validators.delete(validator)
  }

  /**
  * Remove all validators from this composite validator.
  */
  public deleteAllValidator () : void {
    this._validators.clear()
    this._instances.length = 0
  }

  /**
  * Return true if this validator contains the given validator.
  *
  * @param validator - A validator to search for.
  *
  * @return True if this validator contains the given validator.
  */
  public hasValidator (validator : UnidocValidator) : boolean {
    return this._validators.has(validator)
  }

  /**
  * Handle the next validation event emitted by a child validator.
  *
  * @param validation - Validation that was emitted.
  */
  private handleSubValidation (validation : UnidocValidation) : void {
    this.emitValidation(validation)
  }

  /**
  * @see UnidocValidator.next
  */
  public next (event : UnidocEvent) : void {
    if (this._instances.length !== this._validators.size) {
      this._instances.length = 0

      for (const validator of this._validators) {
        const instance : UnidocValidator = validator.clone()
        instance.addEventListener('validation', this.handleSubValidation)
        this._instances.push(instance)
      }
    }

    for (const validator of this._instances) {
      validator.next(event)
    }
  }

  /**
  * @see UnidocValidator.complete
  */
  public complete () : void {
    for (const validator of this._instances) {
      validator.complete()
      validator.removeEventListener('validation', this.handleSubValidation)
    }

    this._instances.length = 0
    this.emitCompletion()
  }

  /**
  * @see UnidocValidator.clear
  */
  public clear () : void {
    super.clear()

    for (const validator of this._instances) {
      validator.removeEventListener('validation', this.handleSubValidation)
    }

    this.deleteAllValidator()
    this._instances.length = 0
  }

  /**
  * @see UnidocValidator.reset
  */
  public reset (): void {
    for (const instance of this._instances) {
      instance.reset()
    }
  }

  /**
  * @see BaseUnidocValidator.copy
  */
  public copy (toCopy : CompositeValidator) : void {
    super.copy(toCopy)

    this._validators.clear()
    this._instances.length = 0

    for (const validator of toCopy._validators) {
      this._validators.add(validator)
    }

    for (const instance of toCopy._instances) {
      const copy : UnidocValidator = instance.clone()
      copy.removeAllEventListeners('*')
      copy.addEventListener('validation', this.handleSubValidation)
      this._instances.push(copy)
    }
  }

  /**
  * @see UnidocValidator.clone
  */
  public clone() : CompositeValidator {
    const result : CompositeValidator = new CompositeValidator()

    result.copy(this)

    return result
  }

  /**
  * @see Symbol.iterator
  */
  public * [Symbol.iterator] () : Iterator<UnidocValidator> {
    yield * this._validators
  }
}
