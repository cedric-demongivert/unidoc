import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocEventType } from '../event/UnidocEventType'

import { UnidocSelector } from './UnidocSelector'

export class ImmediateChildrenSelector implements UnidocSelector {
  /**
  * The current depth in the unidoc document relative to the begining of the
  * stream.
  */
  private _depth : number

  /**
  * Instantiate a new immediate children selector.
  */
  public constructor () {
    this._depth = 0
  }

  /**
  * @see UnidocSelector.next
  */
  public next (event: UnidocEvent) : boolean {
    if (this._depth < 0) {
      return false
    } else {
      switch (event.type) {
        case UnidocEventType.START_TAG:
          this._depth += 1
          return this._depth === 1
        case UnidocEventType.END_TAG:
          this._depth -= 1
          return this._depth === 0
        default:
          return this._depth === 0
      }
    }
  }

  /**
  * @see UnidocSelector.reset
  */
  public reset () : void {
    this._depth = 0
  }

  /**
  * @see UnidocSelector.clone
  */
  public clone () : ImmediateChildrenSelector {
    const result : ImmediateChildrenSelector = new ImmediateChildrenSelector()
    result._depth = this._depth

    return result
  }

  /**
  * @see UnidocSelector.toString
  */
  public toString () : string {
    return 'is immediate children'
  }
}
