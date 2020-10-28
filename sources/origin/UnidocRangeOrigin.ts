import { UnidocOrigin } from './UnidocOrigin'

/**
* An object that define a continuity between two origins as the origin of a unidoc value.
*/
export class UnidocRangeOrigin {
  /**
  * Starting origin.
  */
  public readonly from : UnidocOrigin

  /**
  * Ending origin.
  */
  public readonly to : UnidocOrigin

  public constructor (capacity : number = 8) {
    this.from = new UnidocOrigin(capacity)
    this.to = new UnidocOrigin(capacity)
  }

  public runtime () : UnidocRangeOrigin {
    this.from.runtime()
    this.to.runtime()
    return this
  }

  public at (origin : UnidocOrigin) : UnidocRangeOrigin {
    this.from.copy(origin)
    this.to.copy(origin)
    return this
  }

  public copy (toCopy : UnidocRangeOrigin) : void {
    this.from.copy(toCopy.from)
    this.to.copy(toCopy.to)
  }

  public clear () : void {
    this.from.clear()
    this.to.clear()
  }

  /**
  * @see Object.toString
  */
  public toString () : string {
    if (this.from.equals(this.to)) {
      return this.from.toString()
    } else {
      return 'from ' + this.from.toString() + ' to ' + this.to.toString()
    }
  }

  /**
  * @see Object.equals
  */
  public equals (other : any) : boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocRangeOrigin) {
      return this.from.equals(other.from) &&
             this.to.equals(other.to)
    }

    return false
  }
}

export namespace UnidocRangeOrigin {
  /**
  * Instantiate a new range origin.
  */
  export function create () : UnidocRangeOrigin {
    return new UnidocRangeOrigin()
  }

  export const RUNTIME : UnidocRangeOrigin = new UnidocRangeOrigin(1).runtime()

  export function runtime () : UnidocRangeOrigin {
    return RUNTIME
  }
}
