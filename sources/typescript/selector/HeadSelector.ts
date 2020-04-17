import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocEventType } from '../event/UnidocEventType'

import { UnidocSelector } from './UnidocSelector'

export class HeadSelector implements UnidocSelector {
  /**
  * The current element count.
  */
  private _current : number

  /**
  * The depth of current opened tags.
  */
  private readonly _tags    : number[]

  /**
  * The current depth.
  */
  private _depth   : number

  /**
  * The number of element to return.
  */
  public readonly count : number

  /**
  * Instantiate a new head selector.
  *
  * @param count - Number of element to return.
  */
  public constructor (count : number) {
    this.count = count
    this._current = 0
    this._tags = []
    this._depth = 0
  }

  /**
  * @see UnidocSelector.next
  */
  public next (event : UnidocEvent) : boolean {
    if (this._current < this.count) {
      switch (event.type) {
        case UnidocEventType.START_TAG:
          this._current += 1
          this._tags.push(this._depth)
          this._depth += 1
          return true
        case UnidocEventType.END_TAG:
          this._tags.pop()
          this._depth -= 1
          return true
        default:
          this._current += 1
          return true
      }
    } else if (this._tags.length > 0) {
      switch (event.type) {
        case UnidocEventType.START_TAG:
          this._depth += 1
          return false
        case UnidocEventType.END_TAG:
          this._depth -= 1

          if (this._tags[this._tags.length - 1] === this._depth) {
            this._tags.pop()
            return true
          }

          return false
        default:
          return false
      }
    } else {
      return false
    }
  }

  /**
  * @see UnidocSelector.reset
  */
  public reset () : void {
    this._current = 0
    this._tags.length = 0
    this._depth = 0
  }

  /**
  * @see UnidocSelector.clone
  */
  public clone () : HeadSelector {
    const result : HeadSelector = new HeadSelector(this.count)
    result._depth = this._depth
    result._current = this._current

    for (const tag of this._tags) {
      result._tags.push(tag)
    }

    return result
  }

  /**
  * @see UnidocSelector.toString
  */
  public toString () : string {
    return 'is first ' + this.count + ' element'
  }
}
