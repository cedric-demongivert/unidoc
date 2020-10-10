import { UnidocEvent } from '../../../event/UnidocEvent'
import { UnidocEventType } from '../../../event/UnidocEventType'

import { BaseEventStreamReducer } from './BaseEventStreamReducer'
import { TokenReducerState } from './TokenReducerState'

const EMPTY_STRING : string = ''

export class TokenReducer extends BaseEventStreamReducer<TokenReducer.State, string>
{
  /**
  * @see EventStreamReducer.start
  */
  public start () : TokenReducer.State {
    return {
      value : EMPTY_STRING,
      state : TokenReducerState.DEFAULT
    }
  }

  /**
  * @see EventStreamReducer.reduce
  */
  public reduce (state : TokenReducer.State, event : UnidocEvent) : void {
    switch (event.type) {
      case UnidocEventType.WHITESPACE:
        return this.reduceWhitespace(state, event)
      case UnidocEventType.WORD:
        return this.reduceWord(state, event)
      default:
        throw new Error(
          'Unable to reduce the given event of type #' + event.type + ' (' +
          UnidocEventType.toString(event.type) + ') because streams that ' +
          'encode a scalar number must only contains whitespaces and words.'
        )
    }
  }

  public reduceWhitespace (state : TokenReducer.State, event : UnidocEvent) : void {
    switch (state.state) {
      case TokenReducerState.BEFORE_CONTENT:
      case TokenReducerState.AFTER_CONTENT:
        return
      case TokenReducerState.WITHIN_CONTENT:
        state.state = TokenReducerState.AFTER_CONTENT
        return
      default:
        throw new Error(
          'Unable to reduce the event ' + event.toString() + ' in state #' +
          state.state + ' (' + TokenReducerState.toString(state.state) +
          ') because this reducer does not declare a procedure to follow in ' +
          'this state.'
        )
    }
  }

  public reduceWord (state : TokenReducer.State, event : UnidocEvent) : void {
    switch (state.state) {
      case TokenReducerState.BEFORE_CONTENT:
        state.state = TokenReducerState.WITHIN_CONTENT
      case TokenReducerState.WITHIN_CONTENT:
        state.value += event.text
        return
      case TokenReducerState.AFTER_CONTENT:
        throw new Error(
          'Unable to reduce the event ' + event.toString() + ' because ' +
          'streams that encode a scalar number must only contains one ' +
          'sequence of words.'
        )
      default:
        throw new Error(
          'Unable to handle the event ' + event.toString() + ' in state #' +
          state.state + ' (' + TokenReducerState.toString(state.state) +
          ') because this compiler does not declare a procedure to follow in ' +
          'this state.'
        )
    }
  }

  /**
  * @see EventStreamReducer.complete
  */
  public complete (state : TokenReducer.State) : string {
    return state.value
  }

  /**
  * @see EventStreamReducer.restart
  */
  public restart (state : TokenReducer.State) : void {
    state.value = EMPTY_STRING
    state.state = TokenReducerState.DEFAULT
  }
}

export namespace TokenReducer {
  export type State = {
    value : string,
    state : TokenReducerState
  }

  export const INSTANCE : TokenReducer = new TokenReducer()
}
