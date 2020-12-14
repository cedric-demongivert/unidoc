import { UnidocEvent } from '../../../event/UnidocEvent'

import { UnidocBlueprintValidationContext } from '../UnidocBlueprintValidationContext'

/**
* An unidoc blueprint validation handler is an object that implement the
* validation logic of a blueprint as an automata.
*/
export interface UnidocBlueprintValidationHandler {
  /**
  * Called when a validation process enter into a blueprint.
  *
  * @param context - The validation context.
  */
  onStart(context: UnidocBlueprintValidationContext): void

  /**
  * Called when a validation process enter into a given state.
  *
  * @param context - The validation context.
  */
  onEnter(context: UnidocBlueprintValidationContext): void

  /**
  * Called when a validation process validate an event.
  *
  * @param context - The validation context.
  */
  onEvent(context: UnidocBlueprintValidationContext, event: UnidocEvent): void

  /**
  * Called when a validation process validate the termination of an event stream.
  *
  * @param context - The validation context.
  */
  onCompletion(context: UnidocBlueprintValidationContext): void

  /**
  * Called when a dive attempt fail.
  *
  * @param context - The validation context.
  */
  onFailure(context: UnidocBlueprintValidationContext): void

  /**
  * Called when a dive attempt succeed.
  *
  * @param context - The validation context.
  */
  onSuccess(context: UnidocBlueprintValidationContext): void
}
