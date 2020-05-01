import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocEventType } from '../event/UnidocEventType'

import { UnidocQuery } from './UnidocQuery'
import { FilteredQuery } from './FilteredQuery'
import { UnaryOperator } from './UnaryOperator'

export class CountQuery
     extends FilteredQuery<number>
     implements UnaryOperator<boolean, number>
{
  public readonly operand : UnidocQuery<boolean>

  private _current : number

  public constructor (filter : UnidocQuery<boolean>) {
    super(filter)
    this.operand = filter
    this._current = 0
  }

  /**
  * @see FilteredQuery.handleFilteredEvent
  */
  protected handleFilteredEvent (event : UnidocEvent) : void {
    switch (event.type) {
      case UnidocEventType.END_TAG:
        return this.emit(this._current)
      default:
        this._current += 1
        return this.emit(this._current)
    }
  }

  /**
  * @see FilteredQuery.handleFilteredEventCompletion
  */
  protected handleFilteredEventCompletion () : void {
    this._current = 0
    this.emitCompletion()
  }

  /**
  * @see UnidocQuery.reset
  */
  public reset () : void {
    super.reset()
    this._current = 0
  }

  /**
  * @see UnidocQuery.clone
  */
  public clone () : CountQuery {
    const selector : CountQuery = new CountQuery(this.filter.clone())

    selector._current = this._current
    selector.copy(this)

    return selector
  }

  /**
  * @see UnidocQuery.toString
  */
  public toString () : string {
    return 'COUNT ' + this.operand.toString()
  }
}
