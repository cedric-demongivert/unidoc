import { PolicyType } from './PolicyType'
import { Policy } from './Policy'

export class ReferencePolicy implements Policy {
  public readonly type : PolicyType
  public readonly name : string

  public constructor (name : string) {
    this.type = PolicyType.REFERENCE
    this.name = name
  }
}

export namespace ReferencePolicy {
  /**
  * Instantiate a new reference policy.
  *
  * @param name- Name of the policy to reference.
  *
  * @return A reference policy instance.
  */
  export function create (name : string) : ReferencePolicy {
    return new ReferencePolicy(name)
  }
}
