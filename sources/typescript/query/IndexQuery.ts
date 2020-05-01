import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocEventType } from '../event/UnidocEventType'

import { BasicQuery } from './BasicQuery'

export class IndexQuery extends BasicQuery<number> {
  private _current : number
  private _tags : number[]

  public constructor () {
    super()
    this._current = 0
    this._tags = []
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
      case UnidocEventType.END_TAG:
        return this.emit(this._tags.pop())
      case UnidocEventType.START_TAG:
        this._tags.push(this._current)
      default:
        const result : number = this._current
        this._current += 1
        return this.emit(result)
    }
  }

  /**
  * @see UnidocQuery.complete
  */
  public complete () : void {
    this._current = 0
    this.emitCompletion()
  }

  /**
  * @see UnidocQuery.reset
  */
  public reset () : void {
    this._current = 0
  }

  /**
  * @see UnidocQuery.clone
  */
  public clone () : IndexQuery {
    const selector : IndexQuery = new IndexQuery()

    selector._current = this._current

    for (const value of this._tags) {
      selector._tags.push(value)
    }

    selector.copy(this)

    return selector
  }

  /**
  * @see UnidocQuery.toString
  */
  public toString () : string {
    return '$ELEMENT-INDEX'
  }
}
