import { UnidocOriginType } from './UnidocOriginType'

import { UnidocBufferOrigin } from './UnidocBufferOrigin'
import { UnidocNetworkOrigin } from './UnidocNetworkOrigin'
import { UnidocRangeOrigin } from './UnidocRangeOrigin'
import { UnidocResourceOrigin } from './UnidocResourceOrigin'
import { UnidocRuntimeOrigin } from './UnidocRuntimeOrigin'
import { UnidocTextOrigin } from './UnidocTextOrigin'

/**
* An object that describes the element at the origin of an unidoc value.
*/
export interface UnidocOrigin {
  /**
  * A number that represent the nature of the described origin.
  */
  readonly type : UnidocOriginType

  /**
  * The origin of the value from this origin. May be null.
  */
  readonly origin : UnidocOrigin | null

  /**
  *
  */
  toElementString () : string

  /**
  * @see Object.toString
  */
  toString () : string

  /**
  * @see Object.equals
  */
  equals (other : any) : boolean
}


export namespace UnidocOrigin {
  export const buffer = UnidocBufferOrigin.create
  export const network = UnidocNetworkOrigin.create
  export const range = UnidocRangeOrigin.create
  export const resource = UnidocResourceOrigin.create
  export const runtime = UnidocRuntimeOrigin.create
  export const text = UnidocTextOrigin.create

  export function toString (origin : UnidocOrigin | null | undefined) : string {
    if (origin) {
      let result : string = origin.toElementString()
      let previous : UnidocOrigin | null = origin.origin

      while (previous) {
        result = previous.toElementString() + ' at ' + result
        previous = previous.origin
      }

      return result
    } else {
      return origin === null ? 'null' : 'undefined'
    }
  }

  export function equals (
    left : UnidocOrigin | null | undefined,
    right : UnidocOrigin | null | undefined
  ) : boolean {
    return left == null ? left === right : left.equals(right)
  }
}
