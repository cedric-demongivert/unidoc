import { UnidocLocation } from '@library/UnidocLocation'

/**
* Element of a unidoc path.
*/
export class Step {
  /**
  * Instantiate a deep copy of the given instance.
  *
  * @param toCopy - An instance to copy.
  *
  * @return A deep copy of the given instance.
  */
  public static copy (step) : Step {
    return Object.getPrototypeOf(step).copy(step)
  }

  /**
  * Location of this element in the document.
  */
  public location : UnidocLocation

  /**
  * Instantiate a new unidoc path element.
  *
  * @param [location = UnidocLocation.ZERO] - Location of this element in the document.
  */
  public constructor (location : UnidocLocation = UnidocLocation.ZERO) {
    this.location = UnidocLocation.copy(location)
  }

  /**
  * @see Object#toString
  */
  public toString () : string {
    return `unidoc:any(${this.location})`
  }

  /**
  * @see Object#equals
  */
  public equals (other : any) : boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof Step) {
      return other.location.equals(this.location)
    }

    return false
  }
}
