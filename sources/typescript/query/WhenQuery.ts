import { CircularBuffer } from '@cedric-demongivert/gl-tool-collection'
import { Pack } from '@cedric-demongivert/gl-tool-collection'

import { UnidocEvent } from '../event/UnidocEvent'

import { UnidocQuery } from './UnidocQuery'
import { BasicQuery } from './BasicQuery'

export class WhenQuery<Output> extends BasicQuery<Output> {
  /**
  * Operand of this filter.
  */
  public readonly filtered : UnidocQuery<Output>

  public readonly filter : UnidocQuery<boolean>

  private readonly _events : CircularBuffer<UnidocEvent>

  /**
  * Instantiate a new filter.
  *
  * @param operand - Operand of the filter to instantiate.
  */
  public constructor (filter : UnidocQuery<boolean>, filtered : UnidocQuery<Output>) {
    super()

    this.filter = filter
    this.filtered = filtered
    this._events = CircularBuffer.fromPack(Pack.instance(UnidocEvent.ALLOCATOR, 16))

    this.handleFilterNextBoolean = this.handleFilterNextBoolean.bind(this)
    this.handleFilterCompletion = this.handleFilterCompletion.bind(this)
    this.handleFilteredNextValue = this.handleFilteredNextValue.bind(this)
    this.handleFilteredCompletion = this.handleFilteredCompletion.bind(this)

    this.filter.addEventListener('next', this.handleFilterNextBoolean)
    this.filter.addEventListener('complete', this.handleFilterCompletion)
    this.filtered.addEventListener('next', this.handleFilteredNextValue)
    this.filtered.addEventListener('complete', this.handleFilteredCompletion)
  }

  /**
  * @see UnidocQuery.start
  */
  public start () : void {
    this.filter.start()
    this.filtered.start()
  }

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
  * Called when the filter emit it's next boolean value.
  *
  * @param value - The value emitted by the underlying filter.
  */
  private handleFilterNextBoolean (value : boolean) : void {
    if (value) {
      this.filtered.next(this._events.first)
    }

    this._events.shift()
  }

  /**
  * Called when the operand stream of boolean value ends.
  */
  private handleFilterCompletion () : void {
    this.filtered.complete()
    this._events.clear()
  }

  /**
  * Called when the filtered emit it's next value.
  *
  * @param value - The value emitted by the underlying filtered.
  */
  private handleFilteredNextValue (value : Output) : void {
    this.emit(value)
  }

  /**
  * Called when the filtered stream of value ends.
  */
  private handleFilteredCompletion () : void {
    this.emitCompletion()
  }

  /**
  * @see UnidocQuery.reset
  */
  public reset () : void {
    this.filter.reset()
    this.filtered.reset()
    this._events.clear()
  }

  /**
  * @see UnidocQuery.clone
  */
  public clone () : WhenQuery<Output> {
    const result : WhenQuery<Output> = new WhenQuery<Output>(this.filter, this.filtered)

    result.copy(this)

    for (const event of this._events) {
      result._events.push(event)
    }

    return result
  }

  /**
  * @see UnidocQuery.toString
  */
  public toString () : string {
    return this.filtered.toString + ' WHEN ' + this.filter.toString()
  }
}
