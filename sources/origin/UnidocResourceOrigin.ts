import { UnidocOriginType } from './UnidocOriginType'
import { UnidocOrigin } from './UnidocOrigin'

/**
* An object that define a resource at the origin of a unidoc value.
*/
export class UnidocResourceOrigin implements UnidocOrigin {
  /**
  * @see UnidocOrigin.type
  */
  public readonly type : UnidocOriginType

  /**
  * @see UnidocOrigin.origin
  */
  public readonly origin : UnidocOrigin | null

  /**
  * Unified resource identifier that identify the resource at the origin of the
  * unidoc value.
  */
  public readonly unifiedResourceIdentifier : string

  /**
  * Instantiate a new resource origin.
  *
  * @param unifiedResourceIdentifier - The unified resource identifier of the resource at the origin of the unidoc value.
  * @param [origin = null] - An origin in the resource.
  */
  public constructor (
    unifiedResourceIdentifier : string,
    origin : UnidocOrigin | null = null
  ) {
    this.type = UnidocOriginType.RESOURCE
    this.origin = origin
    this.unifiedResourceIdentifier = unifiedResourceIdentifier
  }

  /**
  * @see UnidocOrigin.toElementString
  */
  public toElementString () : string {
    return this.unifiedResourceIdentifier
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

    if (other instanceof UnidocResourceOrigin) {
      return this.type === other.type &&
             this.unifiedResourceIdentifier === other.unifiedResourceIdentifier &&
             UnidocOrigin.equals(this.origin, other.origin)
    }

    return false
  }
}

export namespace UnidocResourceOrigin {
  /**
  * Instantiate a new resource origin.
  *
  * @param unifiedResourceIdentifier - The unified resource identifier of the resource at the origin of the unidoc value.
  * @param [origin = null] - An origin in the resource.
  */
  export function create (
    unifiedResourceIdentifier : string,
    origin : UnidocOrigin | null = null
  ) : UnidocResourceOrigin {
    return new UnidocResourceOrigin(unifiedResourceIdentifier, origin)
  }
}
