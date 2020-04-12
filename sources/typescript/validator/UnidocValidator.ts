import { UnidocValidation } from '../validation/UnidocValidation'
import { UnidocEvent } from '../event/UnidocEvent'

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
}
