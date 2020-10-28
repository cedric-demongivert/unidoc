import { UnidocOriginElementType } from './UnidocOriginElementType'
import { UnidocOriginElement } from './UnidocOriginElement'

/**
* An object that define a resource at the origin of a unidoc value.
*/
export class UnidocResourceOrigin implements UnidocOriginElement {
  /**
  * @see UnidocOriginElement.type
  */
  public readonly type : UnidocOriginElementType

  /**
  * Unified resource identifier that identify the resource at the origin of the
  * unidoc value.
  */
  public readonly unifiedResourceIdentifier : string

  /**
  * Instantiate a new resource origin.
  *
  * @param unifiedResourceIdentifier - The unified resource identifier of the resource at the origin of the unidoc value.
  */
  public constructor (unifiedResourceIdentifier : string) {
    this.type = UnidocOriginElementType.RESOURCE
    this.unifiedResourceIdentifier = unifiedResourceIdentifier
  }

  /**
  * @see UnidocOriginElement.toString
  */
  public toString () : string {
    return this.unifiedResourceIdentifier
  }

  /**
  * @see UnidocOriginElement.equals
  */
  public equals (other : any) : boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocResourceOrigin) {
      return this.type === other.type &&
             this.unifiedResourceIdentifier === other.unifiedResourceIdentifier
    }

    return false
  }
}

export namespace UnidocResourceOrigin {
  /**
  * Instantiate a new resource origin.
  *
  * @param unifiedResourceIdentifier - The unified resource identifier of the resource at the origin of the unidoc value.
  */
  export function create (unifiedResourceIdentifier : string) : UnidocResourceOrigin {
    return new UnidocResourceOrigin(unifiedResourceIdentifier)
  }
}
