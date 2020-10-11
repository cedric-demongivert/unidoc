import { UnidocEvent } from '../../../event/UnidocEvent'
import { UnidocEventType } from '../../../event/UnidocEventType'

import { EventStreamReducer } from './EventStreamReducer'
import { BaseEventStreamReducer } from './BaseEventStreamReducer'
import { StreamReducerState } from './StreamReducerState'
import { NullReducer } from './NullReducer'

export class StreamReducer<T> extends BaseEventStreamReducer<StreamReducer.State, T[]>
{
  public elementReducer : EventStreamReducer<any, T>

  public constructor (elementReducer? : EventStreamReducer<any, T>) {
    super()
    this.elementReducer = elementReducer || NullReducer.INSTANCE
  }

  /**
  * @see EventStreamReducer.start
  */
  public start () : StreamReducer.State {
    return {
      value: [],
      state: StreamReducerState.DEFAULT,
      element: null,
      depth: 0
    }
  }

  /**
  * @see EventStreamReducer.reduce
  */
  public reduce (state : StreamReducer.State, event : UnidocEvent) : void {
    switch (state.state) {
      case StreamReducerState.BEFORE_STREAM:
        return this.reduceBeforeStream(state, event)
      case StreamReducerState.WITHIN_STREAM:
        return this.reduceWithinStream(state, event)
      case StreamReducerState.WITHIN_ELEMENT:
        return this.reduceWithinElement(state, event)
      case StreamReducerState.AFTER_STREAM:
        throw new Error(
          'Unable to reduce the event ' + event.toString() + ' in state #' +
          state.state + ' (' + StreamReducerState.toString(state.state) +
          ') because this reducer does not expect to receive new events ' +
          'after the last closing tag event.'
        )
      default:
        throw new Error(
          'Unable to reduce the event ' + event.toString() + ' in state #' +
          state.state + ' (' + StreamReducerState.toString(state.state) +
          ') because this reducer does not declare a procedure for this.'
        )
    }
  }

  public reduceBeforeStream (state : StreamReducer.State, event : UnidocEvent) : void {
    switch (event.type) {
      case UnidocEventType.START_TAG:
        state.state = StreamReducerState.WITHIN_STREAM
        return
      default:
        throw new Error(
          'Unable to reduce the event ' + event.toString() + ' in state #' +
          state.state + ' (' + StreamReducerState.toString(state.state) +
          ') because a stream reducer expects to receive the root tag ' +
          'opening and ending events.'
        )
    }
  }

  public reduceWithinElement (state : StreamReducer.State, event : UnidocEvent) : void {
    this.elementReducer.reduce(state.element, event)

    switch (event.type) {
      case UnidocEventType.START_TAG:
        state.depth += 1
        break
      case UnidocEventType.END_TAG:
        state.depth -= 1

        if (state.depth === 0) {
          state.state = StreamReducerState.WITHIN_STREAM
          state.value.push(this.elementReducer.complete(state.element))
        }

        break
      default:
        break
    }
  }

  public reduceWithinStream (state : StreamReducer.State, event : UnidocEvent) : void {
    switch (event.type) {
      case UnidocEventType.START_TAG:
        state.state = StreamReducerState.WITHIN_ELEMENT
        state.depth += 1
        state.element = this.elementReducer.bootstrap(state.element)
        this.elementReducer.reduce(state.element, event)
        return
      case UnidocEventType.END_TAG:
        state.state = StreamReducerState.AFTER_STREAM
        return
      case UnidocEventType.WHITESPACE:
        return
      case UnidocEventType.WORD:
        throw new Error(
          'Unable to reduce the event ' + event.toString() + ' in state #' +
          state.state + ' (' + StreamReducerState.toString(state.state) +
          ') because a stream tag must only contains other tags and ' +
          'whitespaces.'
        )
      default:
        throw new Error(
          'Unable to reduce the event ' + event.toString() + ' in state #' +
          state.state + ' (' + StreamReducerState.toString(state.state) +
          ') because this reducer does not declare a procedure for this.'
        )
    }
  }

  /**
  * @see EventStreamReducer.complete
  */
  public complete (state : StreamReducer.State) : T[] {
    return state.value
  }

  /**
  * @see EventStreamReducer.restart
  */
  public restart (state : StreamReducer.State) : void {
    state.value = []
    state.state = StreamReducerState.DEFAULT
    state.depth = 0
  }
}

export namespace StreamReducer {
  export type State = {
    value : any[],
    element : any,
    state : StreamReducerState,
    depth : number
  }
}
