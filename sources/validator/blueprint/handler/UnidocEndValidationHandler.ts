import { UnidocBlueprint } from '../../../blueprint/UnidocBlueprint'
import { UnidocBlueprintType } from '../../../blueprint/UnidocBlueprintType'
import { UnidocEvent } from '../../../event/UnidocEvent'

import { UnnecessaryContent } from '../messages/UnnecessaryContent'

import { UnidocBlueprintValidationContext } from '../UnidocBlueprintValidationContext'
import { UnidocState } from '../UnidocState'

import { UnidocBlueprintValidationHandler } from './UnidocBlueprintValidationHandler'

const VALIDATION_STATE: UnidocState = UnidocState.uint8(0)

export class UnidocEndValidationHandler implements UnidocBlueprintValidationHandler {
  /**
  * @see UnidocBlueprintValidationHandler.onStart
  */
  public onStart(context: UnidocBlueprintValidationContext): void {
    if (context.blueprint.type !== UnidocBlueprintType.END) {
      throw new Error(
        'Trying to dive into a blueprint of type #' + context.blueprint.type +
        ' (' + UnidocBlueprintType.toString(context.blueprint.type) + ') ' +
        'with a validation handler that is only able to dive into blueprints ' +
        'of type #' + UnidocBlueprintType.END + ' (' +
        UnidocBlueprintType.toString(UnidocBlueprintType.END) + ').'
      )
    } else {
      context.enter(VALIDATION_STATE)
    }
  }

  /**
  * @see UnidocBlueprintValidationHandler.onEvent
  */
  public onEvent(context: UnidocBlueprintValidationContext, event: UnidocEvent): void {
    context.output
      .prepareNewMessage()
      .setMessageType(UnnecessaryContent.TYPE)
      .setMessageCode(UnnecessaryContent.CODE)
      .setMessageData(UnnecessaryContent.Data.BLUEPRINT, UnidocBlueprint.end())
      .produce()

    context.failure()
  }

  /**
  * @see UnidocBlueprintValidationHandler.onCompletion
  */
  public onCompletion(context: UnidocBlueprintValidationContext): void {
    context.success()
  }

  /**
  * @see UnidocBlueprintValidationHandler.onFailure
  */
  public onFailure(context: UnidocBlueprintValidationContext): void {
    throw new Error(
      'Notifying failure on an handler that does not dive. Do you handle ' +
      'the validation process in a valid way ?'
    )
  }

  /**
  * @see UnidocBlueprintValidationHandler.onSuccess
  */
  public onSuccess(context: UnidocBlueprintValidationContext): void {
    throw new Error(
      'Notifying success on an handler that does not dive. Do you handle ' +
      'the validation process in a valid way ?'
    )
  }

  /**
  * @see UnidocBlueprintValidationHandler.onSkip
  */
  public onSkip(context: UnidocBlueprintValidationContext): void {
    throw new Error(
      'Notifying skip on an handler that does not dive. Do you handle ' +
      'the validation process in a valid way ?'
    )
  }

  /**
  * @see UnidocBlueprintValidationHandler.onEnter
  */
  public onEnter(context: UnidocBlueprintValidationContext): void {

  }
}

export namespace UnidocEndValidationHandler {
  export const INSTANCE: UnidocEndValidationHandler = (
    new UnidocEndValidationHandler()
  )
}
