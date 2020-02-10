import { Location } from '@library/Location'

import { UnidocEventType } from './UnidocEventType'

/**
* A unidoc event.
*/
export class UnidocEvent {
  /**
  * Emission timestamp.
  */
  public timestamp : number

  /**
  * Type of event.
  */
  protected _type : UnidocEventType

  /**
  * Location into the document stream.
  */
  private _location : Location

  /**
  * Instantiate a new unidoc event.
  *
  * @param type - Type of event to instantiate.
  */
  public constructor (type : UnidocEventType) {
    this._location = new Location()
    this.timestamp = Date.now()
    this._type     = type
  }

  /**
  * @return The location of this event into the document stream.
  */
  public get location () : Location {
    return this._location
  }

  /**
  * Update the location of this event into the document stream.
  *
  * @param location - The new location into the document stream.
  */
  public set location (location : Location) {
    this._location.copy(location)
  }

  /**
  * @return The type identifier of this event.
  */
  public get type () : UnidocEventType {
    return this._type
  }

  /**
  * @return A deep copy of this event.
  */
  public clone () : UnidocEvent {
    return UnidocEvent.copy(this)
  }

  /**
  * Reset this event structure in order to reuse it.
  */
  public reset () : void {
    this._location.set(0, 0, 0)
    this.timestamp = Date.now()
  }

  /**
  * @see Object#toString
  */
  public toString () : string {
    return this.timestamp + ' ' + UnidocEventType.toString(this._type) + ' ' +
           this._location.toString()
  }

  /**
  * @see Object#equals
  */
  public equals (other : any) {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocEvent) {
      return other.timestamp === this.timestamp &&
             other.type === this._type &&
             other.location.equals(this._location)
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
  export function copy (toCopy : UnidocEvent) : UnidocEvent {
    return Object.getPrototypeOf(toCopy).constructor.copy(toCopy)
  }
}
