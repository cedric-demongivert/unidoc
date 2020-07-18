import { Pack } from '@cedric-demongivert/gl-tool-collection'
import { Allocator } from '@cedric-demongivert/gl-tool-collection'

import { UnidocPath } from '../path/UnidocPath'

import { UnidocLocation } from '../UnidocLocation'
import { CodePoint } from '../CodePoint'

import { UnidocEventType } from './UnidocEventType'

const TAG_EVENT_CONFIGURATION : RegExp = /^([a-zA-Z0-9\-]+)(#[a-zA-Z0-9\-]+)?((?:\.[a-zA-Z0-9\-]+)+)?$/i
const EMPTY_STRING : string = ''

/**
* A unidoc event.
*/
export class UnidocEvent {
  /**
  * Event emission timestamp.
  */
  public timestamp : number

  /**
  * Type of this event.
  */
  public type : UnidocEventType

  /**
  * Starting UnidocLocation of this event into the document stream.
  */
  public from : UnidocLocation

  /**
  * Ending UnidocLocation of this event into the document stream.
  */
  public to : UnidocLocation

  /**
  * The discovered tag, if any.
  */
  public tag : string

  /**
  * Identifier associated to the block or the tag if any.
  */
  public identifier : string

  /**
  * Classes associated to the block or the tag if any.
  */
  public readonly classes : Set<string>

  /**
  * Content associated to this event.
  */
  public readonly symbols : Pack<CodePoint>

  /**
  * Content associated to this event.
  */
  public readonly path : UnidocPath


  /**
  * Instantiate a new tag event.
  */
  public constructor () {
    this.timestamp  = Date.now()
    this.type       = UnidocEventType.START_TAG
    this.from       = new UnidocLocation()
    this.to         = new UnidocLocation()
    this.tag        = EMPTY_STRING
    this.identifier = EMPTY_STRING
    this.classes    = new Set<string>()
    this.symbols    = Pack.uint32(128)
    this.path       = new UnidocPath(32)
  }

  /**
  * @return This token as a javascript string.
  */
  public get text () : string {
    return String.fromCodePoint(...this.symbols)
  }

  /**
  * Update the content associated to this event.
  *
  * @param content - The new content associated to this event.
  */
  public set text (content : string) {
    this.symbols.clear()
    this.symbols.size = content.length

    for (let index = 0; index < content.length; ++index) {
      // no undefined code point due to boundary limit
      this.symbols.set(index, content.codePointAt(index) as CodePoint)
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
  * Configure this event as a new word event.
  *
  * @param from - New starting location of this event into the parent document.
  * @param content - Content of the resulting event.
  */
  public asWord (from : UnidocLocation, content : string) : void {
    this.clear()

    this.type = UnidocEventType.WORD
    this.from.copy(from)
    this.to.copy(from)
    this.to.add(0, content.length, content.length)
    this.text = content
  }

  /**
  * Configure this event as a new whitespace event.
  *
  * @param from - New starting location of this event into the parent document.
  * @param content - Content of the resulting event.
  */
  public asWhitespace (from : UnidocLocation, content : string) : void {
    this.clear()

    this.type = UnidocEventType.WHITESPACE
    this.from.copy(from)
    this.to.copy(from)
    this.to.add(0, content.length, content.length)
    this.text = content
  }

  /**
  * Configure this event as a new starting tag event.
  *
  * @param from - New starting location of this event into the parent document.
  * @param to - New ending location of this event into the parent document.
  * @param configuration - Type, identifiers and classes of the resulting tag.
  */
  public asTagStart (from : UnidocLocation, to : UnidocLocation, configuration : string) : void {
    this.clear()

    this.type = UnidocEventType.START_TAG
    this.from.copy(from)
    this.to.copy(to)

    this.tag = EMPTY_STRING
    this.identifier = EMPTY_STRING

    const tokens : RegExpExecArray | null = TAG_EVENT_CONFIGURATION.exec(configuration)

    if (tokens != null) {
      this.tag = tokens[1]
      this.identifier = tokens[2] == null ? EMPTY_STRING : tokens[2].substring(1)

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
  * @param from - New starting location of this event into the parent document.
  * @param to - New ending location of this event into the parent document.
  * @param configuration - Type, identifiers and classes of the resulting tag.
  */
  public asTagEnd (from : UnidocLocation, to : UnidocLocation, configuration : string) : void {
    this.clear()

    this.type = UnidocEventType.END_TAG
    this.from.copy(from)
    this.to.copy(to)

    this.tag = EMPTY_STRING
    this.identifier = EMPTY_STRING

    const tokens : RegExpExecArray | null = TAG_EVENT_CONFIGURATION.exec(configuration)

    if (tokens != null) {
      this.tag = tokens[1]
      this.identifier = tokens[2] == null ? EMPTY_STRING : tokens[2].substring(1)

      if (tokens[3] != null) {
        for (const token of tokens[3].substring(1).split('.')) {
          this.classes.add(token)
        }
      }
    }
  }

  public addClasses (classes : Iterable<string>) : void {
    for (const clazz of classes) {
      this.classes.add(clazz)
    }
  }

  /**
  * Deep copy an existing instance.
  *
  * @param toCopy - An instance to copy.
  */
  public copy (toCopy : UnidocEvent) : void {
    this.timestamp  = toCopy.timestamp
    this.type       = toCopy.type
    this.tag        = toCopy.tag
    this.identifier = toCopy.identifier
    this.path.copy(toCopy.path)

    this.from.copy(toCopy.from)
    this.to.copy(toCopy.to)

    this.symbols.copy(toCopy.symbols)

    this.classes.clear()

    for (const clazz of toCopy.classes) {
      this.classes.add(clazz)
    }
  }

  /**
  * @return A deep copy of this event.
  */
  public clone () : UnidocEvent {
    const result : UnidocEvent = new UnidocEvent()
    result.copy(this)
    return result
  }

  /**
  * Reset this event instance in order to reuse it.
  */
  public clear () : void {
    this.timestamp  = Date.now()
    this.tag        = EMPTY_STRING
    this.identifier = EMPTY_STRING
    this.path.clear()

    this.from.clear()
    this.to.clear()
    this.classes.clear()
    this.symbols.clear()
  }

  /**
  * @see Object#toString
  */
  public toString () : string {
    let result : string = ''

    result += this.timestamp
    result += ' '
    result += UnidocEventType.toString(this.type)
    result += ' '
    result += this.from.toString()
    result += ' - '
    result += this.to.toString()
    result += ' ['
    result += this.path.toString()
    result += ']'

    if (this.tag) {
      result += ' \\'
      result += this.tag
    }

    if (this.identifier != null) {
      result += ' #'
      result += this.identifier
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
      result += this.debugText
      result += '"'
    }

    return result
  }

  /**
  * Like equals, but ignore the timestamp field.
  */
  public similar (other : UnidocEvent) : boolean {
    if (
      other.type         !== this.type         ||
      other.classes.size !== this.classes.size ||
      other.identifier   !== this.identifier   ||
      other.tag          !== this.tag          ||
      !other.path.equals(this.path)
    ) { return false }

    for (const clazz of other.classes) {
      if (!this.classes.has(clazz)) {
        return false
      }
    }

    return this.symbols.equals(other.symbols)
  }

  /**
  * @see Object#equals
  */
  public equals (other : any) : boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocEvent) {
      if (
        other.timestamp    !== this.timestamp    ||
        other.type         !== this.type         ||
        other.classes.size !== this.classes.size ||
        other.identifier   !== this.identifier   ||
        other.tag          !== this.tag          ||
        !other.path.equals(this.path)
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
  * Return a deep copy of the given instance.
  *
  * @param toCopy - An instance to copy.
  *
  * @return A deep copy of the given instance.
  */
  export function copy (toCopy : UnidocEvent) : UnidocEvent
  export function copy (toCopy : null) : null
  export function copy (toCopy : UnidocEvent | null) : UnidocEvent | null {
    return toCopy == null ? toCopy : toCopy.clone()
  }

  export const ALLOCATOR : Allocator<UnidocEvent> = {
    /**
    * @see Allocator.copy
    */
    allocate () : UnidocEvent {
      return new UnidocEvent()
    },

    /**
    * @see Allocator.copy
    */
    copy (source : UnidocEvent, destination : UnidocEvent) : void {
      destination.copy(source)
    },

    /**
    * @see Allocator.clear
    */
    clear (instance : UnidocEvent) : void {
      instance.clear()
    }
  }

  export function equals (left : UnidocEvent, right : UnidocEvent) : boolean {
    return left == null ? left == right : left.equals(right)
  }
}
