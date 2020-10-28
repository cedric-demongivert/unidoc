import { UnidocOriginElementType } from './UnidocOriginElementType'
import { UnidocOriginElement } from './UnidocOriginElement'

/**
* An object that define a distant machine at the origin of a unidoc value.
*/
export class UnidocNetworkOrigin implements UnidocOriginElement {
  /**
  * @see UnidocOriginElement.type
  */
  public readonly type : UnidocOriginElementType

  /**
  * The address of the distant machine.
  */
  public readonly address : string

  /**
  * Instantiate a new network origin.
  *
  * @param address - Address of the machine at the origin of the unidoc value.
  */
  public constructor (address : string) {
    this.type = UnidocOriginElementType.NETWORK
    this.address = address
  }

  /**
  * @see UnidocOriginElement.toString
  */
  public toString () : string {
    return this.address
  }

  /**
  * @see UnidocOriginElement.equals
  */
  public equals (other : any) : boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocNetworkOrigin) {
      return this.type === other.type &&
             this.address === other.address
    }

    return false
  }
}

export namespace UnidocNetworkOrigin {
  /**
  * Instantiate a new network origin.
  *
  * @param address - Address of the machine at the origin of the unidoc value.
  */
  export function create (address : string) : UnidocNetworkOrigin {
    return new UnidocNetworkOrigin(address)
  }
}
