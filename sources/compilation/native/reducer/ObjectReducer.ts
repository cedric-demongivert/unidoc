import { UnidocEvent } from '../../../event/UnidocEvent'
import { UnidocEventType } from '../../../event/UnidocEventType'

import { EventStreamReducer } from './EventStreamReducer'
import { BaseEventStreamReducer } from './BaseEventStreamReducer'
import { ObjectReducerState } from './ObjectReducerState'

import { NullReducer } from './NullReducer'

export class ObjectReducer<T> extends BaseEventStreamReducer<ObjectReducer.State, T>
{
  public readonly reducers : Map<string, EventStreamReducer<any, any>>

  public constructor () {
    super()

    this.reducers = new Map()
  }

  /**
  * @see EventStreamReducer.start
  */
  public start () : ObjectReducer.State {
    const result : ObjectReducer.State = {
      values: new Map(),
      ends: new Map(),
      current: null,
      reducer: NullReducer.INSTANCE,
      state: ObjectReducerState.BEFORE_OBJECT,
      depth: 0
    }

    return result
  }

  /**
  * @see EventStreamReducer.reduce
  */
  public reduce (state : ObjectReducer.State, event : UnidocEvent) : void {
    switch (state.state) {
      case ObjectReducerState.BEFORE_OBJECT:
        return this.reduceBeforeContent(state, event)
      case ObjectReducerState.WITHIN_OBJECT:
        return this.reduceWithinContent(state, event)
      case ObjectReducerState.WITHIN_ELEMENT:
        return this.reduceWithinElement(state, event)
      case ObjectReducerState.AFTER_OBJECT:
        throw new Error(
          'Unable to reduce the event ' + event.toString() + ' in state #' +
          state.state + ' (' + ObjectReducerState.toString(state.state) +
          ') because this reducer does not expect to receive new events ' +
          'after the last closing tag event.'
        )
      default:
        throw new Error(
          'Unable to reduce the event ' + event.toString() + ' in state #' +
          state.state + ' (' + ObjectReducerState.toString(state.state) +
          ') because this reducer does not declare a procedure for this.'
        )
    }
  }

  public reduceBeforeContent (state : ObjectReducer.State, event : UnidocEvent) : void {
    switch (event.type) {
      case UnidocEventType.START_TAG:
        state.state = ObjectReducerState.WITHIN_OBJECT
        return
      default:
        throw new Error(
          'Unable to reduce the event ' + event.toString() + ' in state #' +
          state.state + ' (' + ObjectReducerState.toString(state.state) +
          ') because this reducer expects to receive the root tag ' +
          'opening and ending events.'
        )
    }
  }

  public reduceWithinContent (state : ObjectReducer.State, event : UnidocEvent) : void {
    switch (event.type) {
      case UnidocEventType.START_TAG:
        state.state = ObjectReducerState.WITHIN_ELEMENT
        state.depth += 1

        const tag : string = event.tag
        const reducer : EventStreamReducer<any, T> | undefined = (
          this.reducers.get(event.tag) || this.reducers.get('*')
        )

        if (reducer == null) {
          throw new Error(
            'Unable to reduce the event ' + event.toString() + ' in state #' +
            state.state + ' (' + ObjectReducerState.toString(state.state) +
            ') because tags of type "' + event.tag + '" are not allowed.'
          )
        }

        state.current = state.values.get(tag)
        state.reducer = reducer

        if (state.current == null) {
          state.current = reducer.start()
          state.values.set(tag, state.current)
          reducer.reduce(state.current, event)
        }

        return
      case UnidocEventType.END_TAG:
        state.state = ObjectReducerState.AFTER_OBJECT
        this.notifyTermination(state)
        return
      case UnidocEventType.WHITESPACE:
        return
      case UnidocEventType.WORD:
        throw new Error(
          'Unable to reduce the event ' + event.toString() + ' in state #' +
          state.state + ' (' + ObjectReducerState.toString(state.state) +
          ') because an object tag must only contains other tags and ' +
          'whitespaces.'
        )
      default:
        throw new Error(
          'Unable to reduce the event ' + event.toString() + ' in state #' +
          state.state + ' (' + ObjectReducerState.toString(state.state) +
          ') because this reducer does not declare a procedure for this.'
        )
    }
  }

  public reduceWithinElement (state : ObjectReducer.State, event : UnidocEvent) : void {
    switch (event.type) {
      case UnidocEventType.END_TAG:
        state.depth -= 1

        if (state.depth === 0) {
          state.state = ObjectReducerState.WITHIN_OBJECT
          state.ends.set(event.tag, event.clone())
          state.reducer = NullReducer.INSTANCE
        } else {
          state.reducer.reduce(state.current, event)
        }

        break
      case UnidocEventType.START_TAG:
        state.depth += 1
      default:
        state.reducer.reduce(state.current, event)
        break
    }
  }

  private notifyTermination (state : ObjectReducer.State) : void {
    for (const [key, value] of state.values) {
      (this.reducers.get(key) as EventStreamReducer<any, any>).reduce(
        value,
        state.ends.get(key) as UnidocEvent
      )
    }

    state.ends.clear()
  }

  /**
  * @see EventStreamReducer.complete
  */
  public complete (state : ObjectReducer.State) : T {
    const result : any = {}

    for (const [key, value] of state.values) {
      result[key] = (
        this.reducers.get(key) as EventStreamReducer<any, any>
      ).complete(value)
    }

    return result
  }

  /**
  * @see EventStreamReducer.restart
  */
  public restart (state : ObjectReducer.State) : void {
    state.values.clear()
    state.ends.clear()
    state.current = null
    state.reducer = NullReducer.INSTANCE,
    state.state = ObjectReducerState.BEFORE_OBJECT,
    state.depth = 0
  }
}

export namespace ObjectReducer {
  export type State = {
    values: Map<string, any>,
    ends: Map<string, UnidocEvent>,
    current: any,
    reducer: EventStreamReducer<any, any>
    state: ObjectReducerState,
    depth: number
  }
}
