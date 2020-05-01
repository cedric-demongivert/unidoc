import { UnidocEvent } from '../event/UnidocEvent'

import { BasicQuery } from './BasicQuery'
import { AtomicOperator } from './AtomicOperator'

export class TruthyQuery
     extends BasicQuery<boolean>
  implements AtomicOperator<boolean>
{
  /**
  * @see UnidocQuery.start
  */
  public start () : void {

  }

  /**
  * @see UnidocQuery.next
  */
  public next (event : UnidocEvent) : void {
    this.emit(true)
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
  public clone () : TruthyQuery {
    const selector : TruthyQuery = new TruthyQuery()

    selector.copy(this)

    return selector
  }

  /**
  * @see UnidocQuery.toString
  */
  public toString () : string {
    return 'true'
  }
}
