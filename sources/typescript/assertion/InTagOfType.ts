import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocEventType } from '../event/UnidocEventType'

import { UnidocAssertion } from './UnidocAssertion'

export class InTagOfType implements UnidocAssertion {
  /**
  * Type of tag to search.
  */
  public readonly type  : string

  private _depth : number

  /**
  * Instantiate a new assertion.
  *
  * @param type - Type of tag to search.
  */
  public constructor (type : string) {
    this._depth = 0
    this.type = type
  }

  /**
  * @see UnidocAssertion.state
  */
  public get state () : boolean {
    return this._depth > 0
  }

  /**
  * @see UnidocAssertion.next
  */
  public next (event: UnidocEvent) : boolean {
    if (this._depth === 0) {
      switch (event.type) {
        case UnidocEventType.START_TAG:
          this._depth += event.tag.toLowerCase() === this.type ? 1 : 0
          break
        case UnidocEventType.END_TAG:
          this._depth -= event.tag.toLowerCase() === this.type ? 1 : 0
          break
      }
    } else {
      switch (event.type) {
        case UnidocEventType.START_TAG:
          this._depth += 1
          break
        case UnidocEventType.END_TAG:
          this._depth -= 1
          break
      }
    }

    return this._depth > 0
  }

  /**
  * @see UnidocAssertion.complete
  */
  public complete () : boolean {
    return this._depth > 0
  }

  /**
  * @see UnidocAssertion.clone
  */
  public clone () : InTagOfType {
    const result : InTagOfType = new InTagOfType(this.type)
    result._depth = this._depth
    return result
  }

  /**
  * @see UnidocAssertion.reset
  */
  public reset () : boolean {
    this._depth = 0
    return false
  }

  /**
  * @see Object.toString
  */
  public toString () : string {
    return 'in ' + this.type + ' tag'
  }
}
