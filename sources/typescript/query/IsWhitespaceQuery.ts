import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocEventType } from '../event/UnidocEventType'

import { BasicQuery } from './BasicQuery'

export class IsWhitespaceQuery extends BasicQuery<boolean> {
  /**
  * @see UnidocQuery.start
  */
  public start () : void {

  }

  /**
  * @see UnidocQuery.next
  */
  public next (event : UnidocEvent) : void {
    this.emit(event.type === UnidocEventType.WHITESPACE)
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
  public clone () : IsWhitespaceQuery {
    const selector : IsWhitespaceQuery = new IsWhitespaceQuery()

    selector.copy(this)

    return selector
  }

  /**
  * @see UnidocQuery.toString
  */
  public toString () : string {
    return 'is whitespace'
  }
}
