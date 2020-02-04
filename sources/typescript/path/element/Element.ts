import { Location } from '@library/Location'

/**
* Element of a unidoc path.
*/
export class Element {
  /**
  * Location of this element in the document.
  */
  public location : Location

  /**
  * Instantiate a new unidoc path element.
  *
  * @param [location = Location.ZERO] - Location of this element in the document.
  */
  public constructor (location : Location = Location.ZERO) {
    this.location = Location.copy(location)
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

    if (other instanceof Element) {
      return other.location.equals(this.location)
    }

    return false
  }
}

export namespace Element {
  /**
  * Instantiate a deep copy of the given instance.
  *
  * @param toCopy - An instance to copy.
  *
  * @return A deep copy of the given instance.
  */
  export function copy (toCopy : Element) : Element {
    return Object.getPrototypeOf(toCopy).constructor.copy(toCopy)
  }
}
