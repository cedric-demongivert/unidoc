import { UnidocOriginType } from './UnidocOriginType'
import { UnidocOrigin } from './UnidocOrigin'

/**
* An object that define a buffer at the origin of a unidoc value.
*/
export class UnidocBufferOrigin implements UnidocOrigin {
  /**
  * @see UnidocOrigin.type
  */
  public readonly type : UnidocOriginType

  /**
  * @see UnidocOrigin.origin
  */
  public readonly origin : null

  /**
  * The location in the buffer at the origin of the unidoc value expressed in bytes.
  */
  public readonly byte : number

  /**
  * Instantiate a new buffer origin.
  *
  * @param byte - The location in the buffer at the origin of the unidoc value expressed in bytes.
  */
  public constructor (byte : number) {
    this.type = UnidocOriginType.BUFFER
    this.origin = null
    this.byte = byte
  }

  /**
  * @see UnidocOrigin.toElementString
  */
  public toElementString () : string {
    return 'byte ' + this.byte
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

    if (other instanceof UnidocBufferOrigin) {
      return this.type === other.type &&
             this.byte === other.byte &&
             UnidocOrigin.equals(this.origin, other.origin)
    }

    return false
  }
}

export namespace UnidocBufferOrigin {
  /**
  * Instantiate a new buffer origin.
  *
  * @param byte - The location in the buffer at the origin of the unidoc value expressed in bytes.
  */
  export function create (byte : number) : UnidocBufferOrigin {
    return new UnidocBufferOrigin(byte)
  }
}
