import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocEventType } from '../event/UnidocEventType'

import { UnidocAssertion } from './UnidocAssertion'

export class HasTagOfType implements UnidocAssertion {
  /**
  * State of this assertion.
  */
  private _state : boolean

  /**
  * Type of tag to search.
  */
  public readonly type  : string

  /**
  * Instantiate a new assertion.
  *
  * @param type - Type of tag to search.
  */
  public constructor (type : string) {
    this._state = false
    this.type = type
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
    this._state = this._state || (
      event.type === UnidocEventType.START_TAG &&
      event.tag.toLowerCase() === this.type
    )

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
  public clone () : HasTagOfType {
    const result : HasTagOfType = new HasTagOfType(this.type)
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
    return 'has ' + this.type + ' tag'
  }
}
