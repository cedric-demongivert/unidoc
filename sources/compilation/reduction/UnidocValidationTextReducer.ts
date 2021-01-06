import { UnidocValidationEvent } from '../../validation/UnidocValidationEvent'
import { UnidocValidationEventType } from './../../validation/UnidocValidationEventType'
import { UnidocEventType } from '../../event/UnidocEventType'

import { UnidocValidationReducer } from './UnidocValidationReducer'
import { UnidocValidationTextReducerState } from './UnidocValidationTextReducerState'

export class UnidocValidationTextReducer implements UnidocValidationReducer<UnidocValidationTextReducerState, string>{
  /**
  *
  */
  public initialize(state?: UnidocValidationTextReducerState): UnidocValidationTextReducerState {
    return state == null ? new UnidocValidationTextReducerState() : state.clear()
  }

  /**
  *
  */
  public reduce(state: UnidocValidationTextReducerState, event: UnidocValidationEvent): UnidocValidationTextReducerState {
    if (event.type === UnidocValidationEventType.VALIDATION) {
      switch (event.event.type) {
        case UnidocEventType.WORD:
          return state.content(event.event.text)
        case UnidocEventType.WHITESPACE:
          return state.whitespace()
        default:
          throw new Error(
            'Trying to reduce ' + event.event.toString() + ' as a ' +
            'text, but a text can only be made of word and whitespaces. '
          )
      }
    }

    return state
  }

  /**
  *
  */
  public complete(state: UnidocValidationTextReducerState): string {
    return state.result
  }
}
