import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocValidation } from '../validation/UnidocValidation'
import { UnidocQuery } from '../query/UnidocQuery'

import { BaseUnidocValidator } from './BaseUnidocValidator'

export class RulesetValidator extends BaseUnidocValidator {
  private _rules               : UnidocQuery<UnidocEvent, boolean>[]
  private _consequences        : AssertionValidator.Consequence[]

  private readonly _validation : UnidocValidation

  private _completed : number

  public constructor () {
    super()

    this._rules        = []
    this._consequences = []
    this._validation   = new UnidocValidation()
    this._completed    = 0
  }

  /**
  * Add the given rule to this ruleset.
  *
  * Must be followed by a thenEmit call to define the consequence of the given
  * rule.
  *
  * @param rule - A rule to add to this validator ruleset.
  */
  public whenTruthy (rule : UnidocQuery<UnidocEvent, boolean>) : void {
    this._rules.push(rule)
  }

  /**
  * Add the negation of the given rule to this ruleset.
  *
  * Must be followed by a thenEmit call to define the consequence of the given
  * rule.
  *
  * @param rule - A rule to negate and add to this validator ruleset.
  */
  public whenFalsy (rule : UnidocQuery<UnidocEvent, boolean>) : void {
    this._rules.push(UnidocQuery.not(rule))
  }

  /**
  * Declare the consequence of a previously added rule.
  *
  * @param formatter - A consequence to add for a previously added rule.
  */
  public thenEmit (formatter : AssertionValidator.Consequence) : void {
    this._consequences.push(formatter)
  }

  private handleNextValue (index : number, value : boolean) : void {
    if (value) {
      this._consequences[index](value)
    }
  }

  /**
  * @see UnidocQuery.start
  */
  public start () : void {
    for (const rule of this._rules) {
      rule.start()
    }
  }

  /**
  * @see UnidocQuery.next
  */
  public next (event : UnidocEvent) : void {
    for (const rule of this._rules) {
      rule.next(event)
    }
  }

  /**
  * @see UnidocValidator.complete
  */
  public complete () : void {
    for (const rule of this._rules) {
      rule.complete()
    }
  }

  /**
  * @see UnidocValidator.clear
  */
  public clear () : void {
    super.clear()

    this._rules.length = 0
    this._consequences.length = 0
  }

  /**
  * @see UnidocValidator.reset
  */
  public reset () : void {
    for (const assertion of this._rules) {
      assertion.reset()
    }
  }

  /**
  * @see BaseUnidocValidator.copy
  */
  public copy (toCopy : AssertionValidator) : void {
    super.copy(toCopy)

    this._rules.length = 0
    this._consequences.length = 0

    for (const assertion of toCopy._assertions) {
      this._rules.push(assertion.clone())
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
