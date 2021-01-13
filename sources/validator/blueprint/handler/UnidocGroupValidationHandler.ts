import { UnidocGroupBlueprint } from '../../../blueprint/UnidocGroupBlueprint'
import { UnidocBlueprintType } from '../../../blueprint/UnidocBlueprintType'
import { UnidocEvent } from '../../../event/UnidocEvent'

import { UnidocState } from '../UnidocState'
import { UnidocBlueprintValidationContext } from '../UnidocBlueprintValidationContext'

import { UnidocBlueprintValidationHandler } from './UnidocBlueprintValidationHandler'

export class UnidocGroupValidationHandler implements UnidocBlueprintValidationHandler {
  private readonly _state: UnidocState

  public constructor() {
    this._state = new UnidocState(1)
  }

  /**
  * @see UnidocBlueprintValidationHandler.onStart
  */
  public onStart(context: UnidocBlueprintValidationContext): void {
    if (context.blueprint.type !== UnidocBlueprintType.GROUP) {
      throw new Error(
        'Trying to dive into a blueprint of type ' +
        UnidocBlueprintType.toDebugString(context.blueprint.type) +
        ' with a validation handler that is only able to dive into ' +
        'blueprints of type ' +
        UnidocBlueprintType.toDebugString(UnidocBlueprintType.GROUP) + '.'
      )
    } else {
      const state: UnidocState = this._state
      const blueprint: UnidocGroupBlueprint = context.blueprint as any

      context.output.beginGroup(blueprint.group)

      state.setUint8(0, 0)
      context.dive(state, blueprint.operand)
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
    const blueprint: UnidocGroupBlueprint = context.blueprint as any
    context.output.endGroup(blueprint.group)
    context.success()
  }

  /**
  * @see UnidocBlueprintValidationHandler.onSkip
  */
  public onSkip(context: UnidocBlueprintValidationContext): void {
    context.skip()
  }

  /**
  * @see UnidocBlueprintValidationHandler.onEnter
  */
  public onEnter(context: UnidocBlueprintValidationContext): void {

  }
}

export namespace UnidocGroupValidationHandler {
  /**
  *
  */
  export const INSTANCE: UnidocGroupValidationHandler = (
    new UnidocGroupValidationHandler()
  )
}
