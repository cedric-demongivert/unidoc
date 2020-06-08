import { UnidocValidationContext } from './UnidocValidationContext'

/**
* A validation policy followed by a ShallowValidationProcess.
*
* @see ShallowValidationProcess
*/
export interface ShallowValidationPolicy {
  /**
  * Called when the tag to validate start.
  *
  * @param context - The context of the validation.
  */
  start (context : UnidocValidationContext) : void

  /**
  * Called for each event related to an immeditate children of the tag to validate.
  *
  * @param context - The context of the validation.
  */
  shallow (context : UnidocValidationContext) : void

  /**
  * Called when the tag to validate ends.
  *
  * @param context - The context of the validation.
  */
  end (context : UnidocValidationContext) : void
}
