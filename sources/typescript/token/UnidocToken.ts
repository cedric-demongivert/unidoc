import { Pack } from '@cedric-demongivert/gl-tool-collection'
import { Allocator } from '@cedric-demongivert/gl-tool-collection'

import { UnidocLocation } from '@library/UnidocLocation'
import { CodePoint } from '@library/CodePoint'

import { UnidocTokenType } from './UnidocTokenType'

/**
* A unidoc token.
*/
export class UnidocToken {
  /**
  * Type of this unidoc token.
  */
  public type : UnidocTokenType

  /**
  * The location of the starting symbol (included) of this token in its parent
  * document.
  */
  public readonly from : UnidocLocation

  /**
  * The location of the ending symbol (excluded) of this token in its parent
  * document.
  */
  public readonly to : UnidocLocation

  /**
  * Symbols that compose this unidoc token.
  */
  public readonly symbols : Pack<CodePoint>

  /**
  * Instantiate a new unidoc token.
  *
  * @param [capacity = 16] - Initial capacity of the symbol buffer of this token.
  */
  public constructor (capacity : number = 16) {
    this.type = UnidocTokenType.DEFAULT_TYPE
    this.symbols = Pack.uint32(capacity)
    this.from = new UnidocLocation()
    this.to = new UnidocLocation()
  }

  /**
  * @return This token as a javascript string.
  */
  public get text () : string {
    return String.fromCodePoint(...this.symbols)
  }

  /**
  * Update the symbol buffer of this token.
  *
  * @param value - A string to bufferize.
  */
  public set text (value : string) {
    this.symbols.clear()

    for (let index = 0; index < value.length; ++index) {
      this.symbols.push(value.codePointAt(index))
    }
  }

  /**
  * A part of this token as a javascript string.
  *
  * @param start - Number of symbols of this token to skip.
  * @param [length = this.symbols.size - start] - Number of symbols of this token to keep.
  *
  * @return The requested part of this token as a string.
  */
  public substring (start : number, length : number = this.symbols.size - start) : string {
    const buffer : CodePoint[] = []
    const from : number = start
    const to : number = start + length

    for (let index = from; index < to; ++index) {
      buffer.push(this.symbols.get(index))
    }

    return String.fromCodePoint(...buffer)
  }

  /**
  * @return This token as a string without invisible symbols.
  */
  public get debugText () : string {
    const buffer : CodePoint[] = []

    for (const codePoint of this.symbols) {
      switch (codePoint) {
        case CodePoint.NEW_LINE:
          buffer.push(CodePoint.COLON)
          buffer.push(CodePoint.n)
          break
        case CodePoint.CARRIAGE_RETURN:
          buffer.push(CodePoint.COLON)
          buffer.push(CodePoint.r)
          break
        case CodePoint.TABULATION:
          buffer.push(CodePoint.COLON)
          buffer.push(CodePoint.t)
          break
        case CodePoint.SPACE:
          buffer.push(CodePoint.COLON)
          buffer.push(CodePoint.s)
          break
        case CodePoint.FORM_FEED:
          buffer.push(CodePoint.COLON)
          buffer.push(CodePoint.f)
          break
        default:
          buffer.push(codePoint)
          break
      }
    }

    return String.fromCodePoint(...buffer)
  }

  /**
  * Configure this token to be of the given type, at the given location and with
  * the given code points.
  *
  * @param type - New type of this token.
  * @param from - New starting location of this token.
  * @param value - New code points of this token.
  */
  public configure (type : UnidocTokenType, from : UnidocLocation, value : string) : void {
    this.clear()
    this.type = type
    this.text = value
    this.from.copy(from)
    this.to.copy(from)
    this.to.add(0, value.length, value.length)
  }

  /**
  * Configure this token as an identifier token that start at the given location
  * and contains the given code points.
  *
  * @param from - New starting location of this token.
  * @param value - New code points of this token.
  */
  public asIdentifier (from : UnidocLocation, value : string) : void {
    this.configure(UnidocTokenType.IDENTIFIER, from, value)
  }

  /**
  * Configure this token as a class token that start at the given location and
  * that contains the given code points.
  *
  * @param from - New starting location of this token.
  * @param value - New code points of this token.
  */
  public asClass (from : UnidocLocation, value : string) : void {
    this.configure(UnidocTokenType.CLASS, from, value)
  }

  /**
  * Configure this token as a tag token that start at the given location and
  * contains the given code points.
  *
  * @param from - New starting location of this token.
  * @param value - New code points of this token.
  */
  public asTag (from : UnidocLocation, value : string) : void {
    this.configure(UnidocTokenType.TAG, from, value)
  }

  /**
  * Configure this token as a block start token that start at the given
  * location.
  *
  * @param from - New starting location of this token.
  */
  public asBlockStart (from : UnidocLocation) : void {
    this.configure(UnidocTokenType.BLOCK_START, from, '{')
  }

  /**
  * Configure this token as a block start token that start at the given
  * location.
  *
  * @param from - New starting location of this token.
  */
  public asBlockEnd (from : UnidocLocation) : void {
    this.configure(UnidocTokenType.BLOCK_END, from, '}')
  }

  /**
  * Configure this token as a space token that start at the given location and
  * that contains the given code points.
  *
  * @param from - New starting location of this token.
  * @param value - New code points of this token.
  */
  public asSpace (from : UnidocLocation, value : string) : void {
    this.configure(UnidocTokenType.SPACE, from, value)
  }

  /**
  * Configure this token as a space token that start at the given location and
  * that contains the given code points.
  *
  * @param from - New starting location of this token.
  * @param [type = '\r\n'] - Type of new line to configure.
  */
  public asNewline (from : UnidocLocation, type : '\r\n' | '\r' | '\n' = '\r\n') : void {
    this.clear()
    this.type = UnidocTokenType.NEW_LINE
    this.text = type
    this.from.copy(from)
    this.to.copy(from)
    this.to.add(1, 0, type.length)
  }

  /**
  * Configure this token as a word token that start at the given location and
  * that contains the given code points.
  *
  * @param from - New starting location of this token.
  * @param value - New code points of this token.
  */
  public asWord (from : UnidocLocation, value : string) : void {
    this.configure(UnidocTokenType.WORD, from, value)
  }

  /**
  * Assess if this token is a tag of the given type.
  *
  * @param tag - Type of tag to check.
  *
  * @return True if this token is a tag of the given type.
  */
  public isTag (tag : string) : boolean {
    if (this.type === UnidocTokenType.TAG) {
      if (this.symbols.get(0) !== CodePoint.ANTISLASH) return false

      for (let index = 1; index < this.symbols.size; ++index) {
        let origin : number = this.symbols.get(index)
        let target : number = tag.codePointAt(index - 1)

        if (origin >= 65 && origin <= 90) {
          origin += 32
        }

        if (target >= 65 && target <= 90) {
          target += 32
        }

        if (origin !== target) {
          return false
        }
      }

      return true
    } else {
      return false
    }
  }

  /**
  * Deep-copy another token instance.
  *
  * @param toCopy - Another token instance to copy.
  */
  public copy (toCopy : UnidocToken) : void {
    this.type = toCopy.type
    this.from.copy(toCopy.from)
    this.to.copy(toCopy.to)
    this.symbols.copy(toCopy.symbols)
  }

  /**
  * @return A deep-copy of this token.
  */
  public clone () : UnidocToken {
    const result : UnidocToken = new UnidocToken(this.symbols.capacity)
    result.copy(this)
    return result
  }

  /**
  * Reset this token instance in order to reuse it.
  */
  public clear () : void {
    this.type = UnidocTokenType.DEFAULT_TYPE
    this.symbols.clear()
    this.from.clear()
    this.to.clear()
  }

  /**
  * @see Object#toString
  */
  public toString () : string {
    return UnidocTokenType.toString(this.type).padEnd(15) + ' ' +
           this.from.toString().padEnd(15, ' ') + ' - ' +
           this.to.toString().padEnd(15, ' ') + ' "' + this.debugText + '" '
  }

  /**
  * @see Object#equals
  */
  public equals (other : any) : boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocToken) {
      return other.type === this.type &&
             other.from.equals(this.from) &&
             other.to.equals(this.to) &&
             other.symbols.equals(this.symbols)
    }

    return false
  }
}

export namespace UnidocToken {
  /**
  * Instantiate a deep copy of the given instance.
  *
  * @param toCopy - An instance to copy.
  *
  * @return A deep copy of the given instance.
  */
  export function copy (toCopy : UnidocToken) : UnidocToken {
    return toCopy == null ? null : toCopy.clone()
  }

  /**
  * @see UnidocToken.asIdentifier
  */
  export function identifier (from : UnidocLocation, value : string) : UnidocToken {
    const result : UnidocToken = new UnidocToken(value.length)

    result.asIdentifier(from, value)

    return result
  }

  /**
  * @see UnidocToken.asClass
  */
  export function clazz (from : UnidocLocation, value : string) : UnidocToken {
    const result : UnidocToken = new UnidocToken(value.length)

    result.asClass(from, value)

    return result
  }

  /**
  * @see UnidocToken.asTag
  */
  export function tag (from : UnidocLocation, value : string) : UnidocToken {
    const result : UnidocToken = new UnidocToken(value.length)

    result.asTag(from, value)

    return result
  }

  /**
  * @see UnidocToken.asBlockStart
  */
  export function blockStart (from : UnidocLocation) : UnidocToken {
    const result : UnidocToken = new UnidocToken(1)

    result.asBlockStart(from)

    return result
  }

  /**
  * @see UnidocToken.asBlockEnd
  */
  export function blockEnd (from : UnidocLocation) : UnidocToken {
    const result : UnidocToken = new UnidocToken(1)

    result.asBlockEnd(from)

    return result
  }

  /**
  * @see UnidocToken.asSpace
  */
  export function space (from : UnidocLocation, value : string) : UnidocToken {
    const result : UnidocToken = new UnidocToken(value.length)

    result.asSpace(from, value)

    return result
  }

  /**
  * @see UnidocToken.asNewline
  */
  export function newline (from : UnidocLocation, type : '\r\n' | '\r' | '\n' = '\r\n') : UnidocToken {
    const result : UnidocToken = new UnidocToken(type.length)

    result.asNewline(from, type)

    return result
  }

  /**
  * @see UnidocToken.asWord
  */
  export function word (from : UnidocLocation, value : string) : UnidocToken {
    const result : UnidocToken = new UnidocToken(value.length)

    result.asWord(from, value)

    return result
  }

  export const ALLOCATOR : Allocator<UnidocToken> = {
    /**
    * @see Allocator.copy
    */
    allocate () : UnidocToken {
      return new UnidocToken()
    },

    /**
    * @see Allocator.copy
    */
    copy (source : UnidocToken, destination : UnidocToken) : void {
      destination.copy(source)
    },

    /**
    * @see Allocator.clear
    */
    clear (instance : UnidocToken) : void {
      instance.clear()
    }
  }
}
