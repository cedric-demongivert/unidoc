import { UnidocLocation } from '@library/UnidocLocation'

import { Step } from './Step'

export namespace Block {
  export type Builder = {
    location? : UnidocLocation,
    identifier? : string,
    classes? : string[]
  }
}

export class Block extends Step {
  /**
  * Instantiate a deep copy of the given instance.
  *
  * @param toCopy - An instance to copy.
  *
  * @return A deep copy of the given instance.
  */
  public static copy (toCopy : any) : Block {
    const result : Block = new Block()

    result.copy(toCopy)

    return result
  }

  /**
  * Identifier of the block.
  */
  public identifier : string

  /**
  * Classes of the block.
  */
  public classes : string[]

  /**
  * Instantiate a new unidoc path block element.
  *
  * @param [location = UnidocLocation.ZERO] - Location of this element in the document.
  */
  public constructor ({
    location = UnidocLocation.ZERO,
    identifier = null,
    classes = []
  } : Block.Builder = {}) {
    super(location)

    this.identifier = identifier
    this.classes = [...classes]
  }

  /**
  * Deep copy an existing instance.
  *
  * @param toCopy - An instance to copy.
  */
  public copy (toCopy : Block) : void {
    this.location.copy(toCopy.location)
    this.identifier = toCopy.identifier
    this.classes.length = 0
    this.classes.push(...toCopy.classes)
  }

  /**
  * @see Object#toString
  */
  public toString () : string {
    let result : string[] = ['unidoc:block']

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

    if (other instanceof Block) {
      if (other.classes.length !== this.classes.length) {
        return false
      }

      const length : number = this.classes.length
      for (let index = 0; index < length; ++index) {
        if (other.classes[index] !== this.classes[index]) {
          return false
        }
      }

      return other.identifier === this.identifier
    }

    return false
  }
}
}
