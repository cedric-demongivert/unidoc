import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocEventType } from '../event/UnidocEventType'

import { BasicQuery } from './BasicQuery'

export class CountQuery extends BasicQuery<number> {
  private _current : number

  public constructor () {
    super()
    this._current = 0
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
        return this.emit(this._current)
      default:
        this._current += 1
        return this.emit(this._current)
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
  public clone () : CountQuery {
    const selector : CountQuery = new CountQuery()

    selector._current = this._current
    selector.copy(this)

    return selector
  }

  /**
  * @see UnidocQuery.toString
  */
  public toString () : string {
    return '$ELEMENT-COUNT'
  }
}
