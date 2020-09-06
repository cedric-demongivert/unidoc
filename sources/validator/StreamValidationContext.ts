import { CircularBuffer } from '@cedric-demongivert/gl-tool-collection'
import { Pack } from '@cedric-demongivert/gl-tool-collection'
import { Sequence } from '@cedric-demongivert/gl-tool-collection'

import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocValidation } from '../validation/UnidocValidation'

export class StreamValidationContext {
  /**
  * A view over the current buffer of event.
  */
  public readonly events : Sequence<UnidocEvent>

  /**
  * The current buffer of event.
  */
  private readonly _events : CircularBuffer<UnidocEvent>

  /**
  * Offset of the current buffer of event from the begining of the stream.
  */
  private _offset : number

  /**
  * Index of the event that is currently validated from the begining of the stream.
  */
  private _cursor : number

  /**
  * A validation instance to use for publishing.
  */
  public readonly validation : UnidocValidation

  /**
  * Instantiate a new empty context with the given capacity.
  *
  * @param [capacity = 32] - Initial capacity of the context to instantiate.
  */
  public constructor (capacity : number = 32) {
    this._events = CircularBuffer.fromPack(Pack.instance(UnidocEvent.ALLOCATOR, capacity))
    this.events = this._events.view()
    this._offset = 0
    this._cursor = 0
    this.validation = new UnidocValidation()
  }

  /**
  * Called when a new event was discovered.
  *
  * @param event - The new discovered event.
  */
  public discover (event : UnidocEvent) : void {
    this._events.push(event)
  }

  /**
  * Return the ith event of the underlying stream.
  *
  * @param index - Index of the event to get.
  *
  * @return The requested event if it exists.
  */
  public getEvent (index : number) : UnidocEvent {
    return this._events.get(index - this._offset)
  }

  /**
  * @return The event to validate.
  */
  public getCurrentEvent () : UnidocEvent {
    return this._events.get(this._cursor - this._offset)
  }

  /**
  * Return the ith event before the event to validate.
  *
  * @param [index = 0] - Index of the event to get.
  *
  * @return The requested event if it exists.
  */
  public getPreviousEvent (index : number = 0) : UnidocEvent {
    return this._events.get(this._cursor - this._offset - 1 - index)
  }

  /**
  * Return the ith event after the event to validate.
  *
  * @param [index = 0] - Index of the event to get.
  *
  * @return The requested event if it exists.
  */
  public getNextEvent (index : number = 0) : UnidocEvent {
    return this._events.get(this._cursor - this._offset + 1 + index)
  }

  /**
  * @return The number of events that was forget from the begining of the stream.
  */
  public getOffset () : number {
    return this._offset
  }

  /**
  * @return The index of the current event into the parent stream.
  */
  public getCursor () : number {
    return this._cursor
  }

  /**
  * Forget the given number of events from the begining of the stream.
  *
  * @param [count = 1] - Number of events to forget.
  */
  public forget (count : number = 1) : void {
    this._events.deleteMany(0, count)
    this._offset += count
  }

  /**
  * Move to the next available event.
  *
  * @param [count = 1] - Number of event to skip.
  */
  public next (count : number = 1) : void {
    this._cursor += count
  }

  /**
  * Move to the previous available event.
  *
  * @param [count = 1] - Number of event to skip.
  */
  public previous (count : number = 1) : void {
    this._cursor -= count
  }

  /**
  * Move to the requested event.
  *
  * @param index - Index of the event to go to.
  */
  public goto (index : number) : void {
    this._cursor = index
  }
}
