import { UnidocOriginType } from './UnidocOriginType'
import { UnidocOrigin } from './UnidocOrigin'

/**
* An object that define a continuity between two origins as the origin of a unidoc value.
*/
export class UnidocRangeOrigin implements UnidocOrigin {
  /**
  * @see UnidocOrigin.type
  */
  public readonly type : UnidocOriginType

  /**
  * @see UnidocOrigin.origin
  */
  public readonly origin : null

  /**
  * Starting origin.
  */
  public readonly from : UnidocOrigin

  /**
  * Ending origin.
  */
  public readonly to : UnidocOrigin

  /**
  * Instantiate a new range origin.
  *
  * @param from - A starting origin.
  * @param to - An ending origin.
  */
  public constructor (from : UnidocOrigin, to : UnidocOrigin) {
    this.type = UnidocOriginType.RANGE
    this.origin = null
    this.from = from
    this.to = to
  }

  /**
  * @see UnidocOrigin.toElementString
  */
  public toElementString () : string {
    return 'from ' + UnidocOrigin.toString(this.from) +
           ' to ' + UnidocOrigin.toString(this.to)
  }

  /**
  * @see UnidocOrigin.toString
  */
  public toString () : string {
    return UnidocOrigin.toString(this)
  }

  /**
  * @see UnidocOrigin.equals
  */
  public equals (other : any) : boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocRangeOrigin) {
      return this.type === other.type &&
             this.from.equals(other.from) &&
             this.to.equals(other.to) &&
             UnidocOrigin.equals(this.origin, other.origin)
    }

    return false
  }
}

export namespace UnidocRangeOrigin {
  /**
  * Instantiate a new range origin.
  *
  * @param from - A starting origin.
  * @param to - An ending origin.
  */
  export function create (from : UnidocOrigin, to : UnidocOrigin) : UnidocRangeOrigin {
    return new UnidocRangeOrigin(from, to)
  }
}
