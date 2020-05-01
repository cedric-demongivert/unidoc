import { CircularBuffer } from '@cedric-demongivert/gl-tool-collection'
import { Pack } from '@cedric-demongivert/gl-tool-collection'

import { UnidocEvent } from '../event/UnidocEvent'

import { BasicQuery } from './BasicQuery'
import { UnidocQuery } from './UnidocQuery'

export abstract class FilteredQuery<Output>
              extends BasicQuery<Output>
{
  /**
  * Filter used by this query.
  */
  public readonly filter : UnidocQuery<boolean>

  private readonly _events : CircularBuffer<UnidocEvent>

  /**
  * Instantiate a new filtered query.
  *
  * @param filter - Filter to use.
  */
  public constructor (filter : UnidocQuery<boolean>) {
    super()

    this.filter = filter
    this._events = CircularBuffer.fromPack(Pack.instance(UnidocEvent.ALLOCATOR, 16))

    this.handleNextFiltering = this.handleNextFiltering.bind(this)
    this.handleFilteringCompletion = this.handleFilteringCompletion.bind(this)

    this.filter.addEventListener('next', this.handleNextFiltering)
    this.filter.addEventListener('complete', this.handleFilteringCompletion)
  }

  /**
  * @see UnidocQuery.start
  */
  public start () : void {
    this.filter.start()
  }

  /**
  * Called to handle the next filtered event.
  *
  * @param event - Filtered event.
  */
  protected abstract handleFilteredEvent (event: UnidocEvent) : void

  /**
  * Called to handle the termination of the filtered event stream operation.
  */
  protected abstract handleFilteredEventCompletion () : void

  /**
  * @see UnidocQuery.next
  */
  public next (event: UnidocEvent) : void {
    this._events.push(event)
    this.filter.next(event)
  }

  /**
  * @see UnidocQuery.complete
  */
  public complete () : void {
    this.filter.complete()
  }

  /**
  * Called when the operand emit it's next boolean value.
  *
  * @param value - The value emitted by the underlying operand.
  */
  private handleNextFiltering (value : boolean) : void {
    if (value) {
      this.handleFilteredEvent(this._events.first)
    }

    this._events.shift()
  }

  /**
  * Called when the operand stream of boolean value ends.
  */
  private handleFilteringCompletion () : void {
    this.handleFilteredEventCompletion()
    this._events.clear()
  }

  /**
  * @see UnidocQuery.reset
  */
  public reset () : void {
    this.filter.reset()
    this._events.clear()
  }

  /**
  * @see UnidocQuery.clone
  */
  public copy (toCopy : FilteredQuery<Output>) : void {
    super.copy(toCopy)

    this._events.clear()

    for (const event of toCopy._events) {
      this._events.push(event)
    }
  }
}
