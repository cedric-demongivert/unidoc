import { UnidocValidationEvent } from '../../validation/UnidocValidationEvent'
import { UnidocValidationEventType } from '../../validation/UnidocValidationEventType'

import { UnidocValidationReducer } from './UnidocValidationReducer'
import { UnidocSingleGroupReducerState } from './UnidocSingleGroupReducerState'
import { UnidocSingleGroupReducingStep } from './UnidocSingleGroupReducingStep'

export class UnidocSingleGroupReducer<State, Result> implements UnidocValidationReducer<UnidocSingleGroupReducerState<State, Result>, Result> {
  /**
  *
  */
  private readonly _group: any

  /**
  *
  */
  private readonly _reducer: UnidocValidationReducer<State, Result>

  /**
  *
  */
  public constructor(group: any, reducer: UnidocValidationReducer<State, Result>) {
    this._group = group
    this._reducer = reducer
  }

  /**
  * @see UnidocValidationReducer.initialize
  */
  public initialize(state?: UnidocSingleGroupReducerState<State, Result>): UnidocSingleGroupReducerState<State, Result> {
    return state == null ? new UnidocSingleGroupReducerState() : state.clear()
  }

  /**
  * @see UnidocValidationReducer.reduce
  */
  public reduce(state: UnidocSingleGroupReducerState<State, Result>, event: UnidocValidationEvent): UnidocSingleGroupReducerState<State, Result> {
    switch (state.step) {
      case UnidocSingleGroupReducingStep.LEADING:
        return this.reduceLeading(state, event)
      case UnidocSingleGroupReducingStep.CONTENT:
        return this.reduceContent(state, event)
      case UnidocSingleGroupReducingStep.TRAILING:
        return this.reduceTrailing(state, event)
      default:
        throw new Error(
          'Unable to reduce validation event in state ' +
          UnidocSingleGroupReducingStep.toDebugString(state.step) + ' ' +
          'because no procedure was defined for that.'
        )
    }
  }

  /**
  *
  */
  public reduceLeading(state: UnidocSingleGroupReducerState<State, Result>, event: UnidocValidationEvent): UnidocSingleGroupReducerState<State, Result> {
    if (event.type === UnidocValidationEventType.BEGIN_GROUP) {
      if (event.group === this._group) {
        return state.initialize(this._reducer, event)
      }
    }

    return state
  }

  /**
  *
  */
  public reduceContent(state: UnidocSingleGroupReducerState<State, Result>, event: UnidocValidationEvent): UnidocSingleGroupReducerState<State, Result> {
    switch (event.type) {
      case UnidocValidationEventType.CREATION:
        return state
      case UnidocValidationEventType.TERMINATION:
        return state
      case UnidocValidationEventType.VALIDATION:
      case UnidocValidationEventType.DOCUMENT_COMPLETION:
      case UnidocValidationEventType.MESSAGE:
        return state.next(this._reducer, event)
      case UnidocValidationEventType.BEGIN_GROUP:
        return state.enter(this._reducer, event)
      case UnidocValidationEventType.END_GROUP:
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
  public reduceTrailing(state: UnidocSingleGroupReducerState<State, Result>, event: UnidocValidationEvent): UnidocSingleGroupReducerState<State, Result> {
    return state
  }

  /**
  * @see UnidocValidationReducer.complete
  */
  public complete(state: UnidocSingleGroupReducerState<State, Result>): Result {
    return state.complete(this._reducer)
  }
}
