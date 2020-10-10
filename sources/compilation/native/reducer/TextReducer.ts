import { UnidocEvent } from '../../../event/UnidocEvent'
import { UnidocEventType } from '../../../event/UnidocEventType'

import { BaseEventStreamReducer } from './BaseEventStreamReducer'

const EMPTY_STRING : string = ''

export class TextReducer extends BaseEventStreamReducer<TextReducer.State, string>
{
  /**
  * @see EventStreamReducer.start
  */
  public start () : TextReducer.State {
    return {
      value : EMPTY_STRING,
      whitespaces : false
    }
  }

  /**
  * @see EventStreamReducer.reduce
  */
  public reduce (state : TextReducer.State, event : UnidocEvent) : void {
    switch (event.type) {
      case UnidocEventType.WHITESPACE:
        state.whitespaces = state.value.length > 0
        return
      case UnidocEventType.WORD:
        if (state.whitespaces) {
          state.value += ' '
          state.whitespaces = false
        }

        state.value += event.text
        return
      default:
        throw new Error(
          'Unable to reduce the given event of type #' + event.type + ' (' +
          UnidocEventType.toString(event.type) + ') because streams that ' +
          'encode a scalar string must only contains whitespaces and words.'
        )
    }
  }

  /**
  * @see EventStreamReducer.complete
  */
  public complete (state : TextReducer.State) : string {
    return state.value
  }

  /**
  * @see EventStreamReducer.restart
  */
  public restart (state : TextReducer.State) : void {
    state.value = EMPTY_STRING
    state.whitespaces = false
  }
}

export namespace TextReducer {
  export type State = {
    value : string,
    whitespaces : boolean
  }

  export const INSTANCE : TextReducer = new TextReducer()
}
