import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocValidation } from '../validation/UnidocValidation'
import { UnidocAssertion } from '../assertion/UnidocAssertion'

import { BaseUnidocValidator } from './BaseUnidocValidator'

export class AssertionValidator extends BaseUnidocValidator {
  private _assertions   : UnidocAssertion[]
  private _consequences : AssertionValidator.Consequence[]

  private readonly _validation : UnidocValidation

  public constructor () {
    super()

    this._assertions = []
    this._consequences = []
    this._validation = new UnidocValidation()
  }

  public whenGoesTruthy (assertion : UnidocAssertion) : void {
    this._assertions.push(assertion)
  }

  public whenGoesFalsy (assertion : UnidocAssertion) : void {
    this._assertions.push(UnidocAssertion.not(assertion))
  }

  public thenEmit (formatter : AssertionValidator.Consequence) : void {
    this._consequences.push(formatter)
  }

  /**
  * @see UnidocValidator.next
  */
  public next (event : UnidocEvent) : void {
    for (let index = 0, size = this._assertions.length; index < size; ++index) {
      const assertion : UnidocAssertion = this._assertions[index]
      const oldState : boolean = assertion.state

      if (!oldState && assertion.next(event)) {
        this._consequences[index](this._validation, event, assertion)
        this.emitValidation(this._validation)
      }
    }
  }

  /**
  * @see UnidocValidator.complete
  */
  public complete () : void {
    for (let index = 0, size = this._assertions.length; index < size; ++index) {
      const assertion : UnidocAssertion = this._assertions[index]
      const oldState : boolean = assertion.state

      if (!oldState && assertion.complete()) {
        this._consequences[index](this._validation, undefined, assertion)
        this.emitValidation(this._validation)
      }
    }

    this.emitCompletion()
  }

  /**
  * @see UnidocValidator.clear
  */
  public clear () : void {
    super.clear()

    this._assertions.length = 0
    this._consequences.length = 0
  }

  /**
  * @see UnidocValidator.reset
  */
  public reset () : void {
    for (const assertion of this._assertions) {
      assertion.reset()
    }
  }

  /**
  * @see BaseUnidocValidator.copy
  */
  public copy (toCopy : AssertionValidator) : void {
    super.copy(toCopy)

    this._assertions.length = 0
    this._consequences.length = 0

    for (const assertion of toCopy._assertions) {
      this._assertions.push(assertion.clone())
    }

    for (const consequence of toCopy._consequences) {
      this._consequences.push(consequence)
    }
  }

  /**
  * @see UnidocValidator.clone
  */
  public clone () : AssertionValidator {
    const result : AssertionValidator = new AssertionValidator()

    result.copy(this)

    return result
  }
}

export namespace AssertionValidator {
  export type Consequence = (validation : UnidocValidation, event : UnidocEvent, assertion : UnidocAssertion) => void
}
