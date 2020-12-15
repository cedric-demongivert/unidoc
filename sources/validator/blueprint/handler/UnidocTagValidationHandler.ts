import { UnidocTagBlueprint } from '../../../blueprint/UnidocTagBlueprint'
import { UnidocBlueprint } from '../../../blueprint/UnidocBlueprint'
import { UnidocBlueprintType } from '../../../blueprint/UnidocBlueprintType'
import { UnidocEvent } from '../../../event/UnidocEvent'
import { UnidocEventType } from '../../../event/UnidocEventType'

import { UnexpectedContent } from '../messages/UnexpectedContent'
import { RequiredContent } from '../messages/RequiredContent'

import { UnidocState } from '../UnidocState'
import { UnidocBlueprintValidationContext } from '../UnidocBlueprintValidationContext'

import { UnidocBlueprintValidationHandler } from './UnidocBlueprintValidationHandler'

const START_STATE: UnidocState = UnidocState.uint8(0)

export class UnidocTagValidationHandler implements UnidocBlueprintValidationHandler {
  private readonly _state: UnidocState

  public constructor() {
    this._state = new UnidocState()
  }

  /**
  * @see UnidocBlueprintValidationHandler.onStart
  */
  public onStart(context: UnidocBlueprintValidationContext): void {
    if (context.blueprint.type !== UnidocBlueprintType.TAG) {
      throw new Error(
        'Trying to dive into a blueprint of type #' + context.blueprint.type +
        ' (' + UnidocBlueprintType.toString(context.blueprint.type) + ') ' +
        'with a validation handler that is only able to dive into blueprints ' +
        'of type #' + UnidocBlueprintType.TAG + ' (' +
        UnidocBlueprintType.toString(UnidocBlueprintType.TAG) +
        ').'
      )
    } else {
      context.enter(START_STATE)
    }
  }

  /**
  * @see UnidocBlueprintValidationHandler.onEvent
  */
  public onEvent(context: UnidocBlueprintValidationContext, event: UnidocEvent): void {
    switch (context.state.getUint8(0)) {
      case 0:
        this.onStartingEvent(context, event)
        break
      case 1:
        throw new Error(
          'Calling onEvent on an handler that is in a state in which it does ' +
          'not validate any event. Do you handle the validation process in a ' +
          'valid way ?'
        )
      default:
        this.onEndingEvent(context, event)
        break
    }
  }

  private onStartingEvent(context: UnidocBlueprintValidationContext, event: UnidocEvent): void {
    const blueprint: UnidocTagBlueprint = context.blueprint as any

    if (blueprint.predicate.test(event)) {
      const state: UnidocState = this._state

      state.clear()
      state.pushUint8(1)
      state.pushString(event.tag)

      context.dive(state, blueprint.operand)
    } else {
      context.output
        .prepareNewMessage()
        .setMessageType(UnexpectedContent.TYPE)
        .setMessageCode(UnexpectedContent.CODE)
        .setMessageData(UnexpectedContent.Data.BLUEPRINT, blueprint)
        .produce()

      context.failure()
    }
  }

  private onEndingEvent(context: UnidocBlueprintValidationContext, event: UnidocEvent): void {
    const value: string = context.state.getString(1)

    if (event.type === UnidocEventType.END_TAG && event.tag === value) {
      context.success()
    } else {
      context.output
        .prepareNewMessage()
        .setMessageType(UnexpectedContent.TYPE)
        .setMessageCode(UnexpectedContent.CODE)
        .setMessageData(
          UnexpectedContent.Data.BLUEPRINT,
          UnidocBlueprint.tagEnd(value)
        )
        .produce()

      context.failure()
    }
  }

  /**
  * @see UnidocBlueprintValidationHandler.onCompletion
  */
  public onCompletion(context: UnidocBlueprintValidationContext): void {
    switch (context.state.getUint8(0)) {
      case 0:
        this.onStartingCompletion(context)
        break
      case 1:
        throw new Error(
          'Calling onCompletion on an handler that is in a state in which ' +
          'it does not validate any event. Do you handle the validation ' +
          'process in a valid way ?'
        )
      default:
        this.onEndingCompletion(context)
        break
    }
  }

  /**
  * @see UnidocBlueprintValidationHandler.onSkip
  */
  public onSkip(context: UnidocBlueprintValidationContext): void {
    this.onSuccess(context)
  }

  private onStartingCompletion(context: UnidocBlueprintValidationContext): void {
    const blueprint: UnidocTagBlueprint = context.blueprint as any

    context.output
      .prepareNewMessage()
      .setMessageType(RequiredContent.TYPE)
      .setMessageCode(RequiredContent.CODE)
      .setMessageData(RequiredContent.Data.BLUEPRINT,
        UnidocBlueprint.event(blueprint.predicate)
      )
      .produce()

    context.failure()
  }

  private onEndingCompletion(context: UnidocBlueprintValidationContext): void {
    const value: string = context.state.getString(1)

    context.output
      .prepareNewMessage()
      .prepareNewMessage()
      .setMessageType(RequiredContent.TYPE)
      .setMessageCode(RequiredContent.CODE)
      .setMessageData(
        RequiredContent.Data.BLUEPRINT,
        UnidocBlueprint.tagEnd(value)
      )
      .produce()

    context.failure()
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
    const state: UnidocState = this._state
    state.copy(context.state)
    state.setUint8(0, 2)

    context.enter(state)
  }

  /**
  * @see UnidocBlueprintValidationHandler.onEnter
  */
  public onEnter(context: UnidocBlueprintValidationContext): void {

  }
}

export namespace UnidocTagValidationHandler {
  export const INSTANCE: UnidocTagValidationHandler = (
    new UnidocTagValidationHandler()
  )
}
