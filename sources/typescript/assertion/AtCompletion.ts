import { UnidocEvent } from '../event/UnidocEvent'

import { UnidocAssertion } from './UnidocAssertion'

export class AtCompletion implements UnidocAssertion {
  /**
  * State of this assertion.
  */
  private _state : boolean

  /**
  * Operand.
  */
  public readonly operand : UnidocAssertion

  /**
  * Instantiate a new assertion.
  *
  * @param operand - Assertion to use.
  */
  public constructor (operand : UnidocAssertion) {
    this._state = false
    this.operand = operand
  }

  /**
  * @see UnidocAssertion.state
  */
  public get state () : boolean {
    return this._state && this.operand.state
  }

  /**
  * @see UnidocAssertion.next
  */
  public next (event : UnidocEvent) : boolean {
    return this._state && this.operand.next(event)
  }

  /**
  * @see UnidocAssertion.complete
  */
  public complete () : boolean {
    this._state = true
    return this._state && this.operand.complete()
  }

  /**
  * @see UnidocAssertion.clone
  */
  public clone () : AtCompletion {
    const result : AtCompletion = new AtCompletion(this.operand.clone())

    result._state = this._state

    return result
  }

  /**
  * @see UnidocAssertion.reset
  */
  public reset () : boolean {
    this._state = false
    return this._state && this.operand.reset()
  }

  /**
  * @see Object.toString
  */
  public toString () : string {
    return 'at completion ' + this.operand.toString
  }
}
