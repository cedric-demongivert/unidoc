import { UnidocLocation } from '@library/UnidocLocation'

import { Step } from './Step'

export namespace Element {
  export type Builder = {
    location? : UnidocLocation,
    type? : number,
    label? : string,
    identifier? : string,
    classes? : string[]
  }
}

export class Element extends Step {
  /**
  * Type of the element.
  */
  public type : number

  /**
  * Label of the element.
  */
  public label : string

  /**
  * Identifier of the element.
  */
  public identifier : string

  /**
  * Classes of the block.
  */
  public classes : string[]

  /**
  * Instantiate a deep copy of the given instance.
  *
  * @param toCopy - An instance to copy.
  *
  * @return A deep copy of the given instance.
  */
  public static copy (toCopy : any) : Element {
    const result : Element = new Element()

    result.copy(toCopy)

    return result
  }

  /**
  * Instantiate a new unidoc path element.
  *
  * @param configuration - Configuration of the element to build.
  */
  public constructor ({
    location = UnidocLocation.ZERO,
    type = 0,
    label = null,
    identifier = null,
    classes = []
  } : Element.Builder = {}) {
    super(location)

    this.type = type
    this.label = label
    this.identifier = identifier
    this.classes = [...classes]
  }

  /**
  * Deep copy an existing instance.
  *
  * @param toCopy - An instance to copy.
  */
  public copy (toCopy : Element) : void {
    this.location.copy(toCopy.location)
    this.type = toCopy.type
    this.label = toCopy.label
    this.identifier = toCopy.identifier
    this.classes.length = 0
    this.classes.push(...toCopy.classes)
  }

  /**
  * @see Object#toString
  */
  public toString () : string {
    let result : string[] = ['unidoc:element:', this.label]

    if (this.identifier) {
      result.push('#', this.identifier)
    }

    if (this.classes.length > 0) {
      for (let element of this.classes) {
        result.push('.', element)
      }
    }

    result.push('(', this.location.toString(), ')')

    return result.join('')
  }

  /**
  * @see Object#equals
  */
  public equals (other : any) : boolean {
    if (!super.equals(other)) return false

    if (other instanceof Element) {
      if (other.classes.length !== this.classes.length) {
        return false
      }

      const length : number = this.classes.length
      for (let index = 0; index < length; ++index) {
        if (other.classes[index] !== this.classes[index]) {
          return false
        }
      }

      return other.identifier === this.identifier &&
             other.label === this.label &&
             other.type === this.type
    }

    return false
  }
}
