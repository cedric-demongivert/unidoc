import { UnidocDisjunctionBlueprint } from '../../../blueprint/UnidocDisjunctionBlueprint'
import { UnidocBlueprint } from '../../../blueprint/UnidocBlueprint'
import { UnidocBlueprintType } from '../../../blueprint/UnidocBlueprintType'
import { UnidocEvent } from '../../../event/UnidocEvent'

import { UnidocBlueprintValidationContext } from '../UnidocBlueprintValidationContext'
import { UnidocState } from '../UnidocState'

import { UnidocBlueprintValidationHandler } from './UnidocBlueprintValidationHandler'

export class UnidocDisjunctionValidationHandler implements UnidocBlueprintValidationHandler {
  private readonly _state: UnidocState

  public constructor() {
    this._state = new UnidocState()
  }

  /**
  * @see UnidocBlueprintValidationHandler.onStart
  */
  public onStart(context: UnidocBlueprintValidationContext): void {
    if (context.blueprint.type !== UnidocBlueprintType.DISJUNCTION) {
      throw new Error(
        'Trying to dive into a blueprint of type #' + context.blueprint.type +
        ' (' + UnidocBlueprintType.toString(context.blueprint.type) + ') ' +
        'with a validation handler that is only able to dive into blueprints ' +
        'of type #' + UnidocBlueprintType.DISJUNCTION + ' (' +
        UnidocBlueprintType.toString(UnidocBlueprintType.DISJUNCTION) + ').'
      )
    } else {
      const disjunction: UnidocDisjunctionBlueprint = context.blueprint as any
      const state: UnidocState = this._state

      for (let index = 0; index < disjunction.operands.size; ++index) {
        state.clear()
        state.pushUint8(index)

        context.dive(state, disjunction.operands.get(index))
      }
    }
  }

  /**
  * @see UnidocBlueprintValidationHandler.onEvent
  */
  public onEvent(context: UnidocBlueprintValidationContext, event: UnidocEvent): void {
    throw new Error(
      'Calling onEvent on an handler that does not validate any event. Do ' +
      'you handle the validation process in a valid way ?'
    )
  }

  /**
  * @see UnidocBlueprintValidationHandler.onCompletion
  */
  public onCompletion(context: UnidocBlueprintValidationContext): void {
    throw new Error(
      'Calling onCompletion on an handler that does not validate any event. ' +
      'Do you handle the validation process in a valid way ?'
    )
  }

  /**
  * @see UnidocBlueprintValidationHandler.onFailure
  */
  public onFailure(context: UnidocBlueprintValidationContext): void {
    context.failure()
  }

  /**
  * @see UnidocBlueprintValidationHandler.onSuccess
  */
  public onSuccess(context: UnidocBlueprintValidationContext): void {
    context.success()
  }

  /**
  * @see UnidocBlueprintValidationHandler.onEnter
  */
  public onEnter(context: UnidocBlueprintValidationContext): void {

  }
}

export namespace UnidocDisjunctionValidationHandler {
  export const INSTANCE: UnidocDisjunctionValidationHandler = (
    new UnidocDisjunctionValidationHandler()
  )
}
