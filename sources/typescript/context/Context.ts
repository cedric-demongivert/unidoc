import { Location } from '@library/Location'

/**
* A unidoc calling context.
*/
export class Context {
  private _location : Location
  private _exiting : boolean

  /**
  * Instantiate a new context element.
  */
  public constructor () {
    this._location = new Location()
    this._exiting = false
  }

  public get location () : Location {
    return this._location
  }

  public set location (location : Location) {
    this._location.copy(location)
  }

  public get entering () : boolean {
    return !this._exiting
  }

  public get exiting () : boolean {
    return this._exiting
  }

  public set exiting (exiting : boolean) {
    this._exiting = exiting
  }

  public set entering (entering : boolean) {
    this._exiting = !entering
  }

  public clear () : void {
    this._location.set(0, 0, 0)
    this._exiting = false
  }

  /**
  * @see Object#toString
  */
  public toString () : string {
    return (this._exiting ? 'exiting' : 'entering') +
    ` context ${this._location.toString()}`
  }

  /**
  * @see Object#equals
  */
  public equals (other : any) {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof Context) {
      return other.location.equals(this._location) &&
             other.exiting === this._exiting
    }

    return false
  }
}

export namespace Context {
  /**
  * Return a deep copy of the given instance.
  *
  * @param toCopy - An instance to copy.
  *
  * @return A deep copy of the given instance.
  */
  export function copy (toCopy : Context) : Context {
    return Object.getPrototypeOf(toCopy).constructor.copy(toCopy)
  }
}
