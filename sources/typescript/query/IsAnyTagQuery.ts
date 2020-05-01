import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocEventType } from '../event/UnidocEventType'

import { BasicQuery } from './BasicQuery'

export class IsAnyTagQuery extends BasicQuery<boolean> {
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
      case UnidocEventType.END_TAG:
        return this.emit(true)
      default:
        return this.emit(false)
    }
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

  }

  /**
  * @see UnidocQuery.clone
  */
  public clone () : IsAnyTagQuery {
    const selector : IsAnyTagQuery = new IsAnyTagQuery()

    selector.copy(this)

    return selector
  }

  /**
  * @see UnidocQuery.toString
  */
  public toString () : string {
    return 'is tag'
  }
}
