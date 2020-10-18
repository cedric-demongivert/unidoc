import { PolicyType } from './PolicyType'
import { Policy } from './Policy'

import { AnythingPolicy } from './AnythingPolicy'

const DEFAULT_TAG_NAME : string = 'tag'

export interface TagPolicy extends Policy {
  name : string
  content : Policy
}

export namespace TagPolicy {
  export function create () : TagPolicy {
    return {
      type: PolicyType.TAG,
      name: DEFAULT_TAG_NAME,
      content: AnythingPolicy.create()
    }
  }
}
