import { UnidocValidationEvent } from '../../validation/UnidocValidationEvent'

export interface UnidocValidationReducer<State, Result> {
  /**
  *
  */
  initialize(state?: State): State

  /**
  *
  */
  reduce(state: State, event: UnidocValidationEvent): State

  /**
  *
  */
  complete(state: State): Result
}
