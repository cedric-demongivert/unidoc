import { Duplicator } from '@cedric-demongivert/gl-tool-collection'
import { Empty } from '@cedric-demongivert/gl-tool-utils'

import { UTF32StringSet, UTF32String } from '../symbol'
import { UnidocPath, UnidocLayout } from '../origin'

import { DataObject } from '../DataObject'

import { UnidocEventType } from './UnidocEventType'

/**
 * 
 */
const TAG_EVENT_CONFIGURATION: RegExp = /^([a-zA-Z0-9\-]+)(#[a-zA-Z0-9\-]+)?((?:\.[a-zA-Z0-9\-]+)+)?$/i

/**
 * An unidoc event.
 */
export class UnidocEvent implements DataObject<UnidocEvent> {
  /**
   * Type of this event.
   */
  public type: UnidocEventType

  /**
   * Identifier associated to the block or the tag if any.
   */
  public readonly identifier: UTF32String

  /**
   * Classes associated to the block or the tag if any.
   */
  public readonly classes: UTF32StringSet

  /**
   * Content associated to this event.
   */
  public readonly symbols: UTF32String

  /**
   * 
   */
  public readonly origin: UnidocLayout

  /**
   * 
   */
  public readonly path: UnidocPath

  /**
   * Instantiate a new unidoc event.
   */
  public constructor() {
    this.type = UnidocEventType.START_TAG
    this.identifier = UTF32String.allocate(64)
    this.classes = new UTF32StringSet()
    this.symbols = UTF32String.allocate(64)
    this.origin = new UnidocLayout()
    this.path = new UnidocPath()
  }

  /**
   *
   */
  public assertStartOfAnyTag(): void {
    if (this.type !== UnidocEventType.START_TAG) {
      throw new Error(`Expected start of any tag, but received ${this.toString()}`)
    }
  }

  /**
   *
   */
  public isStartOfAnyTag(): boolean {
    return this.type === UnidocEventType.START_TAG
  }

  /**
   *
   */
  public assertStartOfTag(tag: string): void {
    if (this.type !== UnidocEventType.START_TAG || !this.symbols.equalsToString(tag)) {
      throw new Error(`Expected start of tag "${tag}", but received ${this.toString()}`)
    }
  }

  /**
   *
   */
  public isStartOfTag(tag: string): boolean {
    return this.type === UnidocEventType.START_TAG && this.symbols.equalsToString(tag)
  }

  /**
   *
   */
  public assertStartOfUTF32Tag(tag: UTF32String): void {
    if (this.type !== UnidocEventType.START_TAG || !this.symbols.equals(tag)) {
      throw new Error(`Expected start of tag "${tag.toString()}", but received ${this.toString()}`)
    }
  }

  /**
   *
   */
  public isStartOfUTF32Tag(tag: UTF32String): boolean {
    return this.type === UnidocEventType.START_TAG && this.symbols.equals(tag)
  }

  /**
   *
   */
  public assertEndOfAnyTag(): void {
    if (this.type !== UnidocEventType.END_TAG) {
      throw new Error(`Expected end of any tag, but received ${this.toString()}`)
    }
  }

  /**
   *
   */
  public isEndOfAnyTag(): boolean {
    return this.type === UnidocEventType.END_TAG
  }

  /**
   *
   */
  public assertEndOfTag(tag: string): void {
    if (this.type !== UnidocEventType.END_TAG || !this.symbols.equalsToString(tag)) {
      throw new Error(`Expected end of tag "${tag}", but received ${this.toString()}`)
    }
  }

  /**
   *
   */
  public isEndOfTag(tag: string): boolean {
    return this.type === UnidocEventType.END_TAG && this.symbols.equalsToString(tag)
  }

  /**
   *
   */
  public assertEndOfUTF32Tag(tag: UTF32String): void {
    if (this.type !== UnidocEventType.END_TAG || !this.symbols.equals(tag)) {
      throw new Error(`Expected end of tag "${tag.toString()}", but received ${this.toString()}`)
    }
  }

  /**
   *
   */
  public isEndOfUTF32Tag(tag: UTF32String): boolean {
    return this.type === UnidocEventType.END_TAG && this.symbols.equals(tag)
  }

  /**
   *
   */
  public assertWhitespace(): void {
    if (this.type !== UnidocEventType.WHITESPACE) {
      throw new Error(`Expected whitespace, but received ${this.toString()}`)
    }
  }

  /**
   *
   */
  public isWhitespace(): boolean {
    return this.type === UnidocEventType.WHITESPACE
  }

  /**
   *
   */
  public assertWord(): void {
    if (this.type !== UnidocEventType.WORD) {
      throw new Error(`Expected word, but received ${this.toString()}`)
    }
  }

  /**
   *
   */
  public isWord(): boolean {
    return this.type === UnidocEventType.WORD
  }

  /**
   *
   */
  public assertText(): void {
    if (this.type !== UnidocEventType.WORD && this.type !== UnidocEventType.WHITESPACE) {
      throw new Error(`Expected text, but received ${this.toString()}`)
    }
  }

  /**
   *
   */
  public isText(): boolean {
    return this.type === UnidocEventType.WORD || this.type === UnidocEventType.WHITESPACE
  }

  /**
   * 
   */
  public setType(type: UnidocEventType): this {
    this.type = type
    return this
  }

  /**
   * 
   */
  public setIdentifier(identifier: UTF32String): this {
    this.identifier.copy(identifier)
    return this
  }

  /**
   * 
   */
  public setClasses(classes: UTF32StringSet): this {
    this.classes.copy(classes)
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
   * 
   */
  public setPath(path: UnidocPath): this {
    this.path.copy(path)
    return this
  }

  /**
   * Configure this event as a new word event.
   *
   * @param content - Content of the resulting event.
   */
  public asWord(content: string): this {
    this.identifier.clear()
    this.symbols.clear()
    this.classes.clear()

    this.type = UnidocEventType.WORD
    this.symbols.setString(content)

    return this
  }

  /**
   * Configure this event as a new whitespace event.
   *
   * @param content - Content of the resulting event.
   */
  public asWhitespace(content: string): this {
    this.identifier.clear()
    this.symbols.clear()
    this.classes.clear()

    this.type = UnidocEventType.WHITESPACE
    this.symbols.setString(content)

    return this
  }

  /**
   * Configure this event as a new starting tag event.
   *
   * @param configuration - Type, identifiers and classes of the resulting tag.
   */
  public asTagStart(configuration: string): this {
    this.symbols.clear()
    this.classes.clear()
    this.identifier.clear()

    this.type = UnidocEventType.START_TAG

    const tokens: RegExpExecArray | null = TAG_EVENT_CONFIGURATION.exec(configuration)

    if (tokens != null) {
      this.symbols.setString(tokens[1])
      this.identifier.setString(tokens[2] == null ? Empty.STRING : tokens[2].substring(1))

      if (tokens[3] != null) {
        for (const token of tokens[3].substring(1).split('.')) {
          this.classes.addString(token)
        }
      }
    }

    return this
  }

  /**
   * Configure this event as a new ending tag event.
   *
   * @param configuration - Type, identifiers and classes of the resulting tag.
   */
  public asTagEnd(configuration: string): this {
    this.symbols.clear()
    this.classes.clear()
    this.identifier.clear()

    this.type = UnidocEventType.END_TAG

    const tokens: RegExpExecArray | null = TAG_EVENT_CONFIGURATION.exec(configuration)

    if (tokens != null) {
      this.symbols.setString(tokens[1])
      this.identifier.setString(tokens[2] == null ? Empty.STRING : tokens[2].substring(1))

      if (tokens[3] != null) {
        for (const token of tokens[3].substring(1).split('.')) {
          this.classes.addString(token)
        }
      }
    }

    return this
  }

  /**
   * Add the given classes to this event set of classes.
   *
   * @param classes - An iterable of classes to add to this event set of classes.
   */
  public addClasses(classes: Iterable<UTF32String>): this {
    this.classes.addMany(classes)
    return this
  }

  /**
   * @see DataObject.copy
   */
  public copy(toCopy: UnidocEvent): this {
    this.type = toCopy.type
    this.identifier.copy(toCopy.identifier)
    this.symbols.copy(toCopy.symbols)
    this.origin.copy(toCopy.origin)
    this.classes.copy(toCopy.classes)
    this.path.copy(toCopy.path)

    return this
  }

  /**
   * @see DataObject.clone
   */
  public clone(): UnidocEvent {
    const result: UnidocEvent = new UnidocEvent()
    result.copy(this)
    return result
  }

  /**
   * @see DataObject.clear
   */
  public clear(): this {
    this.type = UnidocEventType.START_TAG
    this.identifier.clear()
    this.origin.clear()
    this.classes.clear()
    this.symbols.clear()

    return this
  }

  /**
   * 
   */
  public stringifyContent(): string {
    let result: string = Empty.STRING

    result += UnidocEventType.toSignature(this.type)

    switch (this.type) {
      case UnidocEventType.WORD:
      case UnidocEventType.WHITESPACE:
        result += ' "'
        result += this.symbols.toDebugString()
        result += '"'
        break
      default:
        result += ' \\'
        result += this.symbols.toString()

        if (this.identifier.size > 0) {
          result += '#'
          result += this.identifier.toString()
        }

        if (this.classes.size > 0) {
          for (const clazz of this.classes) {
            result += '.'
            result += clazz
          }
        }
    }

    return result
  }

  /**
   * 
   */
  public stringifyLocation(): string {
    let result: string = Empty.STRING

    if (this.path.size > 0) {
      result += '('
      result += this.path.toString()
      result += ') '
    }

    result += this.origin.toString()

    return result
  }

  /**
   * @see Object.toString
   */
  public toString(): string {
    let result: string = ''

    result += this.constructor.name
    result += ' '
    result += this.stringifyContent()

    result += ' '
    result += this.origin.toString()

    if (this.path.size > 0) {
      result += ' ('
      result += this.path.toString()
      result += ')'
    }

    return result
  }

  /**
   * @see DataObject.equals
   */
  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocEvent) {
      switch (other.type) {
        case UnidocEventType.WORD:
        case UnidocEventType.WHITESPACE:
          return (
            other.type === this.type &&
            this.symbols.equals(other.symbols) &&
            other.origin.equals(this.origin) &&
            other.path.equals(this.path)
          )
        default:
          return (
            other.type === this.type &&
            other.classes.equals(this.classes) &&
            other.identifier.equals(this.identifier) &&
            this.symbols.equals(other.symbols) &&
            other.origin.equals(this.origin) &&
            other.path.equals(this.path)
          )
      }
    }

    return false
  }
}

export namespace UnidocEvent {
  /**
   * Create a new unidoc event.
   */
  export function create(): UnidocEvent {
    return new UnidocEvent()
  }

  /**
   * Create a word unidoc event.
   */
  export function word(content: string): UnidocEvent {
    const result: UnidocEvent = new UnidocEvent()
    result.asWord(content)
    return result
  }

  /**
   * Create a whitespace unidoc event.
   */
  export function whitespace(content: string): UnidocEvent {
    const result: UnidocEvent = new UnidocEvent()
    result.asWhitespace(content)
    return result
  }

  /**
   * Create a tag start unidoc event.
   */
  export function tagStart(configuration: string): UnidocEvent {
    const result: UnidocEvent = new UnidocEvent()
    result.asTagStart(configuration)
    return result
  }

  /**
   * Create a tag end unidoc event.
   */
  export function tagEnd(configuration: string): UnidocEvent {
    const result: UnidocEvent = new UnidocEvent()
    result.asTagEnd(configuration)
    return result
  }

  /**
   * 
   */
  export const ALLOCATOR: Duplicator<UnidocEvent> = Duplicator.fromFactory(create)
}
