import { UnidocEvent } from '../event/UnidocEvent'

import { UnidocQuery } from './UnidocQuery'
import { FilteredQuery } from './FilteredQuery'
import { UnaryOperator } from './UnaryOperator'

export class FilteringQuery
     extends FilteredQuery<UnidocEvent>
  implements UnaryOperator<boolean, UnidocEvent>
{
  /**
  * Operand of this filter.
  */
  public readonly operand : UnidocQuery<boolean>

  /**
  * Instantiate a new filter.
  *
  * @param operand - Operand of the filter to instantiate.
  */
  public constructor (operand : UnidocQuery<boolean>) {
    super(operand)
    this.operand = operand
  }

  /**
  * @see FilteredQuery.handleFilteredEvent
  */
  protected handleFilteredEvent (event : UnidocEvent) : void {
    this.emit(event)
  }

  /**
  * @see FilteredQuery.handleFilteredEventCompletion
  */
  protected handleFilteredEventCompletion () : void {
    this.emitCompletion()
  }

  /**
  * @see UnidocQuery.clone
  */
  public clone () : FilteringQuery {
    const result : FilteringQuery = new FilteringQuery(this.operand.clone())

    result.copy(this)

    return result
  }

  /**
  * @see UnidocQuery.toString
  */
  public toString () : string {
    return 'FILTERING BY ' + this.operand.toString()
  }
}
