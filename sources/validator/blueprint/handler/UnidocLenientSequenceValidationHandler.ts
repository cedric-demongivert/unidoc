import { UnidocLenientSequenceBlueprint } from '../../../blueprint/UnidocLenientSequenceBlueprint'
import { UnidocBlueprintType } from '../../../blueprint/UnidocBlueprintType'

import { UnidocEvent } from '../../../event/UnidocEvent'

import { PreferredContent } from '../messages/PreferredContent'

import { UnidocState } from '../UnidocState'
import { UnidocBlueprintValidationContext } from '../UnidocBlueprintValidationContext'

import { UnidocBlueprintValidationHandler } from './UnidocBlueprintValidationHandler'

function activate(state: UnidocState, operand: number): void {
  const index: number = 1 + (operand / 8) << 0
  state.setUint8(index, state.getUint8(index) | (0b1 << (operand % 8)))
}

function isInactive(state: UnidocState, operand: number): boolean {
  const index: number = 1 + (operand / 8) << 0
  return (state.getUint8(index) & (0b1 << (operand % 8))) === 0
}

export class UnidocLenientSequenceValidationHandler implements UnidocBlueprintValidationHandler {
  private readonly _state: UnidocState

  public constructor(capacity: number = 8) {
    this._state = new UnidocState(capacity)
  }

  /**
  * @see UnidocBlueprintValidationHandler.onStart
  */
  public onStart(context: UnidocBlueprintValidationContext): void {
    if (context.blueprint.type !== UnidocBlueprintType.LENIENT_SEQUENCE) {
      throw new Error(
        'Trying to dive into a blueprint of type #' + context.blueprint.type +
        ' (' + UnidocBlueprintType.toString(context.blueprint.type) + ') ' +
        'with a validation handler that is only able to dive into blueprints ' +
        'of type #' + UnidocBlueprintType.LENIENT_SEQUENCE + ' (' +
        UnidocBlueprintType.toString(UnidocBlueprintType.LENIENT_SEQUENCE) +
        ').'
      )
    } else {
      const blueprint: UnidocLenientSequenceBlueprint = context.blueprint as any
      const state: UnidocState = this._state
      state.size = Math.ceil(blueprint.operands.size / 8) + 1
      state.fill(0)

      for (let index = 0; index < blueprint.operands.size; ++index) {
        state.setUint8(0, index)
        context.dive(state, blueprint.operands.get(index))
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
    const blueprint: UnidocLenientSequenceBlueprint = context.blueprint as any
    const state: UnidocState = this._state
    state.copy(context.state)

    const validated: number = state.getUint8(0)

    activate(state, validated)

    let mustWarn: boolean = true
    let succeed: boolean = true

    for (let index = 0; index < blueprint.operands.size; ++index) {
      if (isInactive(state, index)) {
        succeed = false

        if (index < validated && mustWarn) {
          mustWarn = false
          context.output
            .prepareNewMessage()
            .setMessageType(PreferredContent.TYPE)
            .setMessageCode(PreferredContent.CODE)
            .setMessageData(PreferredContent.Data.BLUEPRINT, blueprint.operands.get(index))
            .produce()
        }

        state.setUint8(0, index)
        context.dive(state, blueprint.operands.get(index))
      }
    }

    if (succeed) {
      context.success()
    }
  }

  /**
  * @see UnidocBlueprintValidationHandler.onEnter
  */
  public onEnter(context: UnidocBlueprintValidationContext): void {

  }
}

export namespace UnidocLenientSequenceValidationHandler {
  export const INSTANCE: UnidocLenientSequenceValidationHandler = (
    new UnidocLenientSequenceValidationHandler()
  )
}
