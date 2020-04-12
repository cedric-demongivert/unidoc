import { Pack } from '@cedric-demongivert/gl-tool-collection'
import { Sequence } from '@cedric-demongivert/gl-tool-collection'

import { UnidocPath } from '../path/UnidocPath'
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
  * Configure this event as a new word event.
  *
  * @param from - New starting location of this event into the parent document.
  * @param content - Content of the resulting event.
  */
  public pushWord (from : UnidocLocation, content : string) : void {
    this._events.size += 1
    this._events.last.asWord(from, content)
  }

  /**
  * Configure this event as a new whitespace event.
  *
  * @param from - New starting location of this event into the parent document.
  * @param content - Content of the resulting event.
  */
  public pushWhitespace (from : UnidocLocation, content : string) : void {
    this._events.size += 1
    this._events.last.asWhitespace(from, content)
  }

  /**
  * Configure this event as a new starting tag event.
  *
  * @param from - New starting location of this event into the parent document.
  * @param to - New ending location of this event into the parent document.
  * @param configuration - Type, identifiers and classes of the resulting tag.
  */
  public pushTagStart (from : UnidocLocation, to : UnidocLocation, configuration : string) : void {
    this._events.size += 1
    this._events.last.asTagStart(from, to, configuration)
  }

  /**
  * Configure this event as a new ending tag event.
  *
  * @param from - New starting location of this event into the parent document.
  * @param to - New ending location of this event into the parent document.
  * @param configuration - Type, identifiers and classes of the resulting tag.
  */
  public pushTagEnd (from : UnidocLocation, to : UnidocLocation, configuration : string) : void {
    this._events.size += 1
    this._events.last.asTagEnd(from, to, configuration)
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
        'Buffers ' + left.toString() + ' and ' + right.toString() + ' are ' +
        'not equals because thay contains a different amount of.events ' +
        left.events.size + ' !== ' + right.events.size + '.'
      )
    }

    const oldPath : UnidocPath = new UnidocPath()

    for (let index = 0, size = right.events.size; index < size; ++index) {
      const oldTimestamp : number = right.events.get(index).timestamp
      oldPath.copy(right.events.get(index).path)
      right.events.get(index).timestamp = left.events.get(index).timestamp
      right.events.get(index).path.copy(left.events.get(index).path)

      if (!left.events.get(index).similar(right.events.get(index))) {
        right.events.get(index).timestamp = oldTimestamp
        right.events.get(index).path.copy(oldPath)

        throw new Error(
          'Buffers ' + left.toString() + ' and ' + right.toString() + ' are ' +
          'not equals because their #' + index + ' token are not similar ' +
          left.events.get(index).toString() + ' !== ' +
          right.events.get(index).toString() + '.'
        )
      } else {
        right.events.get(index).timestamp = oldTimestamp
        right.events.get(index).path.copy(oldPath)
      }
    }
  }
}
