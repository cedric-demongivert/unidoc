import { Pack } from '@cedric-demongivert/gl-tool-collection'

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
  * Instantiate a token of the given type, at the given location and with the
  * given code points.
  *
  * @param type - Type of token to instantiate.
  * @param from - Starting location of the token to instantiate.
  * @param value - Code points of the token to instantiate.
  *
  * @return A token of the given type, at the given location and with the given
  *         code points.
  */
  export function create (
    type : UnidocTokenType,
    from : UnidocLocation,
    value : string
  ) : UnidocToken {
    const result : UnidocToken = new UnidocToken()

    result.type = type
    result.text = value
    result.from.copy(from)
    result.to.copy(from)
    result.to.add(0, value.length, value.length)

    return result
  }

  /**
  * Return an identifier token that start at the given location and contains the given
  * code points.
  *
  * @param from - Starting location of the token to instantiate.
  * @param value - Code points of the token to instantiate.
  *
  * @return An identifier token that start at the given location and contains
  *         the given code points.
  */
  export function createIdentifier (from : UnidocLocation, value : string) : UnidocToken {
    return create(UnidocTokenType.IDENTIFIER, from, value)
  }

  /**
  * Return a class token that start at the given location and contains the given
  * code points.
  *
  * @param from - Starting location of the token to instantiate.
  * @param value - Code points of the token to instantiate.
  *
  * @return A class token that start at the given location and contains the
  *         given code points.
  */
  export function createClass (from : UnidocLocation, value : string) : UnidocToken {
    return create(UnidocTokenType.CLASS, from, value)
  }

  /**
  * Return a tag token that start at the given location and contains the given
  * code points.
  *
  * @param from - Starting location of the token to instantiate.
  * @param value - Code points of the token to instantiate.
  *
  * @return A tag token that start at the given location and contains the given
  *         code points.
  */
  export function createTag (from : UnidocLocation, value : string) : UnidocToken {
    return create(UnidocTokenType.TAG, from, value)
  }

  /**
  * Return a block start token that start at the given location.
  *
  * @param from - Starting location of the token to instantiate.
  *
  * @return A block start token that start at the given location.
  */
  export function createBlockStart (from : UnidocLocation) : UnidocToken {
    return create(UnidocTokenType.BLOCK_START, from, '{')
  }

  /**
  * Return a block start token that start at the given location.
  *
  * @param from - Starting location of the token to instantiate.
  *
  * @return A block start token that start at the given location.
  */
  export function createBlockEnd (from : UnidocLocation) : UnidocToken {
    return create(UnidocTokenType.BLOCK_END, from, '}')
  }

  /**
  * Return a space token that start at the given location and contains the given
  * code points.
  *
  * @param from - Starting location of the token to instantiate.
  * @param value - Code points of the token to instantiate.
  *
  * @return A space token that start at the given location and contains the
  *         given code points.
  */
  export function createSpace (from : UnidocLocation, value : string) : UnidocToken {
    return create(UnidocTokenType.SPACE, from, value)
  }

  /**
  * Return a space token that start at the given location and contains the given
  * code points.
  *
  * @param from - Starting location of the token to instantiate.
  * @param [type = '\r\n'] - Type of new line to instantiate.
  *
  * @return A space token that start at the given location and contains the
  *         given code points.
  */
  export function createNewline (
    from : UnidocLocation,
    type : '\r\n' | '\r' | '\n' = '\r\n'
  ) : UnidocToken {
    const result : UnidocToken = new UnidocToken()

    result.type = UnidocTokenType.NEW_LINE
    result.text = type
    result.from.copy(from)
    result.to.copy(from)
    result.to.add(1, 0, type.length)

    return result
  }

  /**
  * Return a word token that start at the given location and contains the given
  * code points.
  *
  * @param from - Starting location of the token to instantiate.
  * @param value - Code points of the token to instantiate.
  *
  * @return A word token that start at the given location and contains the
  *         given code points.
  */
  export function createWord (from : UnidocLocation, value : string) : UnidocToken {
    return create(UnidocTokenType.WORD, from, value)
  }
}
