import { UnidocValidationContext } from './UnidocValidationContext'

export interface UnidocValidator {
  /**
  * Called when the stream of event to validate starts.
  *
  * If the validator was already started, a call to start reset this validator
  * inner state.
  *
  * @param context - The overall validation context.
  */
  start (context : UnidocValidationContext) : void

  /**
  * Called when a new event must be validated.
  *
  * @param context - The overall validation context.
  */
  next (context : UnidocValidationContext) : void

  /**
  * Called when the stream of event to validate ends.
  *
  * @param context - The overall validation context.
  */
  complete (context : UnidocValidationContext) : void

  /**
  * Return a deep copy of this validator.
  *
  * @return A deep copy of this validator.
  */
  clone () : UnidocValidator
}

export namespace UnidocValidator {
  /**
  * Return a deep copy of the given value.
  *
  * @param toCopy - A value to copy.
  *
  * @return A deep copy of the given value.
  */
  export function copy (toCopy : UnidocValidator) : UnidocValidator
  /**
  * Return a deep copy of the given value.
  *
  * @param toCopy - A value to copy.
  *
  * @return A deep copy of the given value.
  */
  export function copy (toCopy : undefined) : undefined
  /**
  * Return a deep copy of the given value.
  *
  * @param toCopy - A value to copy.
  *
  * @return A deep copy of the given value.
  */
  export function copy (toCopy : null) : null
  export function copy (toCopy : null | undefined | UnidocValidator) : null | undefined | UnidocValidator {
    return toCopy == null ? toCopy : toCopy.clone()
  }
}
