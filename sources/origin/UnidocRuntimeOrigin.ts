import { UnidocOriginElementType } from './UnidocOriginElementType'
import { UnidocOriginElement } from './UnidocOriginElement'

/**
* An object that define the execution of a program at the origin of a unidoc value.
*/
export class UnidocRuntimeOrigin implements UnidocOriginElement {
  /**
  * @see UnidocOriginElement.type
  */
  public readonly type : UnidocOriginElementType

  /**
  * Instantiate a new runtime origin.
  */
  public constructor () {
    this.type = UnidocOriginElementType.RUNTIME
  }

  /**
  * @see UnidocOriginElement.toString
  */
  public toString () : string {
    return 'runtime'
  }

  /**
  * @see UnidocOriginElement.equals
  */
  public equals (other : any) : boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocRuntimeOrigin) {
      return this.type === other.type
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
