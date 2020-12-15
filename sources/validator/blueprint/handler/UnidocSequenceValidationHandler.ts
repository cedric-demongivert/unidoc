import { UnidocSequenceBlueprint } from '../../../blueprint/UnidocSequenceBlueprint'
import { UnidocBlueprintType } from '../../../blueprint/UnidocBlueprintType'
import { UnidocEvent } from '../../../event/UnidocEvent'

import { UnidocBlueprintValidationContext } from '../UnidocBlueprintValidationContext'
import { UnidocState } from '../UnidocState'

import { UnidocBlueprintValidationHandler } from './UnidocBlueprintValidationHandler'

export class UnidocSequenceValidationHandler implements UnidocBlueprintValidationHandler {
  private readonly _state: UnidocState

  public constructor() {
    this._state = new UnidocState(2)
  }

  /**
  * @see UnidocBlueprintValidationHandler.onStart
  */
  public onStart(context: UnidocBlueprintValidationContext): void {
    if (context.blueprint.type !== UnidocBlueprintType.SEQUENCE) {
      throw new Error(
        'Trying to dive into a blueprint of type #' + context.blueprint.type +
        ' (' + UnidocBlueprintType.toString(context.blueprint.type) + ') ' +
        'with a validation handler that is only able to dive into blueprints ' +
        'of type #' + UnidocBlueprintType.SEQUENCE + ' (' +
        UnidocBlueprintType.toString(UnidocBlueprintType.SEQUENCE) +
        ').'
      )
    } else {
      this.iterate(context, 0, true)
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
    this.iterate(context, context.state.getUint8(0) + 1, false)
  }

  /**
  * @see UnidocBlueprintValidationHandler.onSkip
  */
  public onSkip(context: UnidocBlueprintValidationContext): void {
    this.iterate(context, context.state.getUint8(0) + 1, context.state.getBoolean(1))
  }

  /**
  * @see UnidocBlueprintValidationHandler.onEnter
  */
  public iterate(context: UnidocBlueprintValidationContext, index: number, skip: boolean): void {
    const state: UnidocState = this._state
    const blueprint: UnidocSequenceBlueprint = context.blueprint as any

    if (index < blueprint.operands.size) {
      state.setUint8(0, index)
      state.setBoolean(1, skip)
      context.dive(state, blueprint.operands.get(index))
    } else if (skip) {
      context.skip()
    } else {
      context.success()
    }
  }

  /**
  * @see UnidocBlueprintValidationHandler.onEnter
  */
  public onEnter(context: UnidocBlueprintValidationContext): void {

  }
}

export namespace UnidocSequenceValidationHandler {
  export const INSTANCE: UnidocSequenceValidationHandler = (
    new UnidocSequenceValidationHandler()
  )
}
