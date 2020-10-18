import { PolicyType } from './PolicyType'
import { Policy } from './Policy'

export interface AnythingPolicy extends Policy {

}

export namespace AnythingPolicy {
  export const INSTANCE : AnythingPolicy = {
    type: PolicyType.ANYTHING
  }

  export function create () : AnythingPolicy {
    return INSTANCE
  }
}
