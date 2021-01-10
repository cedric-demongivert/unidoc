import { UnidocValidationEvent } from '../../validation/UnidocValidationEvent'

import { UnidocValidationReducer } from './UnidocValidationReducer'

export class UnidocMappedReducer<State, From, To> implements UnidocValidationReducer<State, To> {
  /**
  *
  */
  private readonly _mapper: (value: From) => To

  /**
  *
  */
  private readonly _reducer: UnidocValidationReducer<State, From>

  /**
  *
  */
  public constructor(reducer: UnidocValidationReducer<State, From>, mapper: (value: From) => To) {
    this._mapper = mapper
    this._reducer = reducer
  }

  /**
  * @see UnidocValidationReducer.initialize
  */
  public initialize(state?: State): State {
    return this._reducer.initialize(state)
  }

  /**
  * @see UnidocValidationReducer.reduce
  */
  public reduce(state: State, event: UnidocValidationEvent): State {
    return this._reducer.reduce(state, event)
  }

  /**
  * @see UnidocValidationReducer.complete
  */
  public complete(state: State): To {
    return this._mapper(this._reducer.complete(state))
  }
}
