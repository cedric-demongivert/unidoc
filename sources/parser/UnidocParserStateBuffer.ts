import { Pack } from '@cedric-demongivert/gl-tool-collection'
import { Sequence } from '@cedric-demongivert/gl-tool-collection'

import { UnidocParserState } from './UnidocParserState'
import { UnidocParserStateType } from './UnidocParserStateType'

export class UnidocParserStateBuffer {
  private readonly _states : Pack<UnidocParserState>
  public  readonly states  : Sequence<UnidocParserState>

  /**
  * Instantiate a new empty token buffer with the given capacity.
  *
  * @param [capacity = 32] - Capacity of the buffer to instantiate.
  */
  public constructor (capacity : number = 32) {
    this._states = Pack.instance(UnidocParserState.ALLOCATOR, capacity)
    this.states = this._states.view()
  }

  public get first () : UnidocParserState {
    return this._states.first
  }

  public get last () : UnidocParserState {
    return this._states.last
  }

  public get capacity () : number {
    return this._states.capacity
  }

  /**
  * @see MutableSequence.size
  */
  public get size () : number {
    return this._states.size
  }

  /**
  * @see MutableSequence.size
  */
  public set size (newSize : number) {
    this._states.size = newSize
  }

  public reallocate (capacity : number) : void {
    this._states.reallocate(capacity)
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
    this._states.size += 1
    this._states.last.type = type
  }

  public delete (index : number) : void {
    this._states.delete(index)
  }

  public pop () : void {
    this._states.pop()
  }

  /**
  * Reset this token buffer.
  */
  public clear () : void {
    this._states.clear()
  }

  /**
  * @see Object.equals
  */
  public equals (other : any) : boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocParserStateBuffer) {
      if (other._states.size !== this._states.size) return false

      for (let index = 0, size = this._states.size; index < size; ++index) {
        if (!other._states.get(index).equals(this._states.get(index))) {
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
