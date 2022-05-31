import { Duplicator } from '@cedric-demongivert/gl-tool-collection'

import { UTF32CodeUnit, UTF32String } from '../symbol'
import { UnidocLayout } from '../origin'

import { DataObject } from '../DataObject'

import { UnidocTokenType } from './UnidocTokenType'

/**
 * A sequence of symbols, an instance of a given class of words.
 */
export class UnidocToken implements DataObject<UnidocToken> {
  /**
   * Type of this unidoc token.
   */
  public type: UnidocTokenType

  /**
   * The location of this token in the underlying source of symbols.
   */
  public readonly origin: UnidocLayout

  /**
   * Symbols that compose this unidoc token.
   */
  public readonly symbols: UTF32String

  /**
   * Instantiate a new empty unidoc token.
   *
   * @param [capacity = 16] - Initial capacity of symbols of this token instance.
   */
  public constructor(capacity: number = 16) {
    this.type = UnidocTokenType.DEFAULT_TYPE
    this.origin = new UnidocLayout()
    this.symbols = UTF32String.allocate(capacity)
  }

  /**
   *  
   */
  public setType(type: UnidocTokenType): this {
    this.type = type
    return this
  }

  /**
   *  
   */
  public setSymbols(symbols: UTF32String): this {
    this.symbols.copy(symbols)
    return this
  }

  /**
   *  
   */
  public setOrigin(origin: UnidocLayout): this {
    this.origin.copy(origin)
    return this
  }

  /**
   * Configure this token to be of the given type, at the given location and with
   * the given code points.
   *
   * @param type - New type of this token.
   * @param value - New code points of this token.
   */
  public as(type: UnidocTokenType, value: string): void {
    this.type = type
    this.symbols.setString(value)
  }

  /**
   * Configure this token as an identifier that start at the given location
   * and contains the given code points.
   *
   * @param value - New code points of this token.
   */
  public asIdentifier(value: string): void {
    this.as(UnidocTokenType.IDENTIFIER, value)
  }

  /**
  * Configure this token as a class token that start at the given location and
  * that contains the given code points.
  *
  * @param value - New code points of this token.
  */
  public asClass(value: string): void {
    this.as(UnidocTokenType.CLASS, value)
  }

  /**
  * Configure this token as a tag token that start at the given location and
  * contains the given code points.
  *
  * @param value - New code points of this token.
  */
  public asTag(value: string): void {
    this.as(UnidocTokenType.TAG, value)
  }

  /**
  * Configure this token as a block start token that start at the given
  * location.
  */
  public asBlockStart(): void {
    this.as(UnidocTokenType.BLOCK_START, '{')
  }

  /**
  * Configure this token as a block start token that start at the given
  * location.
  */
  public asBlockEnd(): void {
    this.as(UnidocTokenType.BLOCK_END, '}')
  }

  /**
  * Configure this token as a space token that start at the given location and
  * that contains the given code points.
  *
  * @param value - New code points of this token.
  */
  public asSpace(value: string): void {
    this.as(UnidocTokenType.SPACE, value)
  }

  /**
  * Configure this token as a space token that start at the given location and
  * that contains the given code points.
  *
  * @param [type = '\r\n'] - Type of new line to configure.
  */
  public asNewline(type: string = '\r\n'): void {
    this.as(UnidocTokenType.NEW_LINE, type)
  }

  /**
  * Configure this token as a word token that start at the given location and
  * that contains the given code points.
  *
  * @param value - New code points of this token.
  */
  public asWord(value: string): void {
    this.as(UnidocTokenType.WORD, value)
  }

  /**
  * Assess if this token is a tag of the given type.
  *
  * @param tag - Type of tag to check.
  *
  * @return True if this token is a tag of the given type.
  */
  public isTag(tag: string): boolean {
    return (
      this.type === UnidocTokenType.TAG &&
      this.symbols.get(0) === UTF32CodeUnit.REVERSE_SOLIDUS &&
      this.symbols.equalsToString(tag, 1)
    )
  }

  /**
  * @see DataObject.prototype.copy
  */
  public copy(toCopy: UnidocToken): this {
    this.type = toCopy.type
    this.origin.copy(toCopy.origin)
    this.symbols.copy(toCopy.symbols)
    return this
  }

  /**
  * @see DataObject.prototype.clone
  */
  public clone(): UnidocToken {
    const result: UnidocToken = new UnidocToken(this.symbols.capacity)
    result.copy(this)
    return result
  }

  /**
  * @see DataObject.prototype.clear
  */
  public clear(): this {
    this.type = UnidocTokenType.DEFAULT_TYPE
    this.symbols.clear()
    this.origin.clear()
    return this
  }

  /**
  * @see Object.prototype.toString
  */
  public toString(): string {
    return `${this.constructor.name} ${UnidocTokenType.toSignature(this.type)} ${this.symbols.toDebugString()} ${this.origin.toString()}`
  }

  /**
  * @see DataObject.equals
  */
  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocToken) {
      return (
        other.type === this.type &&
        other.origin.equals(this.origin) &&
        other.symbols.equals(this.symbols)
      )
    }

    return false
  }
}

export namespace UnidocToken {
  /**
   * 
   */
  export function create(capacity: number = 16): UnidocToken {
    return new UnidocToken(capacity)
  }

  /**
   * 
   */
  export const ALLOCATOR: Duplicator<UnidocToken> = Duplicator.fromFactory(create)
}
