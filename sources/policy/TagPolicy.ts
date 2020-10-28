import { PolicyType } from './PolicyType'
import { Policy } from './Policy'

export class TagPolicy implements Policy {
  public readonly type : PolicyType
  public readonly name : string
  public readonly content : Policy

  public constructor (name : string, content : Policy) {
    this.type = PolicyType.TAG
    this.name = name
    this.content = content
  }
}

export namespace TagPolicy {
  export function create (name : string, content : Policy) : TagPolicy {
    return new TagPolicy(name, content)
  }
}
