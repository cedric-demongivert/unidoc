import { UnidocOriginElementType } from './UnidocOriginElementType'

import { UnidocBufferOrigin } from './UnidocBufferOrigin'
import { UnidocNetworkOrigin } from './UnidocNetworkOrigin'
import { UnidocResourceOrigin } from './UnidocResourceOrigin'
import { UnidocRuntimeOrigin } from './UnidocRuntimeOrigin'
import { UnidocTextOrigin } from './UnidocTextOrigin'

/**
* An object that describes the element at the origin of an unidoc value.
*/
export interface UnidocOriginElement {
  /**
  * A number that represent the nature of the described origin.
  */
  readonly type : UnidocOriginElementType

  /**
  * @see Object.toString
  */
  toString () : string

  /**
  * @see Object.equals
  */
  equals (other : any) : boolean
}


export namespace UnidocOriginElement {
  export const buffer = UnidocBufferOrigin.create
  export const network = UnidocNetworkOrigin.create
  export const resource = UnidocResourceOrigin.create
  export const runtime = UnidocRuntimeOrigin.create
  export const text = UnidocTextOrigin.create
}
