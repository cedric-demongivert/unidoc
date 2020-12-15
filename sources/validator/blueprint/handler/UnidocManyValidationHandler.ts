import { UnidocManyBlueprint } from '../../../blueprint/UnidocManyBlueprint'
import { UnidocBlueprintType } from '../../../blueprint/UnidocBlueprintType'
import { UnidocEvent } from '../../../event/UnidocEvent'

import { UnnecessaryContent } from '../messages/UnnecessaryContent'

import { UnidocState } from '../UnidocState'
import { UnidocBlueprintValidationContext } from '../UnidocBlueprintValidationContext'

import { UnidocBlueprintValidationHandler } from './UnidocBlueprintValidationHandler'

export class UnidocManyValidationHandler implements UnidocBlueprintValidationHandler {
  private readonly _state: UnidocState

  public constructor() {
    this._state = new UnidocState(1)
  }

  /**
  * @see UnidocBlueprintValidationHandler.onStart
  */
  public onStart(context: UnidocBlueprintValidationContext): void {
    if (context.blueprint.type !== UnidocBlueprintType.MANY) {
      throw new Error(
        'Trying to dive into a blueprint of type #' + context.blueprint.type +
        ' (' + UnidocBlueprintType.toString(context.blueprint.type) + ') ' +
        'with a validation handler that is only able to dive into blueprints ' +
        'of type #' + UnidocBlueprintType.MANY + ' (' +
        UnidocBlueprintType.toString(UnidocBlueprintType.MANY) +
        ').'
      )
    } else {
      this.iterate(context, 0)
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
    this.iterate(context, context.state.getUint8(0) + 1)
  }

  /**
  * @see UnidocBlueprintValidationHandler.onSkip
  */
  public onSkip(context: UnidocBlueprintValidationContext): void {
    context.skip()
  }

  public iterate(context: UnidocBlueprintValidationContext, index: number): void {
    const blueprint: UnidocManyBlueprint = context.blueprint as any

    if (blueprint.minimum <= 0) {
      if (blueprint.maximum === Number.POSITIVE_INFINITY) {
        this.iterateLoop(context, index)
      } else {
        this.iterateUntil(context, index)
      }
    } else {
      if (blueprint.maximum === Number.POSITIVE_INFINITY) {
        this.iterateAtLeast(context, index)
      } else {
        this.iterateBetween(context, index)
      }
    }
  }

  /* OPTIMIZATION */
  public iterateLoop(context: UnidocBlueprintValidationContext, index: number): void {
    const state: UnidocState = this._state
    const blueprint: UnidocManyBlueprint = context.blueprint as any

    state.setUint8(0, 0)
    context.dive(state, blueprint.operand)

    if (index > 0) {
      context.success()
    } else {
      context.skip()
    }
  }

  /* OPTIMIZATION */
  public iterateAtLeast(context: UnidocBlueprintValidationContext, index: number): void {
    const state: UnidocState = this._state
    const blueprint: UnidocManyBlueprint = context.blueprint as any

    if (blueprint.minimum <= index) {
      state.setUint8(0, blueprint.minimum)
      context.success()
    } else {
      state.setUint8(0, index)
    }

    context.dive(state, blueprint.operand)
  }

  /* OPTIMIZATION */
  public iterateUntil(context: UnidocBlueprintValidationContext, index: number): void {
    const state: UnidocState = this._state
    const blueprint: UnidocManyBlueprint = context.blueprint as any

    if (blueprint.maximum < index) {
      context.output
        .prepareNewMessage()
        .setMessageType(UnnecessaryContent.TYPE)
        .setMessageCode(UnnecessaryContent.CODE)
        .setMessageData(UnnecessaryContent.Data.BLUEPRINT, blueprint)
        .produce()

      context.failure()
    } else {
      state.setUint8(0, index)
      context.dive(state, blueprint.operand)

      if (index > 0) {
        context.success()
      } else {
        context.skip()
      }
    }
  }

  /* OPTIMIZATION */
  public iterateBetween(context: UnidocBlueprintValidationContext, index: number): void {
    const state: UnidocState = this._state
    const blueprint: UnidocManyBlueprint = context.blueprint as any

    if (blueprint.maximum < index) {
      context.output
        .prepareNewMessage()
        .setMessageType(UnnecessaryContent.TYPE)
        .setMessageCode(UnnecessaryContent.CODE)
        .setMessageData(UnnecessaryContent.Data.BLUEPRINT, blueprint)
        .produce()

      context.failure()
    } else {
      state.setUint8(0, index)

      if (blueprint.minimum <= index) {
        context.success()
      }

      context.dive(state, blueprint.operand)
    }
  }

  /**
  * @see UnidocBlueprintValidationHandler.onEnter
  */
  public onEnter(context: UnidocBlueprintValidationContext): void {

  }
}

export namespace UnidocManyValidationHandler {
  export const INSTANCE: UnidocManyValidationHandler = (
    new UnidocManyValidationHandler()
  )
}
