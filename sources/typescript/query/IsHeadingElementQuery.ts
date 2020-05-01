import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocEventType } from '../event/UnidocEventType'

import { BasicQuery } from './BasicQuery'

export class IsHeadingElementQuery extends BasicQuery<boolean> {
  /**
  * The current element count.
  */
  private _current : number

  /**
  * The depth of current opened tags.
  */
  private readonly _tags : number[]

  /**
  * The current depth.
  */
  private _depth : number

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
    super()

    this.count = count
    this._current = 0
    this._tags = []
    this._depth = 0
  }

  /**
  * @see UnidocQuery.start
  */
  public start () : void {

  }

  /**
  * @see UnidocQuery.next
  */
  public next (event : UnidocEvent) : void {
    switch (event.type) {
      case UnidocEventType.START_TAG : return this.handleNextTagStart()
      case UnidocEventType.END_TAG : return this.handleNextTagEnd()
      default : return this.handleNextElement()
    }
  }

  private handleNextElement () : void {
    if (this._current < this.count) {
      this._current += 1
      this.emit(true)
    } else {
      this.emit(false)
    }
  }

  private handleNextTagEnd () : void {
    this._depth -= 1

    if (this._current < this.count) {
      this._tags.pop()
      this.emit(true)
    } else if (this._tags.length > 0) {
      if (this._tags[this._tags.length - 1] === this._depth) {
        this._tags.pop()
        this.emit(true)
      } else {
        this.emit(false)
      }
    } else {
      this.emit(false)
    }
  }

  private handleNextTagStart () : void {
    if (this._current < this.count) {
      this._current += 1
      this._tags.push(this._depth)
      this.emit(true)
    } else {
      this.emit(false)
    }

    this._depth += 1
  }

  /**
  * @see UnidocQuery.complete
  */
  public complete () : void {
    this.emitCompletion()
  }

  /**
  * @see UnidocQuery.reset
  */
  public reset () : void {
    this._current = 0
    this._tags.length = 0
    this._depth = 0
  }

  /**
  * @see BasicQuery.copy
  */
  public copy (toCopy : IsHeadingElementQuery) : void {
    super.copy(toCopy)

    this._depth = toCopy._depth
    this._current = toCopy._current

    this._tags.length = 0

    for (const tag of toCopy._tags) {
      this._tags.push(tag)
    }
  }

  /**
  * @see UnidocQuery.clone
  */
  public clone () : IsHeadingElementQuery {
    const result : IsHeadingElementQuery = new IsHeadingElementQuery(this.count)

    result.copy(this)

    return result
  }

  /**
  * @see UnidocQuery.toString
  */
  public toString () : string {
    return 'IS FIRST ' + this.count + ' ELEMENT'
  }
}
