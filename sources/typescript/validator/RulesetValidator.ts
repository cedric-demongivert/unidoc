import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocValidation } from '../validation/UnidocValidation'
import { UnidocQuery } from '../query/UnidocQuery'
import { nothing } from '../query/nothing'

import { UnidocValidator } from './UnidocValidator'
import { Rule } from './Rule'

export class RulesetValidator implements UnidocValidator {
  /**
  * A listener called when a value is published by this query.
  */
  public resultListener : UnidocQuery.ResultListener<UnidocValidation>

  /**
  * A listener called when the output stream of this query reach it's end.
  */
  public completionListener : UnidocQuery.CompletionListener

  private readonly _rules : Rule<any>[]

  private _all            : UnidocQuery<UnidocEvent, UnidocValidation>

  public constructor () {
    this._rules = []
    this._all = null

    this.handleValidation = this.handleValidation.bind(this)
    this.handleCompletion = this.handleCompletion.bind(this)

    this.resultListener = nothing
    this.completionListener = nothing
  }

  private handleValidation (validation : UnidocValidation) : void {
    this.resultListener(validation)
  }

  private handleCompletion () : void {
    this.completionListener()
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
    this._all.resultListener = this.handleValidation
    this._all.completionListener = this.handleCompletion

    this._all.start()
  }

  /**
  * @see UnidocQuery.next
  */
  public next (event : UnidocEvent) : void {
    this._all.next(event)
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

    this.resultListener = nothing
    this.completionListener = nothing
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
    this.resultListener = toCopy.resultListener
    this.completionListener = toCopy.completionListener
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
