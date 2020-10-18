import { PolicyType } from './PolicyType'
import { Policy } from './Policy'

export interface NammedPolicy extends Policy {
  name   : string
}

export namespace AnythingPolicy {
  export function create () : AnythingPolicy {
    return INSTANCE
  }
}
