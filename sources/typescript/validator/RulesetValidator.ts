import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocValidation } from '../validation/UnidocValidation'
import { UnidocQuery } from '../query/UnidocQuery'
import { Sink } from '../query/Sink'

import { UnidocValidator } from './UnidocValidator'
import { Rule } from './Rule'

export class RulesetValidator implements UnidocValidator {
  /**
  * A listener called when a value is published by this query.
  */
  private _output : Sink<UnidocValidation>

  private readonly _rules : Rule<any>[]

  private _all            : UnidocQuery<UnidocEvent, UnidocValidation>

  public constructor () {
    this._rules = []
    this._all = null

    this._output = Sink.NONE
  }

  public get output () : Sink<UnidocValidation> {
    return this._output
  }

  public set output (value : Sink<UnidocValidation>) {
    this._output = value

    if (this._all) {
      this._all.output = value
    }
  }

  /**
  * Add the given rule to this ruleset.
  *
  * @param rule - A rule to add to this validator ruleset.
  */
  public add (rule : Rule<any>) : void {
    this._rules.push(rule)
  }

  /**
  * @see UnidocQuery.start
  */
  public start () : void {
    this._all = UnidocQuery.all(...this._rules)
    this._all.output = this.output

    this._all.start()
  }

  /**
  * @see UnidocQuery.next
  */
  public next (event : UnidocEvent) : void {
    this._all.next(event)
  }

  /**
  * @see UnidocQuery.error
  */
  public error (error : Error) : void {
    this._output.error(error)
  }

  /**
  * @see UnidocValidator.complete
  */
  public complete () : void {
    this._all.complete()
  }

  /**
  * @see UnidocValidator.clear
  */
  public clear () : void {
    this._all = null
    this._rules.length = 0

    this.output = Sink.NONE
  }

  /**
  * @see UnidocValidator.reset
  */
  public reset () : void {
    this._all.reset()
  }

  /**
  * @see UnidocValidator.clone
  */
  public copy (toCopy : RulesetValidator) : void {
    this._rules.length = 0

    for (const rule of toCopy._rules) {
      this._rules.push(rule.clone())
    }

    this._all = UnidocQuery.clone(toCopy._all)
    this.output = toCopy.output
  }

  /**
  * @see UnidocValidator.clone
  */
  public clone () : RulesetValidator {
    const result : RulesetValidator = new RulesetValidator()

    result.copy(this)

    return result
  }
}
