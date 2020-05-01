import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocEventType } from '../event/UnidocEventType'

import { BasicQuery } from './BasicQuery'

export class DepthQuery extends BasicQuery<number> {
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
      case UnidocEventType.START_TAG:
        const result : number = this._current
        this._current += 1
        return this.emit(result)
      case UnidocEventType.END_TAG:
        this._current -= 1
      default:
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
  public clone () : DepthQuery {
    const selector : DepthQuery = new DepthQuery()

    selector._current = this._current
    selector.copy(this)

    return selector
  }

  /**
  * @see UnidocQuery.toString
  */
  public toString () : string {
    return '$ELEMENT-DEPTH'
  }
}
