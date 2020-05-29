import { UnidocEvent } from '../event/UnidocEvent'

export type UnidocQueryPredicate = (event : UnidocEvent | symbol) => boolean

export namespace UnidocQueryPredicate {
  export const START : symbol = Symbol()
  export const END : symbol = Symbol()

  export function truthy (event : UnidocEvent | symbol) : boolean {
    return true
  }

  export function falsy (event : UnidocEvent | symbol) : boolean {
    return false
  }
}
