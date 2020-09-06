import { UnidocValidation } from '../validation/UnidocValidation'
import { UnidocEvent } from '../event/UnidocEvent'

export interface UnidocValidationContext {
  /**
  * The current event to validate if any.
  */
  readonly event : UnidocEvent

  /**
  * A validation instance to use for publishing.
  */
  readonly validation : UnidocValidation

  /**
  * Publish the validation instance associated with this context.
  */
  publish () : void
}
