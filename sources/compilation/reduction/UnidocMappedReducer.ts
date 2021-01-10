import { UnidocBlueprint } from '../../blueprint/UnidocBlueprint'
import { UnidocValidationEvent } from '../../validation/UnidocValidationEvent'
import { UnidocValidationEventType } from '../../validation/UnidocValidationEventType'

import { UnidocValidationReducer } from './UnidocValidationReducer'
import { UnidocManyBlueprintReducerState } from './UnidocManyBlueprintReducerState'

export class UnidocManyBlueprintReducer<State, Result> implements UnidocValidationReducer<UnidocManyBlueprintReducerState<State, Result>, Result[]> {
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
  public initialize(state?: UnidocManyBlueprintReducerState<State, Result>): UnidocManyBlueprintReducerState<State, Result> {
    return state == null ? new UnidocManyBlueprintReducerState() : state.clear()
  }

  /**
  * @see UnidocValidationReducer.reduce
  */
  public reduce(state: UnidocManyBlueprintReducerState<State, Result>, event: UnidocValidationEvent): UnidocManyBlueprintReducerState<State, Result> {
    if (state.depth === 0) {
      return this.reduceLeading(state, event)
    } else {
      return this.reduceContent(state, event)
    }
  }

  /**
  *
  */
  public reduceLeading(state: UnidocManyBlueprintReducerState<State, Result>, event: UnidocValidationEvent): UnidocManyBlueprintReducerState<State, Result> {
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
  public reduceContent(state: UnidocManyBlueprintReducerState<State, Result>, event: UnidocValidationEvent): UnidocManyBlueprintReducerState<State, Result> {
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
  * @see UnidocValidationReducer.complete
  */
  public complete(state: UnidocManyBlueprintReducerState<State, Result>): Result[] {
    return state.complete(this._reducer)
  }
}
