import { UnidocValidation } from '../validation/UnidocValidation'
import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocQuery } from '../query/UnidocQuery'

import { AnythingValidator } from './AnythingValidator'
import { RulesetValidator } from './RulesetValidator'
import { TreeValidator } from './TreeValidator'

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
  export function anything () : AnythingValidator {
    return new AnythingValidator()
  }

  export function tree () : TreeValidator {
    return new TreeValidator()
  }

  export function ruleset () : RulesetValidator {
    return new RulesetValidator()
  }
}
