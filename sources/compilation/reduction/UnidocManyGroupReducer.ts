import { UnidocValidationEvent } from '../../validation/UnidocValidationEvent'
import { UnidocValidationEventType } from '../../validation/UnidocValidationEventType'

import { UnidocValidationReducer } from './UnidocValidationReducer'
import { UnidocManyGroupReducerState } from './UnidocManyGroupReducerState'

export class UnidocManyGroupReducer<State, Result> implements UnidocValidationReducer<UnidocManyGroupReducerState<State, Result>, Result[]> {
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
  public initialize(state?: UnidocManyGroupReducerState<State, Result>): UnidocManyGroupReducerState<State, Result> {
    return state == null ? new UnidocManyGroupReducerState() : state.clear()
  }

  /**
  * @see UnidocValidationReducer.reduce
  */
  public reduce(state: UnidocManyGroupReducerState<State, Result>, event: UnidocValidationEvent): UnidocManyGroupReducerState<State, Result> {
    if (state.depth === 0) {
      return this.reduceLeading(state, event)
    } else {
      return this.reduceContent(state, event)
    }
  }

  /**
  *
  */
  public reduceLeading(state: UnidocManyGroupReducerState<State, Result>, event: UnidocValidationEvent): UnidocManyGroupReducerState<State, Result> {
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
  public reduceContent(state: UnidocManyGroupReducerState<State, Result>, event: UnidocValidationEvent): UnidocManyGroupReducerState<State, Result> {
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
  * @see UnidocValidationReducer.complete
  */
  public complete(state: UnidocManyGroupReducerState<State, Result>): Result[] {
    return state.complete(this._reducer)
  }
}
