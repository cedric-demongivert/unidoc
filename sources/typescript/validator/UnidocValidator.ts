import { UnidocValidation } from '../validation/UnidocValidation'
import { UnidocEvent } from '../event/UnidocEvent'

import { AnythingValidator } from './AnythingValidator'
import { CompositeValidator } from './CompositeValidator'
import { ConditionalValidator } from './ConditionalValidator'
import { AssertionValidator } from './AssertionValidator'
import { TagValidator } from './TagValidator'

export interface UnidocValidator {
  /**
  * Handle the next available event.
  *
  * @param event - The next event to handle.
  */
  next (event: UnidocEvent) : void

  /**
  * Handle a completion of the event stream.
  */
  complete () : void

  /**
  * Add a listener to this validator.
  *
  * @param type - Event type to listen.
  * @param listener - Listener to add.
  */
  addEventListener (type : 'validation', listener : UnidocValidator.ValidationListener) : void
  addEventListener (type : 'completion', listener : UnidocValidator.CompletionListener) : void

  /**
  * Remove a listener from this validator.
  *
  * @param type - Event type to stop to listen.
  * @param listener - Listener to remove.
  */
  removeEventListener (type : 'validation', listener : UnidocValidator.ValidationListener) : void
  removeEventListener (type : 'completion', listener : UnidocValidator.CompletionListener) : void

  /**
  * Remove all listeners of a given type from this validator.
  *
  * @param type - Event type to clear.
  */
  removeAllEventListeners (type : 'validation') : void
  removeAllEventListeners (type : 'completion') : void
  removeAllEventListeners (type : '*') : void

  /**
  * Reset this validator to its initial state.
  */
  reset () : void

  /**
  * Clear this validator.
  */
  clear () : void

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
