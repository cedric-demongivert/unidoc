import { Policy } from '../../policy/Policy'
import { TagPolicy } from '../../policy/TagPolicy'
import { PolicyType } from '../../policy/PolicyType'

import { UnidocValidationContext } from '../UnidocValidationContext'

import { TagPolicyValidator } from './TagPolicyValidator'
import { AnythingPolicyValidator } from './AnythingPolicyValidator'

export interface PolicyValidator {
  /**
  * Start a stream of event to validate.
  *
  * @param context - A validation context.
  *
  * @return True if this validator match the stream of event in it's current state.
  */
  start (context : UnidocValidationContext) : void

  /**
  * Validate the next available event of a stream of event to validate.
  *
  * @param context - A validation context.
  *
  * @return True if this validator match the stream of event in it's current state.
  */
  validate (context : UnidocValidationContext) : void

  /**
  * Mark a stream of event to validate as completed.
  *
  * @param context - A validation context.
  *
  * @return True if this validator match the stream of event in it's current state.
  */
  complete (context : UnidocValidationContext) : void
}

export namespace PolicyValidator {
  export function fromPolicy (policy : Policy) : PolicyValidator {
    switch (policy.type) {
      case PolicyType.TAG: return new TagPolicyValidator(policy as TagPolicy)
      case PolicyType.ANYTHING: return AnythingPolicyValidator.INSTANCE
      default:
        throw new Error(
          'Unable to instantiate a new validator for a policy of type #' +
          policy.type + ' (' + PolicyType.toString(policy.type) + ') because ' +
          'no procedure was defined for instantiating a policy of the given ' +
          'type.'
        )
    }
  }
}
