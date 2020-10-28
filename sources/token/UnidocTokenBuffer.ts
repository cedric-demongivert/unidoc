import { Pack } from '@cedric-demongivert/gl-tool-collection'
import { Sequence } from '@cedric-demongivert/gl-tool-collection'

import { UnidocOrigin } from '../origin/UnidocOrigin'
import { UnidocRangeOrigin } from '../origin/UnidocRangeOrigin'
import { UnidocToken } from './UnidocToken'

export class UnidocTokenBuffer {
  private readonly _tokens : Pack<UnidocToken>
  public  readonly tokens  : Sequence<UnidocToken>

  /**
  * Instantiate a new empty token buffer with the given capacity.
  *
  * @param [capacity = 32] - Capacity of the buffer to instantiate.
  */
  public constructor (capacity : number = 32) {
    this._tokens = Pack.instance(UnidocToken.ALLOCATOR, capacity)
    this.tokens = this._tokens.view()
  }

  public get capacity () : number {
    return this._tokens.capacity
  }

  /**
  * @see MutableSequence.size
  */
  public get size () : number {
    return this._tokens.size
  }

  /**
  * @see MutableSequence.size
  */
  public set size (newSize : number) {
    this._tokens.size = newSize
  }

  /**
  * @see Sequence.last
  */
  public get last () : UnidocToken {
    return this._tokens.last
  }

  /**
  * @see Sequence.first
  */
  public get first () : UnidocToken {
    return this._tokens.first
  }

  /**
  * @return The starting location of this buffer.
  */
  public get from () : UnidocOrigin {
    return this._tokens.size === 0 ? UnidocOrigin.runtime() : this._tokens.first.origin.from
  }

  /**
  * @return The ending location of this buffer.
  */
  public get to () : UnidocOrigin {
    return this._tokens.size === 0 ? UnidocOrigin.runtime() : this._tokens.last.origin.to
  }

  /**
  * @return The text content associated with this buffer.
  */
  public get text () : string {
    let result : string = ''

    for (const token of this._tokens) {
      result += token.text
    }

    return result
  }

  public slice (from : number, length : number) : UnidocTokenBuffer {
    const result : UnidocTokenBuffer = new UnidocTokenBuffer(length)
    const size : number = Math.min(length, this.size - from)

    for (let index = 0; index < size; ++index) {
      result.push(this._tokens.get(index + from))
    }

    return result
  }

  public reallocate (capacity : number) : void {
    this._tokens.reallocate(capacity)
  }

  /**
  * @see MutableSequence.get
  */
  public get (index : number) : UnidocToken {
    return this._tokens.get(index)
  }

  public pushIdentifier (origin : UnidocRangeOrigin, value : string) : void {
    this._tokens.size += 1
    this._tokens.last.asIdentifier(origin, value)
  }

  public pushClass (origin : UnidocRangeOrigin, value : string) : void {
    this._tokens.size += 1
    this._tokens.last.asClass(origin, value)
  }

  public pushTag (origin : UnidocRangeOrigin, value : string) : void {
    this._tokens.size += 1
    this._tokens.last.asTag(origin, value)
  }

  public pushBlockStart (origin : UnidocRangeOrigin) : void {
    this._tokens.size += 1
    this._tokens.last.asBlockStart(origin)
  }

  public pushBlockEnd (origin : UnidocRangeOrigin) : void  {
    this._tokens.size += 1
    this._tokens.last.asBlockEnd(origin)
  }

  public pushSpace (origin : UnidocRangeOrigin, value : string) : void {
    this._tokens.size += 1
    this._tokens.last.asSpace(origin, value)
  }

  /**
  * Append a newline token at the end of this buffer.
  *
  * @param type - Type of newline token to add.
  */
  public pushNewline (origin : UnidocRangeOrigin, type : '\r\n' | '\r' | '\n' = '\r\n') : void {
    this._tokens.size += 1
    this._tokens.last.asNewline(origin, type)
  }

  /**
  * Append a word token at the end of this buffer.
  *
  * @param value - Code points of the token to append.
  */
  public pushWord (origin : UnidocRangeOrigin,value : string) : void {
    this._tokens.size += 1
    this._tokens.last.asWord(origin, value)
  }

  /**
  * Append a copy of the given token at the end of this buffer.
  *
  * @param token - A token to append.
  */
  public push (token : UnidocToken) : void {
    this._tokens.push(token)
  }

  /**
  * Remove a token from this buffer.
  *
  * @param index - Index of the token to remove.
  */
  public delete (index : number) : void {
    this._tokens.delete(index)
  }

  /**
  * @see Pack#deleteMany
  */
  public deleteMany (index : number, length : number) : void {
    this._tokens.deleteMany(index, length)
  }

  /**
  * Reset this token buffer.
  */
  public concat (tokens : Iterable<UnidocToken>) : void {
    for (const token of tokens) {
      this._tokens.push(token)
    }
  }

  /**
  * Deep copy the given buffer.
  *
  * @param toCopy - A buffer instance to copy.
  */
  public copy (toCopy : UnidocTokenBuffer) : void {
    this._tokens.clear()

    for (const token of toCopy.tokens) {
      this._tokens.push(token)
    }
  }

  /**
  * Reset this token buffer.
  */
  public clear () : void {
    this._tokens.clear()
  }

  public toString () : string {
    let result : string = '['

    for (let index = 0; index < this._tokens.size; ++index) {
      if (index > 0) result += ','
      result += '\r\n' + this._tokens.get(index).toString()
    }

    if (this._tokens.size > 0) result += '\r\n'
    result += ']'

    return result
  }

  /**
  * @see Symbol.iterator
  */
  public * [Symbol.iterator] () : Iterator<UnidocToken> {
    yield * this._tokens
  }

  /**
  * @see Object.equals
  */
  public equals (other : any) : boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocTokenBuffer) {
      if (other.tokens.size !== this._tokens.size) return false

      for (let index = 0, size = this._tokens.size; index < size; ++index) {
        if (!other.tokens.get(index).equals(this._tokens.get(index))) {
          return false
        }
      }

      return true
    }

    return false
  }
}

export namespace UnidocTokenBuffer {
  /**
  * Assert that both buffers are equals.
  *
  * @param left - Buffer to use as a left operand.
  * @param right - Buffer to use as a right operand.
  */
  export function assert (left : UnidocTokenBuffer, right : UnidocTokenBuffer) : void {
    if (left.tokens.size !== right.tokens.size) {
      throw new Error(
        'Buffers ' + right.toString() + ' and ' + left.toString() + ' are ' +
        'not equals because thay contains a different amount of tokens ' +
        right.tokens.size + ' !== ' + left.tokens.size + '.'
      )
    }

    for (let index = 0, size = right.tokens.size; index < size; ++index) {
      if (!left.tokens.get(index).equals(right.tokens.get(index))) {
        throw new Error(
          'Buffers ' + right.toString() + ' and ' + left.toString() + ' are ' +
          'not equals because their #' + index + ' token are not equal ' +
          right.tokens.get(index).toString() + ' !== ' +
          left.tokens.get(index).toString() + '.'
        )
      }
    }
  }
}
