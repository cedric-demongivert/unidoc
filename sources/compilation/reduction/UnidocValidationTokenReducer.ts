import { UnidocValidationEvent } from '../../validation/UnidocValidationEvent'
import { UnidocValidationEventType } from './../../validation/UnidocValidationEventType'
import { UnidocEventType } from '../../event/UnidocEventType'

import { UnidocValidationReducer } from './UnidocValidationReducer'
import { UnidocValidationTokenReducerState } from './UnidocValidationTokenReducerState'

export class UnidocValidationTokenReducer implements UnidocValidationReducer<UnidocValidationTokenReducerState, string>{
  /**
  *
  */
  public initialize(state?: UnidocValidationTokenReducerState): UnidocValidationTokenReducerState {
    return state == null ? new UnidocValidationTokenReducerState() : state.clear()
  }

  /**
  *
  */
  public reduce(state: UnidocValidationTokenReducerState, event: UnidocValidationEvent): UnidocValidationTokenReducerState {
    if (event.type === UnidocValidationEventType.VALIDATION) {
      switch (event.event.type) {
        case UnidocEventType.WORD:
          return state.content(event.event.text)
        case UnidocEventType.WHITESPACE:
          return state.whitespace()
        default:
          throw new Error(
            'Trying to reduce ' + event.event.toString() + ' as a ' +
            'token, but a token can only be made of word and whitespaces. '
          )
      }
    }

    return state
  }

  /**
  *
  */
  public complete(state: UnidocValidationTokenReducerState): string {
    return state.result
  }
}
