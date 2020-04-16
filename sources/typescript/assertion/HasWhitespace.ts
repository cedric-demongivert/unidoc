import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocEventType } from '../event/UnidocEventType'

import { UnidocAssertion } from './UnidocAssertion'

export class HasWhitespace implements UnidocAssertion {
  /**
  * State of this assertion.
  */
  private _state : boolean

  /**
  * Instantiate a new assertion.
  */
  public constructor () {
    this._state = false
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
    this._state = this._state || event.type === UnidocEventType.WHITESPACE
    return this._state
  }

  /**
  * @see UnidocAssertion.complete
  */
  public complete () : boolean {
    return this._state
  }

  /**
  * @see UnidocAssertion.clone
  */
  public clone () : HasWhitespace {
    const result : HasWhitespace = new HasWhitespace()
    result._state = this._state
    return result
  }

  /**
  * @see UnidocAssertion.reset
  */
  public reset () : boolean {
    this._state = false
    return this._state
  }

  /**
  * @see Object.toString
  */
  public toString () : string {
    return 'has whitespace'
  }
}
