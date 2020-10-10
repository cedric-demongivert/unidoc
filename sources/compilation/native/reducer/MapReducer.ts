import { UnidocEvent } from '../../../event/UnidocEvent'
import { UnidocEventType } from '../../../event/UnidocEventType'

import { EventStreamReducer } from './EventStreamReducer'
import { ContentReducerState } from './ContentReducerState'

export class MapReducer<From, To> implements EventStreamReducer<MapReducer.State, To>
{
  public readonly innerReducer : EventStreamReducer<any, From>
  public readonly mapper : (value : From) => To

  public constructor (innerReducer : EventStreamReducer<any, From>, mapper : (value : From) => To) {
    this.innerReducer = innerReducer
    this.mapper = mapper
  }

  /**
  * @see EventStreamReducer.start
  */
  public start () : MapReducer.State {
    return {
      value: this.innerReducer.start(),
      state: ContentReducerState.BEFORE_CONTENT,
      depth: 0
    }
  }

  /**
  * @see EventStreamReducer.reduce
  */
  public reduce (state : MapReducer.State, event : UnidocEvent) : void {
    switch (state.state) {
      case ContentReducerState.BEFORE_CONTENT:
        return this.reduceBeforeContent(state, event)
      case ContentReducerState.WITHIN_CONTENT:
        return this.reduceWithinContent(state, event)
      case ContentReducerState.AFTER_CONTENT:
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

  public reduceBeforeContent (state : MapReducer.State, event : UnidocEvent) : void {
    switch (event.type) {
      case UnidocEventType.START_TAG:
        state.state = ContentReducerState.WITHIN_CONTENT
        this.innerReducer.reduce(state.value, event)
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

  public reduceWithinContent (state : MapReducer.State, event : UnidocEvent) : void {
    this.innerReducer.reduce(state.value, event)

    switch (event.type) {
      case UnidocEventType.START_TAG:
        state.depth += 1
        break
      case UnidocEventType.END_TAG:
        state.depth -= 1

        if (state.depth === 0) {
          state.state = ContentReducerState.AFTER_CONTENT
        }

        break
      default:
        break
    }
  }


  /**
  * @see EventStreamReducer.complete
  */
  public complete (state : MapReducer.State) : To {
    return this.mapper(this.innerReducer.complete(state.value))
  }

  /**
  * @see EventStreamReducer.restart
  */
  public restart (state : MapReducer.State) : void {
    this.innerReducer.restart(state.value)
    state.state = ContentReducerState.DEFAULT
    state.depth = 0
  }

  /**
  * Start or restart the given state.
  *
  * @param state - The state to bootstrap, or nothing for creating a new state.
  */
  public bootstrap (state? : MapReducer.State) : MapReducer.State {
    if (state) {
      this.restart(state)
      return state
    } else {
      return this.start()
    }
  }

  /**
  * Map this reducer in order to return a specific value.
  *
  * @param mapper - A mapper to use for translating this reducer output.
  *
  * @return A new reducer that store the mapping information.
  */
  public map <ReTo> (mapper : (from : To) => ReTo) : MapReducer<To, ReTo> {
    return new MapReducer(this, mapper)
  }
}

export namespace MapReducer {
  export type State = {
    value : any,
    state : ContentReducerState,
    depth : number
  }
}
