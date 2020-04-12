import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocValidation } from '../validation/UnidocValidation'

import { BaseUnidocValidator } from './BaseUnidocValidator'
import { UnidocValidator } from './UnidocValidator'

export class CompositeValidator extends BaseUnidocValidator {
  private _validators : Set<UnidocValidator>

  /**
  * Build a new composite validator.
  *
  * @param [validators=[]] validators - Child validators to add to this composite validator.
  */
  public constructor (validators : UnidocValidator[] = []) {
    super()

    this.handleNextValidation = this.handleNextValidation.bind(this)
    this._validators = new Set<UnidocValidator>()

    for (const validator of validators) {
      this._validators.add(validator)
      validator.addEventListener('validation', this.handleNextValidation)
    }
  }

  /**
  * Add the given validator to this composite validator.
  *
  * @param validator - A validator to add to this composite validator.
  */
  public addValidator (validator : UnidocValidator) : void {
    this._validators.add(validator)
    validator.addEventListener('validation', this.handleNextValidation)
  }

  /**
  * Remove the given validator from this composite validator.
  *
  * @param validator - A validator to remove from this composite validator.
  */
  public deleteValidator (validator : UnidocValidator) : void {
    this._validators.delete(validator)
    validator.removeEventListener('validation', this.handleNextValidation)
  }

  /**
  * Remove all validators from this composite validator.
  */
  public deleteAllValidator () : void {
    for (const validator of this._validators) {
      validator.removeEventListener('validation', this.handleNextValidation)
    }

    this._validators.clear()
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
  private handleNextValidation (validation : UnidocValidation) : void {
    this.emitValidation(validation)
  }

  /**
  * @see UnidocValidator.next
  */
  public next (event : UnidocEvent) : void {
    for (const validator of this._validators) {
      validator.next(event)
    }
  }

  /**
  * @see UnidocValidator.complete
  */
  public complete () : void {
    for (const validator of this._validators) {
      validator.complete()
    }

    this.emitCompletion()
  }

  /**
  * @see UnidocValidator.clear
  */
  public clear () : void {
    super.clear()
    this.deleteAllValidator()
  }

  /**
  * @see UnidocValidator.reset
  */
  public reset (): void {
    for (const validator of this._validators) {
      validator.reset()
    }
  }

  /**
  * @see BaseUnidocValidator.copy
  */
  public copy (toCopy : CompositeValidator) : void {
    super.copy(toCopy)

    this.deleteAllValidator()

    for (const validator of toCopy._validators) {
      const copy : UnidocValidator = validator.clone()

      copy.removeAllEventListeners('*')
      copy.addEventListener('validation', this.handleNextValidation)

      this._validators.add(copy)
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
