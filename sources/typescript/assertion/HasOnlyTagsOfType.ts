import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocEventType } from '../event/UnidocEventType'

import { UnidocAssertion } from './UnidocAssertion'

export class HasOnlyTagsOfType implements UnidocAssertion {
  /**
  * State of this assertion.
  */
  private _state : boolean

  /**
  * Allowed types.
  */
  public readonly types : Set<string>

  /**
  * Instantiate a new assertion.
  *
  * @param type - Type of tag to search.
  */
  public constructor (types : Iterable<string>) {
    this._state = true
    this.types = new Set<string>(types)
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
    this._state = this._state && (
      event.type !== UnidocEventType.START_TAG ||
      this.types.has(event.tag.toLowerCase())
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
  public clone () : HasOnlyTagsOfType {
    const result : HasOnlyTagsOfType = new HasOnlyTagsOfType(this.types)
    result._state = this._state
    return result
  }

  /**
  * @see UnidocAssertion.reset
  */
  public reset () : boolean {
    this._state = true
    return this._state
  }

  /**
  * @see Object.toString
  */
  public toString () : string {
    return 'has only ' + [...this.types].join(', ') + ' tags'
  }
}
