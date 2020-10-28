import { UnidocOriginType } from './UnidocOriginType'
import { UnidocOrigin } from './UnidocOrigin'

/**
* An object that define a distant machine at the origin of a unidoc value.
*/
export class UnidocNetworkOrigin implements UnidocOrigin {
  /**
  * @see UnidocOrigin.type
  */
  public readonly type : UnidocOriginType

  /**
  * @see UnidocOrigin.origin
  */
  public readonly origin : UnidocOrigin | null

  /**
  * The address of the distant machine.
  */
  public readonly address : string

  /**
  * Instantiate a new network origin.
  *
  * @param address - Address of the machine at the origin of the unidoc value.
  * @param [origin = null] - An origin in the distant machine.
  */
  public constructor (address : string, origin : UnidocOrigin | null = null) {
    this.type = UnidocOriginType.NETWORK
    this.origin = origin
    this.address = address
  }

  /**
  * @see UnidocOrigin.toElementString
  */
  public toElementString () : string {
    return this.address
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

    if (other instanceof UnidocNetworkOrigin) {
      return this.type === other.type &&
             this.address === other.address &&
             UnidocOrigin.equals(this.origin, other.origin)
    }

    return false
  }
}

export namespace UnidocNetworkOrigin {
  /**
  * Instantiate a new network origin.
  *
  * @param address - Address of the machine at the origin of the unidoc value.
  * @param [origin = null] - An origin in the distant machine.
  */
  export function create (address : string, origin : UnidocOrigin | null = null) : UnidocNetworkOrigin {
    return new UnidocNetworkOrigin(address, origin)
  }
}
