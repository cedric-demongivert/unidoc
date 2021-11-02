import { Duplicator } from '@cedric-demongivert/gl-tool-collection'

import { UTF32CodeUnit } from '../symbol/UTF32CodeUnit'
import { UTF32String } from '../symbol/UTF32String'

import { UnidocPath } from '../origin/UnidocPath'

import { DataObject } from '../DataObject'

import { UnidocTokenType } from './UnidocTokenType'

/**
 * A sequence of unidoc symbol that represent a given class of word.
 */
export class UnidocToken implements DataObject {
  /**
   * Index of this token in the sequence of token of the underlying document.
   */
  public index: number

  /**
   * Type of this unidoc token.
   */
  public type: UnidocTokenType

  /**
   * The location of this token in the underlying source of symbols.
   */
  public readonly origin: UnidocPath

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
    this.index = 0
    this.type = UnidocTokenType.DEFAULT_TYPE
    this.symbols = UTF32String.allocate(capacity)
    this.origin = new UnidocPath()
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
  * Configure this token as an identifier token that start at the given location
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
  public asNewline(type: '\r\n' | '\r' | '\n' = '\r\n'): void {
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
  * @see DataObject.copy
  */
  public copy(toCopy: this): this {
    this.index = toCopy.index
    this.type = toCopy.type
    this.origin.copy(toCopy.origin)
    this.symbols.copy(toCopy.symbols)
    return this
  }

  /**
  * @see DataObject.clone
  */
  public clone(): UnidocToken {
    const result: UnidocToken = new UnidocToken(this.symbols.capacity)
    result.copy(this)
    return result
  }

  /**
  * @see DataObject.clear
  */
  public clear(): this {
    this.index = 0
    this.type = UnidocTokenType.DEFAULT_TYPE
    this.symbols.clear()
    this.origin.clear()
    return this
  }

  /**
  * @see Object.toString
  */
  public toString(): string {
    let result: string = this.constructor.name

    result += ' '
    result += this.index.toString().padEnd(5)
    result += ' #'
    result += this.type.toString().padEnd(2)
    result += ' ('
    result += (UnidocTokenType.toString(this.type) || 'undefined').padEnd(10)
    result += ') "'
    result += this.symbols.toDebugString()
    result += '" '
    result += this.origin.toString()

    return result
  }

  /**
  * @see DataObject.equals
  */
  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocToken) {
      return other.index === this.index &&
        other.type === this.type &&
        other.origin.equals(this.origin) &&
        other.symbols.equals(this.symbols)
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
