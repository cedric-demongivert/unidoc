import { UnidocEvent } from '../event/UnidocEvent'

import { UnidocAssertion } from './UnidocAssertion'

export class Negation implements UnidocAssertion {
  /**
  * State of this assertion.
  */
  private _state : boolean

  /**
  * Assertion to negate.
  */
  public readonly operand : UnidocAssertion

  /**
  * Instantiate a new assertion.
  *
  * @param operand - Assertion to negate.
  */
  public constructor (operand : UnidocAssertion) {
    this._state = !operand.state
    this.operand = operand
  }

  /**
  * @see UnidocAssertion.state
  */
  public get state () : boolean {
    return this._state
  }

  /**
  * @see UnidocAssertion.next
  */
  public next (event: UnidocEvent) : boolean {
    this._state = !this.operand.next(event)
    return this._state
  }

  /**
  * @see UnidocAssertion.complete
  */
  public complete () : boolean {
    this._state = !this.operand.complete()
    return this._state
  }

  /**
  * @see UnidocAssertion.clone
  */
  public clone () : Negation {
    return new Negation(this.operand.clone())
  }

  /**
  * @see UnidocAssertion.reset
  */
  public reset () : boolean {
    this._state = !this.operand.reset()
    return this._state
  }

  /**
  * @see Object.toString
  */
  public toString () : string {
    return 'not ' + this.operand.toString
  }
}
