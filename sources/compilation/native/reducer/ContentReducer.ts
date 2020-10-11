import { UnidocEvent } from '../../../event/UnidocEvent'
import { UnidocEventType } from '../../../event/UnidocEventType'

import { EventStreamReducer } from './EventStreamReducer'
import { BaseEventStreamReducer } from './BaseEventStreamReducer'
import { ContentReducerState } from './ContentReducerState'

export class ContentReducer<T> extends BaseEventStreamReducer<ContentReducer.State, T>
{
  public readonly innerReducer : EventStreamReducer<any, T>

  public constructor (innerReducer : EventStreamReducer<any, T>) {
    super()
    this.innerReducer = innerReducer
  }

  /**
  * @see EventStreamReducer.start
  */
  public start () : ContentReducer.State {
    return {
      value: this.innerReducer.start(),
      state: ContentReducerState.BEFORE_CONTENT,
      depth: 0
    }
  }

  /**
  * @see EventStreamReducer.reduce
  */
  public reduce (state : ContentReducer.State, event : UnidocEvent) : void {
    switch (state.state) {
      case ContentReducerState.BEFORE_CONTENT:
        return this.reduceBeforeContent(state, event)
      case ContentReducerState.WITHIN_CONTENT:
        return this.reduceWithinContent(state, event)
      case ContentReducerState.AFTER_CONTENT:
        if (event.type === UnidocEventType.WHITESPACE) {
          return
        }

        throw new Error(
          'Unable to reduce the event ' + event.toString() + ' in state #' +
          state.state + ' (' + ContentReducerState.toString(state.state) +
          ') because this reducer does not expect to receive new events ' +
          'after the last closing tag event.'
        )
      default:
        throw new Error(
          'Unable to reduce the event ' + event.toString() + ' in state #' +
          state.state + ' (' + ContentReducerState.toString(state.state) +
          ') because this reducer does not declare a procedure for this.'
        )
    }
  }

  public reduceBeforeContent (state : ContentReducer.State, event : UnidocEvent) : void {
    switch (event.type) {
      case UnidocEventType.START_TAG:
        state.state = ContentReducerState.WITHIN_CONTENT
        state.depth = 1
        return
      case UnidocEventType.WHITESPACE:
        return
      default:
        throw new Error(
          'Unable to reduce the event ' + event.toString() + ' in state #' +
          state.state + ' (' + ContentReducerState.toString(state.state) +
          ') because a content reducer expects to receive the root tag ' +
          'opening and ending events.'
        )
    }
  }

  public reduceWithinContent (state : ContentReducer.State, event : UnidocEvent) : void {
    switch (event.type) {
      case UnidocEventType.END_TAG:
        state.depth -= 1

        if (state.depth === 0) {
          state.state = ContentReducerState.AFTER_CONTENT
        } else {
          this.innerReducer.reduce(state.value, event)
        }

        break
      case UnidocEventType.START_TAG:
        state.depth += 1
      default:
        this.innerReducer.reduce(state.value, event)
        break
    }
  }


  /**
  * @see EventStreamReducer.complete
  */
  public complete (state : ContentReducer.State) : T {
    return this.innerReducer.complete(state.value)
  }

  /**
  * @see EventStreamReducer.restart
  */
  public restart (state : ContentReducer.State) : void {
    this.innerReducer.restart(state.value)
    state.state = ContentReducerState.DEFAULT
    state.depth = 0
  }
}

export namespace ContentReducer {
  export type State = {
    value : any,
    state : ContentReducerState,
    depth : number
  }
}
