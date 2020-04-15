import { UnidocValidation } from '../validation/UnidocValidation'
import { UnidocEvent } from '../event/UnidocEvent'

import { AnyValidator } from './AnyValidator'
import { CompositeValidator } from './CompositeValidator'
import { CompositionValidator } from './CompositionValidator'
import { TypeValidator } from './TypeValidator'

export interface UnidocValidator {
  /**
  * Handle the next available parsing event.
  *
  * @param event - Event to handle.
  */
  next (event: UnidocEvent) : void

  /**
  * Handle a completion of the stream.
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
  export type ValidationListener = (event : UnidocValidation) => void
  export type CompletionListener = () => void

  export function any () : AnyValidator {
    return new AnyValidator()
  }

  export function all (...validators : UnidocValidator[]) : CompositeValidator {
    return new CompositeValidator(validators)
  }

  export function composition (configuration? : {[key : string] : [number, number] | number}) : CompositionValidator {
    const result : CompositionValidator = new CompositionValidator()

    if (configuration != null) {
      for (const key of Object.keys(configuration)) {
        const range : number | [number, number] = configuration[key]

        if (typeof range === 'number') {
          result.require(range, key)
        } else {
          result.requireAtLeast(range[0], key)
          result.mayHave(range[1], key)
        }
      }
    }

    return result
  }

  export function types (configuration? : { [key : string] : UnidocValidator | boolean, allowWords : boolean, allowWhitespaces : boolean }) : TypeValidator {
    const result : TypeValidator = new TypeValidator()

    if (configuration != null) {
      for (const key of Object.keys(configuration)) {
        if (key === 'allowWords') {
          result.allowWords = configuration.allowWords
        } else if (key === 'allowWhitespaces') {
          result.allowWhitespaces = configuration.allowWhitespaces
        } else {
          const validator : UnidocValidator | boolean = configuration[key]

          if (typeof validator === 'boolean') {
            result.allow(key)
          } else {
            result.allow(key, validator)
          }
        }
      }
    }

    return result
  }
}
