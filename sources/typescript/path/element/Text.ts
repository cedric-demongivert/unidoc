import { UnidocLocation } from '@library/UnidocLocation'

import { Element } from './Element'

export class Text extends Element {
  /**
  * Instantiate a new unidoc path text element.
  *
  * @param [location = UnidocLocation.ZERO] - UnidocLocation of this element in the document.
  */
  public constructor (location : UnidocLocation = UnidocLocation.ZERO) {
    super(location)
  }

  /**
  * Deep copy an existing instance.
  *
  * @param toCopy - An instance to copy.
  */
  public copy (toCopy : Text) : void {
    this.location.copy(toCopy.location)
  }

  /**
  * @see Object#toString
  */
  public toString () : string {
    return `unidoc:text(${this.location})`
  }

  /**
  * @see Object#equals
  */
  public equals (other : any) : boolean {
    return super.equals(other) && other instanceof Text
  }
}

export namespace Text {
  /**
  * Instantiate a deep copy of the given instance.
  *
  * @param toCopy - An instance to copy.
  *
  * @return A deep copy of the given instance.
  */
  export function copy (toCopy : Text) : Text {
    const result : Text = new Text()

    result.copy(toCopy)

    return result
  }
}
