import { Pack } from '@cedric-demongivert/gl-tool-collection'
import { Sequence } from '@cedric-demongivert/gl-tool-collection'

import { UnidocLocation } from '../UnidocLocation'
import { UnidocEvent } from './UnidocEvent'

export class UnidocEventBuffer {
  private readonly _events : Pack<UnidocEvent>
  public readonly events   : Sequence<UnidocEvent>

  /**
  * Instantiate a new empty event buffer with the given capacity.
  *
  * @param [capacity = 32] - Capacity of the buffer to instantiate.
  */
  public constructor (capacity : number = 32) {
    this._events = Pack.instance(UnidocEvent.ALLOCATOR, capacity)
    this.events = this._events.view()
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
  }

  /**
  * @return The starting location of this buffer.
  */
  public get from () : UnidocLocation {
    return this._events.size === 0 ? UnidocLocation.ZERO : this._events.first.from
  }

  /**
  * @return The ending location of this buffer.
  */
  public get to () : UnidocLocation {
    return this._events.size === 0 ? UnidocLocation.ZERO : this._events.last.to
  }

  /**
  * @see Pack.reallocate
  */
  public reallocate (capacity : number) : void {
    this._events.reallocate(capacity)
  }

  /**
  * @see Pack.get
  */
  public get (index : number) : UnidocEvent {
    return this._events.get(index)
  }

  /**
  * @see Pack.push
  */
  public push (event : UnidocEvent) : void {
    this._events.push(event)
  }

  /**
  * @see Pack.delete
  */
  public delete (index : number) : void {
    this._events.delete(index)
  }

  /**
  * @see Pack.deleteMany
  */
  public deleteMany (index : number, length : number) : void {
    this._events.deleteMany(index, length)
  }

  /**
  * Reset this token buffer.
  */
  public concat (events : Iterable<UnidocEvent>) : void {
    for (const event of events) {
      this._events.push(event)
    }
  }

  /**
  * Reset this token buffer.
  */
  public copy (events : Iterable<UnidocEvent>) : void {
    this._events.clear()

    for (const event of events) {
      this._events.push(event)
    }
  }

  /**
  * Reset this token buffer.
  */
  public clear () : void {
    this._events.clear()
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

      return true
    }

    return false
  }
}

export namespace UnidocEventBuffer {
  /**
  * Assert that both buffers are equals.
  *
  * @param left - Buffer to use as a left operand.
  * @param right - Buffer to use as a right operand.
  */
  export function assert (left : UnidocEventBuffer, right : UnidocEventBuffer) : void {
    if (left.events.size !== right.events.size) {
      throw new Error(
        'Buffers ' + right.toString() + ' and ' + left.toString() + ' are ' +
        'not equals because thay contains a different amount of.events ' +
        right.events.size + ' !== ' + left.events.size + '.'
      )
    }

    for (let index = 0, size = right.events.size; index < size; ++index) {
      const oldTimestamp : number = right.events.get(index).timestamp
      right.events.get(index).timestamp = left.events.get(index).timestamp

      if (!left.events.get(index).equals(right.events.get(index))) {
        right.events.get(index).timestamp = oldTimestamp

        throw new Error(
          'Buffers ' + right.toString() + ' and ' + left.toString() + ' are ' +
          'not equals because their #' + index + ' token are not equal ' +
          right.events.get(index).toString() + ' !== ' +
          left.events.get(index).toString() + '.'
        )
      } else {
        right.events.get(index).timestamp = oldTimestamp
      }
    }
  }
}
