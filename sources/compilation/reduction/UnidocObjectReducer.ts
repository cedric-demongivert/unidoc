import { UnidocBlueprint } from '../../blueprint/UnidocBlueprint'
import { UnidocValidationEvent } from '../../validation/UnidocValidationEvent'
import { UnidocValidationEventType } from '../../validation/UnidocValidationEventType'

import { UnidocValidationReducer } from './UnidocValidationReducer'
import { UnidocObjectReducerState } from './UnidocObjectReducerState'
import { UnidocObjectReducerConfiguration } from './UnidocObjectReducerConfiguration'

export class UnidocObjectReducer<Result> implements UnidocValidationReducer<UnidocObjectReducerState, Result> {
  /**
  *
  */
  private readonly _configuration: UnidocObjectReducerConfiguration

  /**
  *
  */
  public constructor(configuration: UnidocObjectReducerConfiguration) {
    this._configuration = configuration
  }

  /**
  * @see UnidocValidationReducer.initialize
  */
  public initialize(state?: UnidocObjectReducerState): UnidocObjectReducerState {
    if (state != null && state.configuration === this._configuration) {
      return state.initialize()
    } else {
      return (new UnidocObjectReducerState(this._configuration)).initialize()
    }
  }

  /**
  * @see UnidocValidationReducer.reduce
  */
  public reduce(state: UnidocObjectReducerState, event: UnidocValidationEvent): UnidocObjectReducerState {
    return state.reduce(event)
  }

  /**
  * @see UnidocValidationReducer.complete
  */
  public complete(state: UnidocObjectReducerState): Result {
    return state.complete()
  }
}
