import { CircularBuffer } from '@cedric-demongivert/gl-tool-collection'
import { Pack } from '@cedric-demongivert/gl-tool-collection'

import { UnidocEvent } from '../event/UnidocEvent'

import { UnidocQuery } from './UnidocQuery'
import { Sink } from './Sink'

export class SelectionQuery implements UnidocQuery<UnidocEvent, UnidocEvent>
{
  /**
  * A listener called when a value is published by this query.
  */
  public output : Sink<UnidocEvent>

  /**
  * Stream of boolean values used to filter the ingoing stream of events.
  */
  public readonly filter : UnidocQuery<UnidocEvent, boolean>

  private readonly _buffer : CircularBuffer<UnidocEvent>

  private readonly filteringHandler : Sink<boolean>

  /**
  * Instantiate a new chain.
  *
  * @param operand - Operand of the negation to instantiate.
  */
  public constructor (operand : UnidocQuery<UnidocEvent, boolean>) {
    this.filteringHandler = {
      start: this.handleFilteringStart.bind(this),
      next: this.handleFiltering.bind(this),
      error: this.handleFilteringError.bind(this),
      complete: this.handleFilteringCompletion.bind(this)
    }

    this.filter = operand
    this.filter.output = this.filteringHandler

    this._buffer = CircularBuffer.fromPack(Pack.instance(UnidocEvent.ALLOCATOR, 16))
  }

  /**
  * @see UnidocQuery.start
  */
  public start () : void {
    this.filter.start()
  }

  /**
  * @see UnidocQuery.next
  */
  public next (value : UnidocEvent) : void {
    this._buffer.push(value)
    this.filter.next(value)
  }

  /**
  * @see UnidocQuery.complete
  */
  public complete () : void {
    this.filter.complete()
  }

  /**
  * Called when the filter makes a decision for the current ingoing event.
  *
  * @param value - True for keeping the current event, false otherwise.
  */
  private handleFiltering (value : boolean) : void {
    if (value) {
      this.output.next(this._buffer.shift())
    } else {
      this._buffer.shift()
    }
  }

  /**
  * Called when the filter emit an error.
  *
  * @param error - Error emitted by the underlying filter.
  */
  private handleFilteringError (error : Error) : void {
    this.output.error(error)
    this._buffer.shift()
  }

  /**
  * Called when the filtering stream starts.
  */
  private handleFilteringStart () : void {
    this.output.start()
  }

  /**
  * Called when the filtering stream ends.
  */
  private handleFilteringCompletion () : void {
    this.output.complete()
    this._buffer.clear()
  }

  /**
  * @see UnidocQuery.reset
  */
  public reset () : void {
    this.filter.reset()
    this._buffer.clear()
  }

  /**
  * @see UnidocQuery.error
  */
  public error (error : Error) : void {
    this.output.error(error)
  }

  /**
  * @see UnidocQuery.clear
  */
  public clear () : void {
    this.filter.clear()
    this.filter.output = this.filteringHandler

    this._buffer.clear()

    this.output = Sink.NONE
  }

  /**
  * @see UnidocQuery.clone
  */
  public clone () : SelectionQuery {
    const result : SelectionQuery = new SelectionQuery(this.filter.clone())

    result.output = this.output

    return result
  }

  /**
  * @see UnidocQuery.toString
  */
  public toString () : string {
    return 'select (' + this.filter + ')'
  }
}
