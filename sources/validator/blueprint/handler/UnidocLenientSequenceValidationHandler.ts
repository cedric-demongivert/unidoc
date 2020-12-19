import { UnidocLenientSequenceBlueprint } from '../../../blueprint/UnidocLenientSequenceBlueprint'
import { UnidocBlueprintType } from '../../../blueprint/UnidocBlueprintType'

import { UnidocEvent } from '../../../event/UnidocEvent'

import { PreferredContent } from '../messages/PreferredContent'

import { UnidocState } from '../UnidocState'
import { UnidocBlueprintValidationContext } from '../UnidocBlueprintValidationContext'

import { UnidocBlueprintValidationHandler } from './UnidocBlueprintValidationHandler'

const CHECKING: number = 0
const BITSET: number = 1

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
      state.clear()
      state.pushUint8(0)
      state.pushBitset(blueprint.operands.size + 2)

      for (let index = 0; index < blueprint.operands.size; ++index) {
        state.setUint8(CHECKING, index)
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
    const blueprint: UnidocLenientSequenceBlueprint = context.blueprint as any
    const state: UnidocState = this._state
    state.copy(context.state)

    if (state.getBit(BITSET, blueprint.operands.size + 1)) {
      context.kill()
    } else {
      context.failure()
    }
  }

  /**
  * @see UnidocBlueprintValidationHandler.onSuccess
  */
  public onSuccess(context: UnidocBlueprintValidationContext): void {
    this.dispatchAfterSuccess(context)
  }

  public dispatchAfterSuccess(context: UnidocBlueprintValidationContext): void {
    const blueprint: UnidocLenientSequenceBlueprint = context.blueprint as any
    const state: UnidocState = this._state
    state.copy(context.state)

    if (state.getBit(BITSET, blueprint.operands.size + 1)) {
      this.dispatchToNextElementUntilFailure(context)
    } else {
      this.dispatchToEveryPossibleElement(context)
    }
  }

  private dispatchToNextElementUntilFailure(context: UnidocBlueprintValidationContext): void {
    const blueprint: UnidocLenientSequenceBlueprint = context.blueprint as any
    const state: UnidocState = this._state

    const validated: number = state.getUint8(CHECKING)

    state.enable(BITSET, validated)

    let index: number = validated + 1

    while (index < blueprint.operands.size && state.getBit(BITSET, index)) {
      index += 1
    }

    if (index < blueprint.operands.size) {
      state.setUint8(CHECKING, index)
      context.dive(state, blueprint.operands.get(index))
    } else {
      context.success()
    }
  }

  private dispatchToEveryPossibleElement(context: UnidocBlueprintValidationContext): void {
    const blueprint: UnidocLenientSequenceBlueprint = context.blueprint as any
    const state: UnidocState = this._state

    const validated: number = state.getUint8(CHECKING)

    state.enable(BITSET, validated)
    state.enable(BITSET, blueprint.operands.size)

    let mustWarn: boolean = true
    let succeed: boolean = true

    for (let index = 0; index < blueprint.operands.size; ++index) {
      if (!state.getBit(BITSET, index)) {
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

        state.setUint8(CHECKING, index)
        context.dive(state, blueprint.operands.get(index))
      }
    }

    if (succeed) {
      context.success()
    }
  }

  /**
  * @see UnidocBlueprintValidationHandler.onSkip
  */
  public onSkip(context: UnidocBlueprintValidationContext): void {
    this.dispatchAfterSkip(context)
  }

  // optimization
  public dispatchAfterSkip(context: UnidocBlueprintValidationContext): void {
    const state: UnidocState = this._state
    state.copy(context.state)

    const skipped: number = state.getUint8(CHECKING)
    let index: number = 0

    while (index < skipped && state.getBit(BITSET, index)) {
      index += 1
    }

    if (index === skipped) {
      this.dispatchNext(context, skipped)
    } else {
      context.kill()
    }
  }

  // optimization
  public dispatchNext(context: UnidocBlueprintValidationContext, skipped: number): void {
    const blueprint: UnidocLenientSequenceBlueprint = context.blueprint as any
    const state: UnidocState = this._state

    state.enable(BITSET, skipped)
    state.enable(BITSET, blueprint.operands.size + 1) // flag for killing on any further success

    let index: number = skipped + 1

    while (index < blueprint.operands.size && state.getBit(BITSET, index)) {
      index += 1
    }

    if (index < blueprint.operands.size) {
      state.setUint8(CHECKING, index)
      context.dive(state, blueprint.operands.get(index))
    } else if (state.getBit(BITSET, blueprint.operands.size)) {
      context.success()
    } else {
      context.skip()
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
