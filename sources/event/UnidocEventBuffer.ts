import { Pack } from '@cedric-demongivert/gl-tool-collection'
import { Sequence } from '@cedric-demongivert/gl-tool-collection'

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
  * @param content - Content of the resulting event.
  */
  public pushWord (content : string) : void {
    this._events.size += 1
    this._events.last.asWord(content)
    this._events.last.index = this.size - 1
  }

  /**
  * Configure this event as a new whitespace event.
  *
  * @param content - Content of the resulting event.
  */
  public pushWhitespace (content : string) : void {
    this._events.size += 1
    this._events.last.asWhitespace(content)
    this._events.last.index = this.size - 1
  }

  /**
  * Configure this event as a new starting tag event.
  *
  * @param configuration - Type, identifiers and classes of the resulting tag.
  */
  public pushTagStart (configuration : string) : void {
    this._events.size += 1
    this._events.last.asTagStart(configuration)
    this._events.last.index = this.size - 1
  }

  /**
  * Configure this event as a new ending tag event.
  *
  * @param configuration - Type, identifiers and classes of the resulting tag.
  */
  public pushTagEnd (configuration : string) : void {
    this._events.size += 1
    this._events.last.asTagEnd(configuration)
    this._events.last.index = this.size - 1
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

  public expect (other : any) : boolean {
    if (other == null) {
      throw "Comparing with null."
    }

    if (other === this) {
      return true
    }

    if (other instanceof UnidocEventBuffer) {
      if (other.events.size !== this._events.size) {
        throw (
          "Different number of vents " +  other.events.size + " != " +
          this.events.size + "."
        )
      }

      for (let index = 0, size = this._events.size; index < size; ++index) {
        if (!other.events.get(index).equals(this._events.get(index))) {
          throw (
            "Event #" + index + ' (' + other.events.get(index) + ') is not ' +
            'equal to event #' + index + ' (' + this._events.get(index) + ').'
          )
        }
      }

      return true
    }

    throw "Different type of buffers."
  }
}

export namespace UnidocEventBuffer {

}
