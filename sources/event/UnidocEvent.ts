import { Duplicator } from '@cedric-demongivert/gl-tool-collection'

import { UTF32String } from '../symbol/UTF32String'

import { UnidocPath } from '../origin/UnidocPath'

import { DataObject } from '../DataObject'

import { UnidocEventType } from './UnidocEventType'

const TAG_EVENT_CONFIGURATION: RegExp = /^([a-zA-Z0-9\-]+)(#[a-zA-Z0-9\-]+)?((?:\.[a-zA-Z0-9\-]+)+)?$/i
const EMPTY_STRING: string = ''

/**
* A unidoc event.
*/
export class UnidocEvent implements DataObject {
  /**
   * Index of this event in the sequence of event that form the underlying document.
   */
  public index: number

  /**
  * Type of this event.
  */
  public type: UnidocEventType

  /**
  * The discovered tag, if any.
  */
  public readonly tag: UTF32String

  /**
  * Identifier associated to the block or the tag if any.
  */
  public readonly identifier: UTF32String

  /**
  * Classes associated to the block or the tag if any.
  */
  public readonly classes: Set<string>

  /**
  * Content associated to this event.
  */
  public readonly symbols: UTF32String

  /**
  * Ending location of the event into the parsed document.
  */
  public readonly origin: UnidocPath

  /**
  * Instantiate a new unidoc event.
  */
  public constructor() {
    this.index = 0
    this.type = UnidocEventType.START_TAG
    this.tag = UTF32String.allocate(64)
    this.identifier = UTF32String.allocate(64)
    this.classes = new Set<string>()
    this.symbols = UTF32String.allocate(64)
    this.origin = new UnidocPath()
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
  public isStartOfTag(tag: string): boolean {
    return this.type === UnidocEventType.START_TAG && this.tag.equalsToString(tag)
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
  public isEndOfTag(tag: string): boolean {
    return this.type === UnidocEventType.END_TAG && this.tag.equalsToString(tag)
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
  public isWord(): boolean {
    return this.type === UnidocEventType.WORD
  }

  /**
  *
  */
  public ofIndex(index: number): UnidocEvent {
    this.index = index
    return this
  }

  /**
  * Configure this event as a new word event.
  *
  * @param content - Content of the resulting event.
  */
  public asWord(content: string): void {
    this.identifier.clear()
    this.tag.clear()
    this.classes.clear()

    this.type = UnidocEventType.WORD
    this.symbols.setString(content)
  }

  /**
  * Configure this event as a new whitespace event.
  *
  * @param content - Content of the resulting event.
  */
  public asWhitespace(content: string): void {
    this.identifier.clear()
    this.tag.clear()
    this.classes.clear()

    this.type = UnidocEventType.WHITESPACE
    this.symbols.setString(content)
  }

  /**
  * Configure this event as a new starting tag event.
  *
  * @param configuration - Type, identifiers and classes of the resulting tag.
  */
  public asTagStart(configuration: string): void {
    this.symbols.clear()
    this.classes.clear()
    this.type = UnidocEventType.START_TAG

    this.tag.clear()
    this.identifier.clear()

    const tokens: RegExpExecArray | null = TAG_EVENT_CONFIGURATION.exec(configuration)

    if (tokens != null) {
      this.tag.setString(tokens[1])
      this.identifier.setString(tokens[2] == null ? EMPTY_STRING : tokens[2].substring(1))

      if (tokens[3] != null) {
        for (const token of tokens[3].substring(1).split('.')) {
          this.classes.add(token)
        }
      }
    }
  }

  /**
  * Configure this event as a new ending tag event.
  *
  * @param configuration - Type, identifiers and classes of the resulting tag.
  */
  public asTagEnd(configuration: string): void {
    this.symbols.clear()
    this.classes.clear()
    this.type = UnidocEventType.END_TAG

    this.tag.clear()
    this.identifier.clear()

    const tokens: RegExpExecArray | null = TAG_EVENT_CONFIGURATION.exec(configuration)

    if (tokens != null) {
      this.tag.setString(tokens[1])
      this.identifier.setString(tokens[2] == null ? EMPTY_STRING : tokens[2].substring(1))

      if (tokens[3] != null) {
        for (const token of tokens[3].substring(1).split('.')) {
          this.classes.add(token)
        }
      }
    }
  }

  /**
  * Add the given classes to this event set of classes.
  *
  * @param classes - An iterable of classes to add to this event set of classes.
  */
  public addClasses(classes: Iterable<string>): void {
    for (const clazz of classes) {
      this.classes.add(clazz)
    }
  }

  /**
  * @see DataObject.copy
  */
  public copy(toCopy: UnidocEvent): this {
    this.index = toCopy.index
    this.type = toCopy.type
    this.tag.copy(toCopy.tag)
    this.identifier.copy(toCopy.identifier)

    this.symbols.copy(toCopy.symbols)
    this.origin.copy(toCopy.origin)

    this.classes.clear()

    for (const clazz of toCopy.classes) {
      this.classes.add(clazz)
    }

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
    this.index = 0
    this.type = UnidocEventType.START_TAG
    this.tag.clear()
    this.identifier.clear()
    this.origin.clear()
    this.classes.clear()
    this.symbols.clear()

    return this
  }

  /**
  * @see Object.toString
  */
  public toString(): string {
    let result: string = ''

    result += this.index
    result += ' '
    result += UnidocEventType.toString(this.type)
    result += ' '
    result += this.origin.toString()

    if (this.tag.size > 0) {
      result += ' \\'
      result += this.tag.toString()
    }

    if (this.identifier.size > 0) {
      result += ' #'
      result += this.identifier.toString()
    }

    if (this.classes.size > 0) {
      result += ' '
      for (const clazz of this.classes) {
        result += '.'
        result += clazz
      }
    }

    if (this.symbols.size > 0) {
      result += ' "'
      result += this.symbols.toDebugString()
      result += '"'
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
      if (
        other.index !== this.index ||
        other.type !== this.type ||
        other.classes.size !== this.classes.size ||
        !other.identifier.equals(this.identifier) ||
        !other.tag.equals(this.tag) ||
        !other.origin.equals(this.origin)
      ) { return false }

      for (const clazz of other.classes) {
        if (!this.classes.has(clazz)) {
          return false
        }
      }

      return this.symbols.equals(other.symbols)
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
