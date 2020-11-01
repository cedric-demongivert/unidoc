import { CircularBuffer } from '@cedric-demongivert/gl-tool-collection'
import { Sequence } from '@cedric-demongivert/gl-tool-collection'

import { UnidocEvent } from '../event/UnidocEvent'

/**
* A storage for unidoc events.
*/
export class UnidocEventBuffer {
  /**
  * A circular buffer that contains each received unidoc event.
  */
  private readonly _events : CircularBuffer<UnidocEvent>

  /**
  * A sequence of locked events that must be retained for further usage.
  */
  private readonly _locks : CircularBuffer<number>

  /**
  * A view over the underlying circular buffer that contains each received unidoc event.
  */
  public readonly events   : Sequence<UnidocEvent>

  /**
  * Number of events skipped from the begining of the event stream.
  */
  private _offset : number

  /**
  * Instantiate a new empty event buffer with the given capacity.
  *
  * @param [capacity = 32] - Capacity of the buffer to instantiate.
  */
  public constructor (capacity : number = 32) {
    this._events = CircularBuffer.instance(UnidocEvent.ALLOCATOR, capacity)
    this._locks = CircularBuffer.int8(capacity)
    this._offset = 0

    this.events = this._events.view()
  }

  public get offset () : number {
    return this._offset
  }

  /**
  * @see Pack.capacity
  */
  public get capacity () : number {
    return this._events.capacity
  }

  /**
  * @see Pack.size
  */
  public get size () : number {
    return this._events.size
  }

  /**
  * @see Pack.size
  */
  public set size (newSize : number) {
    this._events.size = newSize
    this._locks.size = newSize
  }

  /**
  * @see Pack.reallocate
  */
  public reallocate (capacity : number) : void {
    this._events.reallocate(capacity)
    this._locks.reallocate(capacity)
  }

  /**
  * @see Pack.get
  */
  public get (index : number) : UnidocEvent {
    if (this._offset > index) {
      throw new Error(
        'Unable to retrieve the event #' + index + ' because this event was ' +
        'forgotten by this buffer. This buffer currently retain events after ' +
        'the event #' + this._offset + '. If you need to keep a part of the ' +
        'event sequence please lock it with the corresponding method.'
      )
    }

    return this._events.get(index - this._offset)
  }

  /**
  * @see Pack.push
  */
  public push (event : UnidocEvent) : void {
    if (this._events.capacity === this._events.size) {
      if (this._locks.get(0) === 0) {
        this._offset = this._events.first.index + 1
        this._locks.push(0)
      } else {
        this.reallocate(this._events.capacity * 2)
      }
    } else if (this._events.size === 0) {
      this._offset = event.index
    }

    this._events.push(event)
  }

  /**
  * Forget as many events as possible.
  */
  public forget () : void {
    while (this._locks.get(0) === 0) {
      this._offset += this._events.first.index + 1
      this._events.delete(0)
      this._locks.delete(0)
    }
  }

  /**
  * @see Pack.delete
  */
  public delete (index : number) : void {
    this._events.delete(index - this._offset)
    this._locks.delete(index - this._offset)
  }

  /**
  * @see Pack.deleteMany
  */
  public deleteMany (index : number, length : number) : void {
    this._events.deleteMany(index - this._offset, length)
    this._locks.deleteMany(index - this._offset, length)
  }

  /**
  * Reset this token buffer.
  */
  public concat (events : Iterable<UnidocEvent>) : void {
    for (const event of events) {
      this.push(event)
    }
  }

  public isLock (index : number) : boolean {
    return this._locks.get(index - this._offset) > 0
  }

  public lock (index : number, length : number = 1) : void {
    if (this._offset > index) {
      throw new Error(
        'Unable to lock the event #' + index + ' because this event was ' +
        'forgotten by this buffer. This buffer currently retain events after ' +
        'the event #' + this._offset + '. If you need to keep a part of the ' +
        'event sequence please lock it with the corresponding method.'
      )
    }

    const base : number = index - this._offset

    for (let offset = 0; offset < length; ++offset) {
      this._locks.set(base + offset, this._locks.get(base + offset) + 1)
    }
  }

  public unlock (index : number, length : number = 1) : void {
    if (this._offset > index) {
      throw new Error(
        'Unable to unlock the event #' + index + ' because this event was ' +
        'forgotten by this buffer. This buffer currently retain events after ' +
        'the event #' + this._offset + '. If you need to keep a part of the ' +
        'event sequence please lock it with the corresponding method.'
      )
    }

    const base : number = index - this._offset

    for (let offset = 0; offset < length; ++offset) {
      this._locks.set(base + offset, this._locks.get(base + offset) - 1)
    }
  }

  /**
  * Reset this token buffer.
  */
  public clear () : void {
    this._events.clear()
    this._locks.clear()
    this._offset = 0
  }

  /**
  * @see Object.toString
  */
  public toString () : string {
    let result : string = '['

    for (let index = 0; index < this._events.size; ++index) {
      if (index > 0) result += ','
      result += '\r\n' + this._events.get(index).toString()
    }

    if (this._events.size > 0) result += '\r\n'
    result += ']'

    return result
  }

  /**
  * @see Object.equals
  */
  public equals (other : any) : boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocEventBuffer) {
      if (other.events.size !== this._events.size) return false

      for (let index = 0, size = this._events.size; index < size; ++index) {
        if (!other.events.get(index).equals(this._events.get(index))) {
          return false
        }
      }

      if (other._locks.size !== this._locks.size) return false

      for (let index = 0, size = this._locks.size; index < size; ++index) {
        if (other._locks.get(index) !== this._locks.get(index)) {
          return false
        }
      }

      return this._offset === other._offset
    }

    return false
  }
}

export namespace UnidocEventBuffer {

}
