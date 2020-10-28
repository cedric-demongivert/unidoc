import { UnidocOriginType } from './UnidocOriginType'
import { UnidocOrigin } from './UnidocOrigin'

/**
* An object that define the execution of a program at the origin of a unidoc value.
*/
export class UnidocRuntimeOrigin implements UnidocOrigin {
  /**
  * @see UnidocOrigin.type
  */
  public readonly type : UnidocOriginType

  /**
  * @see UnidocOrigin.origin
  */
  public readonly origin : null

  /**
  * Instantiate a new runtime origin.
  */
  public constructor () {
    this.type = UnidocOriginType.RUNTIME
    this.origin = null
  }

  /**
  * @see UnidocOrigin.toElementString
  */
  public toElementString () : string {
    return 'at runtime'
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

    if (other instanceof UnidocRuntimeOrigin) {
      return this.type === other.type &&
             UnidocOrigin.equals(this.origin, other.origin)
    }

    return false
  }
}

export namespace UnidocRuntimeOrigin {
  export const INSTANCE : UnidocRuntimeOrigin = new UnidocRuntimeOrigin()

  /**
  * Instantiate a new runtime origin.
  */
  export function create () : UnidocRuntimeOrigin {
    return INSTANCE
  }
}
