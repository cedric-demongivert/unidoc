import { PolicyType } from './PolicyType'

import { AnythingPolicy } from './AnythingPolicy'
import { TagPolicy } from './TagPolicy'
import { ReferencePolicy } from './ReferencePolicy'
import { SequencePolicy } from './SequencePolicy'
import { DocumentPolicy } from './DocumentPolicy'

/**
* A policy is an immutable description of an expected unidoc structure.
*/
export interface Policy {
  /**
  * Number that describe the nature of the policy.
  */
  readonly type : PolicyType
}

export namespace Policy {
  export const anything = AnythingPolicy.create
  export const tag = TagPolicy.create
  export const reference = ReferencePolicy.create

  export namespace sequence {
    export const strict = SequencePolicy.Strict.create
    export const lenient = SequencePolicy.Lenient.create
  }

  export const document = DocumentPolicy.create
}
