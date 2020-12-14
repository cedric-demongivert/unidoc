import { UnidocEventBlueprint } from '../../../blueprint/UnidocEventBlueprint'
import { UnidocBlueprintType } from '../../../blueprint/UnidocBlueprintType'
import { UnidocEvent } from '../../../event/UnidocEvent'

import { UnexpectedContent } from '../messages/UnexpectedContent'
import { RequiredContent } from '../messages/RequiredContent'

import { UnidocBlueprintValidationContext } from '../UnidocBlueprintValidationContext'
import { UnidocState } from '../UnidocState'
import { UnidocBlueprintValidationHandler } from './UnidocBlueprintValidationHandler'

const VALIDATION_STATE: UnidocState = UnidocState.uint8(0)

export class UnidocEventValidationHandler implements UnidocBlueprintValidationHandler {
  /**
  * @see UnidocBlueprintValidationHandler.onStart
  */
  public onStart(context: UnidocBlueprintValidationContext): void {
    if (context.blueprint.type !== UnidocBlueprintType.EVENT) {
      throw new Error(
        'Trying to dive into a blueprint of type #' + context.blueprint.type +
        ' (' + UnidocBlueprintType.toString(context.blueprint.type) + ') ' +
        'with a validation handler that is only able to dive into blueprints ' +
        'of type #' + UnidocBlueprintType.EVENT + ' (' +
        UnidocBlueprintType.toString(UnidocBlueprintType.EVENT) + ').'
      )
    } else {
      context.enter(VALIDATION_STATE)
    }
  }

  /**
  * @see UnidocBlueprintValidationHandler.onEvent
  */
  public onEvent(context: UnidocBlueprintValidationContext, event: UnidocEvent): void {
    const blueprint: UnidocEventBlueprint = context.blueprint as any

    if (!blueprint.predicate.test(event)) {
      context.output
        .prepareNewMessage()
        .setMessageType(UnexpectedContent.TYPE)
        .setMessageCode(UnexpectedContent.CODE)
        .setMessageData(UnexpectedContent.Data.BLUEPRINT, blueprint)
        .produce()

      context.failure()
    } else {
      context.success()
    }
  }

  /**
  * @see UnidocBlueprintValidationHandler.onCompletion
  */
  public onCompletion(context: UnidocBlueprintValidationContext): void {
    context.output
      .prepareNewMessage()
      .setMessageType(RequiredContent.TYPE)
      .setMessageCode(RequiredContent.CODE)
      .setMessageData(RequiredContent.Data.BLUEPRINT, context.blueprint)
      .produce()

    context.failure()
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
  * @see UnidocBlueprintValidationHandler.onEnter
  */
  public onEnter(context: UnidocBlueprintValidationContext): void {

  }
}

export namespace UnidocEventValidationHandler {
  export const INSTANCE: UnidocEventValidationHandler = (
    new UnidocEventValidationHandler()
  )
}
