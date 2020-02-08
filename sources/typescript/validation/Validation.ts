import { Path } from '@library/path'

import { Type } from './Type'

export class Validation {
  public type : Type
  public path : Path
  public message : string

  /**
  * Instantiate a new validation element.
  *
  * @param configuration - Validation instance configuration.
  */
  public constructor (configuration : Validation.Configuration) {
    this.type = configuration.type
    this.path = Path.copy(configuration.path)
    this.message = configuration.message
  }

  /**
  * Copy an existing instance.
  *
  * @param toCopy - An instance to copy.
  */
  public copy (toCopy : Validation) : void {
    this.type = toCopy.type
    this.path.copy(toCopy.path)
    this.message = toCopy.message
  }

  /**
  * @see Object#toString
  */
  public toString () : string {
    return (
      `[${Type.toString(this.type)}] ${this.path.toString()} : ${this.message}`
    )
  }

  /**
  * @see Object#equals
  */
  public equals (other : any) : boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof Validation) {
      return other.type === this.type &&
             other.path.equals(this.path) &&
             other.message === this.message
    }

    return false
  }
}

export namespace Validation {
  /**
  * Validation building configuration.
  */
  export type Configuration = {
    type : Type,
    path : Path,
    message : string
  }

  /**
  * Return a deep copy of the given instance.
  *
  * @param toCopy - An instance to copy.
  *
  * @return A deep copy of the given instance.
  */
  export function copy (toCopy : Validation) : Validation {
    return new Validation(toCopy)
  }
}
