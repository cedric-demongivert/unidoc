import { CircularBuffer } from '@cedric-demongivert/gl-tool-collection'
import { Pack } from '@cedric-demongivert/gl-tool-collection'

import { UnidocEvent } from '../event/UnidocEvent'

import { UnidocQuery } from './UnidocQuery'
import { BasicQuery } from './BasicQuery'

export class FilteringQuery extends BasicQuery<UnidocEvent> {
  /**
  * Operand of this filter.
  */
  public readonly operand : UnidocQuery<boolean>

  private readonly _events : CircularBuffer<UnidocEvent>

  /**
  * Instantiate a new filter.
  *
  * @param operand - Operand of the filter to instantiate.
  */
  public constructor (operand : UnidocQuery<boolean>) {
    super()

    this.operand = operand
    this._events = CircularBuffer.fromPack(Pack.instance(UnidocEvent.ALLOCATOR, 16))

    this.handleNextBoolean = this.handleNextBoolean.bind(this)
    this.handleCompletion = this.handleCompletion.bind(this)

    this.operand.addEventListener('next', this.handleNextBoolean)
    this.operand.addEventListener('complete', this.handleCompletion)
  }

  /**
  * @see UnidocQuery.start
  */
  public start () : void {
    this.operand.start()
  }

  /**
  * @see UnidocQuery.next
  */
  public next (event: UnidocEvent) : void {
    this._events.push(event)
    this.operand.next(event)
  }

  /**
  * @see UnidocQuery.complete
  */
  public complete () : void {
    this.operand.complete()
  }

  /**
  * Called when the operand emit it's next boolean value.
  *
  * @param value - The value emitted by the underlying operand.
  */
  private handleNextBoolean (value : boolean) : void {
    if (value) {
      this.emit(this._events.first)
    }

    this._events.shift()
  }

  /**
  * Called when the operand stream of boolean value ends.
  */
  private handleCompletion () : void {
    this.emitCompletion()
    this._events.clear()
  }

  /**
  * @see UnidocQuery.reset
  */
  public reset () : void {
    this.operand.reset()
    this._events.clear()
  }

  /**
  * @see UnidocQuery.clone
  */
  public clone () : FilteringQuery {
    const result : FilteringQuery = new FilteringQuery(this.operand.clone())

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
    return 'FILTERING BY ' + this.operand.toString()
  }
}
