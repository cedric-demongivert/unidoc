import { Pack } from '@cedric-demongivert/gl-tool-collection'

import { UnidocParserState } from './UnidocParserState'
import { UnidocParserStateType } from './UnidocParserStateType'

export class UnidocParserStateBuffer {
  private readonly pool   : Pack<UnidocParserState>
  public  readonly states : Pack<UnidocParserState>

  /**
  * Instantiate a new empty token buffer with the given capacity.
  *
  * @param [capacity = 32] - Capacity of the buffer to instantiate.
  */
  public constructor (capacity : number = 32) {
    this.states = Pack.any(capacity)
    this.pool   = Pack.any(capacity)

    for (let index = 0; index < capacity; ++index) {
      this.pool.push(new UnidocParserState())
    }
  }

  public get last () : UnidocParserState {
    return this.states.last
  }

  public get capacity () : number {
    return this.pool.capacity
  }

  /**
  * @see MutableSequence.size
  */
  public get size () : number {
    return this.states.size
  }

  /**
  * @see MutableSequence.size
  */
  public set size (newSize : number) {
    if (newSize > this.pool.capacity) {
      this.reallocate(newSize)
    }

    while (this.states.size < newSize) {
      this.pool.last.clear()
      this.states.push(this.pool.pop())
    }

    while (this.states.size > newSize) {
      this.pool.push(this.states.pop())
    }
  }

  public reallocate (capacity : number) : void {
    const oldCapacity : number = this.pool.capacity

    this.pool.reallocate(capacity)
    this.states.reallocate(capacity)

    for (let index = oldCapacity; index < capacity; ++index) {
      this.pool.push(new UnidocParserState())
    }
  }

  /**
  * @see MutableSequence.get
  */
  public get (index : number) : UnidocParserState {
    return this.states.get(index)
  }

  /**
  * Append an identifier token at the end of this buffer.
  *
  * @param value - Code points of the token to append.
  */
  public push (type : UnidocParserStateType) : void {
    if (this.states.size === this.pool.capacity) {
      this.reallocate(this.pool.capacity * 2)
    }

    this.pool.last.type = type
    this.states.push(this.pool.pop())
  }

  public delete (index : number) : void {
    this.pool.push(this.states.get(index))
    this.states.delete(index)
  }

  public pop () : void {
    this.delete(this.size - 1)
  }

  /**
  * Reset this token buffer.
  */
  public clear () : void {
    while (this.states.size > 0) {
      this.pool.push(this.states.pop())
    }
  }

  /**
  * @see Object.equals
  */
  public equals (other : any) : boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocParserStateBuffer) {
      if (other.states.size !== this.states.size) return false

      for (let index = 0, size = this.states.size; index < size; ++index) {
        if (!other.states.get(index).equals(this.states.get(index))) {
          return false
        }
      }

      return true
    }

    return false
  }
}

export namespace UnidocParserStateBuffer {
}
