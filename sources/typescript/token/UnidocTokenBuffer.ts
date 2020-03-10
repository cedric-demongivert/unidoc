import { Pack } from '@cedric-demongivert/gl-tool-collection'

import { UnidocLocation } from '../UnidocLocation'
import { UnidocToken } from './UnidocToken'

export class UnidocTokenBuffer {
  private readonly pool   : Pack<UnidocToken>
  public  readonly tokens : Pack<UnidocToken>

  /**
  * Instantiate a new empty token buffer with the given capacity.
  *
  * @param [capacity = 32] - Capacity of the buffer to instantiate.
  */
  public constructor (capacity : number = 32) {
    this.tokens = Pack.any(capacity)
    this.pool   = Pack.any(capacity)

    for (let index = 0; index < capacity; ++index) {
      this.pool.push(new UnidocToken())
    }
  }

  public get capacity () : number {
    return this.pool.capacity
  }

  /**
  * @see MutableSequence.size
  */
  public get size () : number {
    return this.tokens.size
  }

  /**
  * @see MutableSequence.size
  */
  public set size (newSize : number) {
    if (newSize > this.pool.capacity) {
      this.reallocate(newSize)
    }

    while (this.tokens.size < newSize) {
      this.pool.last.clear()
      this.tokens.push(this.pool.pop())
    }

    while (this.tokens.size > newSize) {
      this.pool.push(this.tokens.pop())
    }
  }

  /**
  * @return The starting location of this buffer.
  */
  public get from () : UnidocLocation {
    return this.tokens.size === 0 ? UnidocLocation.ZERO : this.tokens.first.from
  }

  /**
  * @return The ending location of this buffer.
  */
  public get to () : UnidocLocation {
    return this.tokens.size === 0 ? UnidocLocation.ZERO : this.tokens.last.to
  }

  public reallocate (capacity : number) : void {
    const oldCapacity : number = this.pool.capacity

    this.pool.reallocate(capacity)
    this.tokens.reallocate(capacity)

    for (let index = oldCapacity; index < capacity; ++index) {
      this.pool.push(new UnidocToken())
    }
  }

  /**
  * @see MutableSequence.get
  */
  public get (index : number) : UnidocToken {
    return this.tokens.get(index)
  }

  /**
  * Append an identifier token at the end of this buffer.
  *
  * @param value - Code points of the token to append.
  */
  public pushIdentifier (value : string) : void {
    if (this.tokens.size === this.pool.capacity) {
      this.reallocate(this.pool.capacity * 2)
    }

    this.pool.last.asIdentifier(this.to, value)
    this.tokens.push(this.pool.pop())
  }

  /**
  * Append a class token at the end of this buffer.
  *
  * @param value - Code points of the token to append.
  */
  public pushClass (value : string) : void {
    if (this.tokens.size === this.pool.capacity) {
      this.reallocate(this.pool.capacity * 2)
    }

    this.pool.last.asClass(this.to, value)
    this.tokens.push(this.pool.pop())
  }

  /**
  * Append a tag token at the end of this buffer.
  *
  * @param value - Code points of the token to append.
  */
  public pushTag (value : string) : void {
    if (this.tokens.size === this.pool.capacity) {
      this.reallocate(this.pool.capacity * 2)
    }

    this.pool.last.asTag(this.to, value)
    this.tokens.push(this.pool.pop())
  }

  /**
  * Append a block start token at the end of this buffer.
  */
  public pushBlockStart () : void {
    if (this.tokens.size === this.pool.capacity) {
      this.reallocate(this.pool.capacity * 2)
    }

    this.pool.last.asBlockStart(this.to)
    this.tokens.push(this.pool.pop())
  }

  /**
  * Append a block end token at the end of this buffer.
  */
  public pushBlockEnd () : void  {
    if (this.tokens.size === this.pool.capacity) {
      this.reallocate(this.pool.capacity * 2)
    }

    this.pool.last.asBlockEnd(this.to)
    this.tokens.push(this.pool.pop())
  }

  /**
  * Append a space token at the end of this buffer.
  *
  * @param value - Code points of the token to append.
  */
  public pushSpace (value : string) : void {
    if (this.tokens.size === this.pool.capacity) {
      this.reallocate(this.pool.capacity * 2)
    }

    this.pool.last.asSpace(this.to, value)
    this.tokens.push(this.pool.pop())
  }

  /**
  * Append a newline token at the end of this buffer.
  *
  * @param type - Type of newline token to add.
  */
  public pushNewline (type : '\r\n' | '\r' | '\n' = '\r\n') : void {
    if (this.tokens.size === this.pool.capacity) {
      this.reallocate(this.pool.capacity * 2)
    }

    this.pool.last.asNewline(this.to, type)
    this.tokens.push(this.pool.pop())
  }

  /**
  * Append a word token at the end of this buffer.
  *
  * @param value - Code points of the token to append.
  */
  public pushWord (value : string) : void {
    if (this.tokens.size === this.pool.capacity) {
      this.reallocate(this.pool.capacity * 2)
    }

    this.pool.last.asWord(this.to, value)
    this.tokens.push(this.pool.pop())
  }

  public push (token : UnidocToken) : void {
    if (this.tokens.size === this.pool.capacity) {
      this.reallocate(this.pool.capacity * 2)
    }

    this.tokens.push(this.pool.pop())
    this.tokens.last.copy(token)
  }

  public delete (index : number) : void {
    this.pool.push(this.tokens.get(index))
    this.tokens.delete(index)
  }

  /**
  * Reset this token buffer.
  */
  public clear () : void {
    while (this.tokens.size > 0) {
      this.pool.push(this.tokens.pop())
    }
  }

  /**
  * @see Object.equals
  */
  public equals (other : any) : boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocTokenBuffer) {
      if (other.tokens.size !== this.tokens.size) return false

      for (let index = 0, size = this.tokens.size; index < size; ++index) {
        if (!other.tokens.get(index).equals(this.tokens.get(index))) {
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
