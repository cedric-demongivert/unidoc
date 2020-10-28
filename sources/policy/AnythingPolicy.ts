import { PolicyType } from './PolicyType'
import { Policy } from './Policy'

export class AnythingPolicy implements Policy {
  public readonly type : number

  public constructor () {
    this.type = PolicyType.ANYTHING
  }
}

export namespace AnythingPolicy {
  export const INSTANCE : AnythingPolicy = new AnythingPolicy()

  export function create () : AnythingPolicy {
    return INSTANCE
  }
}
