import { Allocator } from '@cedric-demongivert/gl-tool-collection'

import { UnidocLocation } from '../location/UnidocLocation'

import { UnidocPathElementType } from './UnidocPathElementType'

const TAG_ELEMENT_CONFIGURATION : RegExp = /^([a-zA-Z0-9\-]+)(#[a-zA-Z0-9\-]+)?(\.[a-zA-Z0-9\-]+)*$/i
const EMPTY_STRING : string = ''

export class UnidocPathElement {
  /**
  * Type of this element.
  */
  public type : UnidocPathElementType

  /**
  * Starting UnidocLocation of this element.
  */
  public readonly from : UnidocLocation

  /**
  * Ending UnidocLocation of this element, may be unknown.
  */
  public readonly  to : UnidocLocation

  /**
  * The name of this element, if any.
  */
  public name : string

  /**
  * Identifier associated to the block or the tag, if any.
  */
  public identifier : string

  /**
  * Classes associated to the block or the tag, if any.
  */
  public readonly classes : Set<string>

  /**
  * Instantiate a new empty path element.
  */
  public constructor () {
    this.type = UnidocPathElementType.SYMBOL
    this.from = new UnidocLocation()
    this.to = new UnidocLocation()
    this.name = EMPTY_STRING
    this.identifier = EMPTY_STRING
    this.classes = new Set<string>()
  }

  /**
  * Transform this path element as a file path element.
  *
  * @param url - URL of the file.
  * @param from - Starting location of the tag, may be unknown.
  * @param [to = from] - Ending location of the tag, may be unknown.
  */
  public asFile (url : string, from : UnidocLocation, to : UnidocLocation = from) : void {
    this.clear()
    this.type = UnidocPathElementType.FILE
    this.name = url
    this.from.copy(from)
    this.to.copy(to)
  }

  /**
  * Transform this path element as a stream path element.
  *
  * @param from - Starting location in the stream, may be unknown.
  * @param [to = from] - Ending location in the stream, may be unknown.
  */
  public asStream (from : UnidocLocation, to : UnidocLocation = from) : void {
    this.clear()
    this.type = UnidocPathElementType.STREAM
    this.from.copy(from)
    this.to.copy(to)
  }

  /**
  * Transform this path element as a memory path element.
  *
  * @param name - Name associated to this memory element.
  * @param from - Starting location in memory, may be unknown.
  * @param [to = from]- Ending location in memory, may be unknown.
  */
  public asMemory (name : string, from : UnidocLocation, to : UnidocLocation = from) : void {
    this.clear()
    this.type = UnidocPathElementType.MEMORY
    this.name = name
    this.from.copy(from)
    this.to.copy(to)
  }

  /**
  * Transform this path element as a symbol path element.
  *
  * @param location - Location of the symbol in the parent document.
  */
  public asSymbol (location : UnidocLocation) : void {
    this.clear()
    this.type = UnidocPathElementType.SYMBOL
    this.from.copy(location)
    this.to.copy(location)
  }

  /**
  * Transform this path element as a tag path element.
  *
  * @param from - Starting location of the tag.
  * @param to - Ending location of the tag, may be unknown.
  * @param configuration - Type, identifier and classes of the tag element.
  */
  public asTag (from : UnidocLocation, to : UnidocLocation, configuration : string = '') : void {
    this.clear()

    this.type = UnidocPathElementType.TAG
    this.from.copy(from)
    this.to.copy(to)

    const tokens : RegExpExecArray | null = TAG_ELEMENT_CONFIGURATION.exec(configuration)

    if (tokens != null) {
      for (let index = 1; index < tokens.length; ++index) {
        const token : string = tokens[index]

        if (token.startsWith('#')) {
          this.identifier = token.substring(1)
        } else if (token.startsWith('.')) {
          this.classes.add(token.substring(1))
        } else {
          this.name = token
        }
      }
    }
  }

  /**
  * Add the given classes to this path element.
  *
  * @param classes - Classes to add to this path element.
  */
  public addClasses (classes : Iterable<string>) : void {
    for (const clazz of classes) {
      this.classes.add(clazz)
    }
  }

  /**
  * Deep copy another path element.
  *
  * @param other - Another path element to copy.
  */
  public copy (other : UnidocPathElement) : void {
    this.type = other.type
    this.from.copy(other.from)
    this.to.copy(other.to)
    this.name = other.name
    this.identifier = other.identifier
    this.classes.clear()

    for (const clazz of other.classes) {
      this.classes.add(clazz)
    }
  }

  /**
  * @return A deep copy of this path element.
  */
  public clone () : UnidocPathElement {
    const result : UnidocPathElement = new UnidocPathElement()

    result.copy(this)

    return result
  }


  /**
  * Reset this path element to its initial state to reuse-it.
  */
  public clear () : void {
    this.type = UnidocPathElementType.SYMBOL
    this.from.clear()
    this.to.clear()
    this.name = EMPTY_STRING
    this.identifier = EMPTY_STRING
    this.classes.clear()
  }

  /**
  * @see Object#toString
  */
  public toString () : string {
    let result : string = ''

    if (this.type === UnidocPathElementType.SYMBOL) {
      result += 'symbol'
    }

    if (this.type === UnidocPathElementType.STREAM) {
      result += 'stream'
    }

    if (this.type === UnidocPathElementType.MEMORY) {
      result += 'memory:\\\\'
    }

    if (this.type === UnidocPathElementType.FILE) {
      result += 'file:\\\\'
    }

    if (this.name.length > 0) {
      if (this.type === UnidocPathElementType.TAG) {
        result += '\\'
      }
      result += this.name
    }

    if (this.identifier.length > 0) {
      result += '#'
      result += this.identifier
    }

    for (const clazz of this.classes) {
      result += '.'
      result += clazz
    }

    if (!this.from.isUnknown() && !this.to.isUnknown()) {
      if (this.from.equals(this.to)) {
        result += ' at ' + this.from.toString()
      } else {
        result += ' between ' + this.from.toString() + ' and ' + this.to.toString()
      }
    } else if (!this.from.isUnknown()) {
      result += ' from ' + this.from.toString()
    } else if (!this.to.isUnknown()) {
      result += ' until ' + this.to.toString()
    }

    return result
  }

  /**
  * @see Object#equals
  */
  public equals (other : any) : boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocPathElement) {
      if (
        other.type         !== this.type         ||
        other.classes.size !== this.classes.size ||
        other.identifier   !== this.identifier   ||
        other.name         !== this.name         ||
        !other.from.equals(this.from)            ||
        !other.to.equals(this.to)
      ) { return false }

      for (const clazz of other.classes) {
        if (!this.classes.has(clazz)) {
          return false
        }
      }

      return true
    }

    return false
  }
}

export namespace UnidocPathElement {
  /**
  * Return a copy of the given path element.
  *
  * @param other - A path element to copy.
  *
  * @return A copy of the given path element.
  */
  export function copy (toCopy : UnidocPathElement) : UnidocPathElement
  export function copy (toCopy : null) : null
  export function copy (toCopy : UnidocPathElement | null) : UnidocPathElement | null {
    return toCopy == null ? toCopy : toCopy.clone()
  }

  export const ALLOCATOR : Allocator<UnidocPathElement> = {
    /**
    * @see Allocator.copy
    */
    allocate () : UnidocPathElement {
      return new UnidocPathElement()
    },

    /**
    * @see Allocator.copy
    */
    copy (source : UnidocPathElement, destination : UnidocPathElement) : void {
      destination.copy(source)
    },

    /**
    * @see Allocator.clear
    */
    clear (instance : UnidocPathElement) : void {
      instance.clear()
    }
  }
}
