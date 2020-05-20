import { UnidocValidation } from '../validation/UnidocValidation'
import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocQuery } from '../query/UnidocQuery'

import { AnythingValidator } from './AnythingValidator'
import { ConditionalValidator } from './ConditionalValidator'
import { TagValidator } from './TagValidator'

/**
* An object that validate a stream of unidoc event.
*/
export interface UnidocValidator extends UnidocQuery<UnidocEvent, UnidocValidation> {
  /**
  * Return a clone of this validator.
  */
  clone () : UnidocValidator
}

export namespace UnidocValidator {
  /**
  * Function called when a validator emit a validation.
  */
  export type ValidationListener = (event : UnidocValidation) => void

  /**
  * Function called when a validator end is work.
  */
  export type CompletionListener = () => void

  export function clone (validator : UnidocValidator) : UnidocValidator {
    return validator == null ? null : validator.clone()
  }

  /**
  * Return a validator that validate anything.
  */
  export function any () : AnythingValidator {
    return new AnythingValidator()
  }

  export function all (...validators : UnidocValidator[]) : CompositeValidator {
    return new CompositeValidator(validators)
  }

  export function conditional () : ConditionalValidator {
    return new ConditionalValidator()
  }

  export function assertion () : AssertionValidator {
    return new AssertionValidator()
  }

  export function tag () : TagValidator {
    return new TagValidator()
  }
}
