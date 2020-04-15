import { Allocator } from '@cedric-demongivert/gl-tool-collection'

import { UnidocLocation } from '../UnidocLocation'

import { UnidocPathElementType } from './UnidocPathElementType'

const TAG_ELEMENT_CONFIGURATION : RegExp = /^([a-zA-Z0-9\-]+)(#[a-zA-Z0-9\-]+)?(\.[a-zA-Z0-9\-]+)*$/i

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
  * The tag, if any.
  */
  public tag : string

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
    this.tag = undefined
    this.identifier = undefined
    this.classes = new Set<string>()
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

    const tokens : RegExpExecArray = TAG_ELEMENT_CONFIGURATION.exec(configuration)

    this.type = UnidocPathElementType.TAG
    this.from.copy(from)
    this.to.copy(to)

    for (let index = 1; index < tokens.length; ++index) {
      const token : string = tokens[index]

      if (token.startsWith('#')) {
        this.identifier = token.substring(1)
      } else if (token.startsWith('.')) {
        this.classes.add(token.substring(1))
      } else {
        this.tag = token
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
    this.tag = other.tag
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
    this.tag = undefined
    this.identifier = undefined
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

    if (this.tag) {
      result += '\\'
      result += this.tag
    }

    if (this.identifier) {
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
      result += ' at ' + this.from.toString()
    } else if (!this.to.isUnknown()) {
      result += ' at ' + this.to.toString()
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
        other.tag          !== this.tag          ||
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
  export function copy (toCopy : UnidocPathElement) : UnidocPathElement {
    return toCopy == null ? null : toCopy.clone()
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
