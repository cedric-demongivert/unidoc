import { UnidocEvent } from '../../../event/UnidocEvent'
import { UnidocEventType } from '../../../event/UnidocEventType'

import { EventStreamReducer } from './EventStreamReducer'
import { BaseEventStreamReducer } from './BaseEventStreamReducer'
import { ContentReducerState } from './ContentReducerState'

import { NullReducer } from './NullReducer'

export class SwitchReducer<T> extends BaseEventStreamReducer<SwitchReducer.State, T>
{
  public readonly reducers : Map<string, EventStreamReducer<any, T>>

  public constructor () {
    super()

    this.reducers = new Map()
  }

  /**
  * @see EventStreamReducer.start
  */
  public start () : SwitchReducer.State {
    const result : SwitchReducer.State = {
      value: null,
      reducer: NullReducer.INSTANCE,
      state: ContentReducerState.BEFORE_CONTENT,
      depth: 0
    }

    return result
  }

  /**
  * @see EventStreamReducer.reduce
  */
  public reduce (state : SwitchReducer.State, event : UnidocEvent) : void {
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

  public reduceBeforeContent (state : SwitchReducer.State, event : UnidocEvent) : void {
    switch (event.type) {
      case UnidocEventType.WHITESPACE:
        return
      case UnidocEventType.START_TAG:
        state.state = ContentReducerState.WITHIN_CONTENT

        const reducer : EventStreamReducer<any, T> | undefined = (
          this.reducers.get(event.tag)
        )

        if (reducer == null) {
          throw new Error(
            'Unable to reduce the event ' + event.toString() + ' in state #' +
            state.state + ' (' + ContentReducerState.toString(state.state) +
            ') because tags of type "' + event.tag + '" are not allowed.'
          )
        } else {
          state.reducer = reducer
          state.depth += 1
          state.value = state.reducer.start()
          state.reducer.reduce(state.value, event)
        }

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

  public reduceWithinContent (state : SwitchReducer.State, event : UnidocEvent) : void {
    state.reducer.reduce(state.value, event)

    switch (event.type) {
      case UnidocEventType.START_TAG:
        state.depth += 1
        break
      case UnidocEventType.END_TAG:
        state.depth -= 1

        if (state.depth === 0) {
          state.state = ContentReducerState.AFTER_CONTENT
        }
      default:
        break
    }
  }


  /**
  * @see EventStreamReducer.complete
  */
  public complete (state : SwitchReducer.State) : T {
    return state.reducer.complete(state.value)
  }

  /**
  * @see EventStreamReducer.restart
  */
  public restart (state : SwitchReducer.State) : void {
    state.state = ContentReducerState.BEFORE_CONTENT
    state.value = null
    state.reducer = NullReducer.INSTANCE
    state.depth = 0
  }
}

export namespace SwitchReducer {
  export type State = {
    value: any,
    reducer: EventStreamReducer<any, any>,
    state: ContentReducerState,
    depth: number
  }
}
