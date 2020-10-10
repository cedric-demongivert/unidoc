import { Sequence } from '@cedric-demongivert/gl-tool-collection'
import { Pack } from '@cedric-demongivert/gl-tool-collection'

import { UnidocEvent } from '../../../event/UnidocEvent'
import { UnidocEventType } from '../../../event/UnidocEventType'

import { EventStreamReducer } from './EventStreamReducer'
import { BaseEventStreamReducer } from './BaseEventStreamReducer'
import { ContentReducerState } from './ContentReducerState'

function errorReducer (base : string, error : Error | null, index : number) : string {
  let result : string = base
  if (index > 0) {
    result += '\r\n'
  }

  result += index
  result += ' - '

  if (error == null) {
    result += 'null'
  } else {
    result += error.name
    result += ' : '
    result += error.message
  }

  return result
}

export class AnyReducer<T> extends BaseEventStreamReducer<AnyReducer.State, T>
{
  public readonly reducers : Pack<EventStreamReducer<any, T>>

  public constructor (reducers : EventStreamReducer<any, T>[]) {
    super()

    this.reducers = Pack.any(reducers.length)

    for (const reducer of reducers) {
      this.reducers.push(reducer)
    }
  }

  /**
  * @see EventStreamReducer.start
  */
  public start () : AnyReducer.State {
    const result : AnyReducer.State = {
      errors: [],
      states: [],
      state: ContentReducerState.DEFAULT,
      depth: 0
    }

    for (const reducer of this.reducers) {
      result.errors.push(null)
      result.states.push(reducer.start())
    }

    return result
  }

  /**
  * @see EventStreamReducer.reduce
  */
  public reduce (state : AnyReducer.State, event : UnidocEvent) : void {
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

  public reduceBeforeContent (state : AnyReducer.State, event : UnidocEvent) : void {
    switch (event.type) {
      case UnidocEventType.START_TAG:
        state.state = ContentReducerState.WITHIN_CONTENT
        this.anyReduce(state, event)
        return
      default:
        throw new Error(
          'Unable to reduce the event ' + event.toString() + ' in state #' +
          state.state + ' (' + ContentReducerState.toString(state.state) +
          ') because an any reducer expects to receive the root tag ' +
          'opening and ending events.'
        )
    }
  }

  public reduceWithinContent (state : AnyReducer.State, event : UnidocEvent) : void {
    this.anyReduce(state, event)

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

  public anyReduce (state : AnyReducer.State, event : UnidocEvent) : void {
    let allErrors : boolean = true

    for (let index = 0, size = this.reducers.size; index < size; ++index) {
      if (state.errors[index] == null) {
        try {
          this.reducers.get(index).reduce(state.states[index], event)
          allErrors = false
        } catch (error) {
          state.errors[index] = error
        }
      }
    }

    if (allErrors) {
      throw new Error(
        'Unable to reduce event ' + event.toString() + ' because every ' +
        'alternative ended by an error : \r\n' +
        state.errors.reduce(errorReducer, '')
      )
    }

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
  public complete (state : AnyReducer.State) : T {
    for (let index = 0, size = this.reducers.size; index < size; ++index) {
      if (state.errors[index] == null) {
        try {
          return this.reducers.get(index).complete(state.states[index])
        } catch (error) {
          state.errors[index] = error
        }
      }
    }

    throw new Error(
      'Unable to complete this stream because every alternative ended by an ' +
      'error : \r\n' + state.errors.reduce(errorReducer, '')
    )
  }

  /**
  * @see EventStreamReducer.restart
  */
  public restart (state : AnyReducer.State) : void {
    for (let index = 0, size = this.reducers.size; index < size; ++index) {
      state.errors[index] = null
      this.reducers.get(index).restart(state.states[index])
    }

    state.depth = 0
    state.state = ContentReducerState.DEFAULT
  }
}

export namespace AnyReducer {
  export type State = {
    errors : (Error|null)[],
    states : any[],
    state  : ContentReducerState,
    depth  : number
  }
}
