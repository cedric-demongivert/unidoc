import { UnidocBlueprint } from '../../blueprint/UnidocBlueprint'
import { UnidocValidationEvent } from '../../validation/UnidocValidationEvent'
import { UnidocValidationEventType } from '../../validation/UnidocValidationEventType'

import { UnidocValidationReducer } from './UnidocValidationReducer'
import { UnidocSingleBlueprintReducerState } from './UnidocSingleBlueprintReducerState'
import { UnidocSingleBlueprintReducingStep } from './UnidocSingleBlueprintReducingStep'

export class UnidocSingleBlueprintReducer<State, Result> implements UnidocValidationReducer<UnidocSingleBlueprintReducerState<State, Result>, Result> {
  /**
  *
  */
  private readonly _blueprint: UnidocBlueprint

  /**
  *
  */
  private readonly _reducer: UnidocValidationReducer<State, Result>

  /**
  *
  */
  public constructor(blueprint: UnidocBlueprint, reducer: UnidocValidationReducer<State, Result>) {
    this._blueprint = blueprint
    this._reducer = reducer
  }

  /**
  * @see UnidocValidationReducer.initialize
  */
  public initialize(state?: UnidocSingleBlueprintReducerState<State, Result>): UnidocSingleBlueprintReducerState<State, Result> {
    return state == null ? new UnidocSingleBlueprintReducerState() : state.clear()
  }

  /**
  * @see UnidocValidationReducer.reduce
  */
  public reduce(state: UnidocSingleBlueprintReducerState<State, Result>, event: UnidocValidationEvent): UnidocSingleBlueprintReducerState<State, Result> {
    switch (state.step) {
      case UnidocSingleBlueprintReducingStep.LEADING:
        return this.reduceLeading(state, event)
      case UnidocSingleBlueprintReducingStep.CONTENT:
        return this.reduceContent(state, event)
      case UnidocSingleBlueprintReducingStep.TRAILING:
        return this.reduceTrailing(state, event)
      default:
        throw new Error(
          'Unable to reduce validation event in state ' +
          UnidocSingleBlueprintReducingStep.toDebugString(state.step) + ' ' +
          'because no procedure was defined for that.'
        )
    }
  }

  /**
  *
  */
  public reduceLeading(state: UnidocSingleBlueprintReducerState<State, Result>, event: UnidocValidationEvent): UnidocSingleBlueprintReducerState<State, Result> {
    if (event.type === UnidocValidationEventType.ENTER_BLUEPRINT) {
      if (event.blueprint === this._blueprint) {
        return state.initialize(this._reducer, event)
      }
    }

    return state
  }

  /**
  *
  */
  public reduceContent(state: UnidocSingleBlueprintReducerState<State, Result>, event: UnidocValidationEvent): UnidocSingleBlueprintReducerState<State, Result> {
    switch (event.type) {
      case UnidocValidationEventType.CREATION:
        return state
      case UnidocValidationEventType.TERMINATION:
        return state
      case UnidocValidationEventType.VALIDATION:
      case UnidocValidationEventType.DOCUMENT_COMPLETION:
      case UnidocValidationEventType.MESSAGE:
        return state.next(this._reducer, event)
      case UnidocValidationEventType.ENTER_BLUEPRINT:
        return state.enter(this._reducer, event)
      case UnidocValidationEventType.EXIT_BLUEPRINT:
        return state.exit(this._reducer, event)
      case UnidocValidationEventType.FORK:
      case UnidocValidationEventType.FORKED:
      case UnidocValidationEventType.MERGE:
        throw new Error(
          'Unable to reduce fork and merge events as this reducer does not ' +
          'allow to reduce validation trees.'
        )
      default:
        throw new Error(
          'Unable to reduce validation event of type ' +
          UnidocValidationEventType.toDebugString(event.type) + ' ' +
          'because no procedure was defined for that.'
        )
    }
  }

  /**
  *
  */
  public reduceTrailing(state: UnidocSingleBlueprintReducerState<State, Result>, event: UnidocValidationEvent): UnidocSingleBlueprintReducerState<State, Result> {
    return state
  }

  /**
  * @see UnidocValidationReducer.complete
  */
  public complete(state: UnidocSingleBlueprintReducerState<State, Result>): Result {
    return state.complete(this._reducer)
  }
}
