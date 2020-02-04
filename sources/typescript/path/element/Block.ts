import { Location } from '@library/Location'

import { Element } from './Element'

const CONFIGURATION : Block.Configuration = {
  location: Location.ZERO,
  identifier: null,
  classes: []
}

export class Block extends Element {
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
  * @param configuration - Block instance configuration.
  */
  public constructor (configuration : Block.Configuration = CONFIGURATION) {
    super(configuration.location)

    this.identifier = configuration.identifier
    this.classes = [...configuration.classes]
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

export namespace Block {
  /**
  * Block building configuration.
  */
  export type Configuration = {
    location? : Location,
    identifier? : string,
    classes? : string[]
  }

  /**
  * Instantiate a deep copy of the given instance.
  *
  * @param toCopy - An instance to copy.
  *
  * @return A deep copy of the given instance.
  */
  export function copy (toCopy : Block) : Block {
    const result : Block = new Block()

    result.copy(toCopy)

    return result
  }
}
