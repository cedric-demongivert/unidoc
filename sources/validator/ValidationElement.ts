import { UnidocValidation } from '../validation/UnidocValidation'

import { ValidationState } from './ValidationState'

export interface ValidationElement {
  /**
  * The validation state of this element.
  */
  readonly state : ValidationState

  /**
  * A validation instance used for emitting new validation messages.
  */
  readonly validation : UnidocValidation

  /**
  * Emit the given validation message and update this element state accordingly.
  *
  * @param validation - A validation message to emit.
  */
  emit (validation : UnidocValidation) : void

  /**
  * Notify this validation element completion.
  */
  complete () : void

  /**
  * Reset this element to it's initial state.
  */
  reset () : void
}
