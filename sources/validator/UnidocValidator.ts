import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocValidation } from '../validation/UnidocValidation'

export interface UnidocValidator {
  start () : void

  validate (event : UnidocEvent) : void

  complete () : void

  addEventListener (event : 'validation', listener : UnidocValidator.ValidationListener) : void
  addEventListener (event : 'completion', listener : UnidocValidator.CompletionListener) : void
  addEventListener (event : string, listener : UnidocValidator.ValidationListener | UnidocValidator.CompletionListener) : void

  deleteEventListener (event : 'validation', listener : UnidocValidator.ValidationListener) : void
  deleteEventListener (event : 'completion', listener : UnidocValidator.CompletionListener) : void
  deleteEventListener (event : string, listener : UnidocValidator.ValidationListener | UnidocValidator.CompletionListener) : void

  clearEventListeners (event : '*') : void
  clearEventListeners (event : 'validation') : void
  clearEventListeners (event : 'completion') : void
  clearEventListeners (event : string) : void
}

export namespace UnidocValidator {
  export type ValidationListener = (validation : UnidocValidation) => void
  export type CompletionListener = () => void
}
