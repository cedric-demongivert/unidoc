import { Sequence } from '@cedric-demongivert/gl-tool-collection'
import { Pack } from '@cedric-demongivert/gl-tool-collection'

import { UnidocEvent } from '../../../event/UnidocEvent'
import { UnidocEventType } from '../../../event/UnidocEventType'

import { EventStreamReducer } from './EventStreamReducer'
import { BaseEventStreamReducer } from './BaseEventStreamReducer'
import { ContentReducerState } from './ContentReducerState'

const EMPTY_STRING : string = ''

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
    result += '\r\n\t'
    result += (error.stack || EMPTY_STRING).split('\n').slice(1).map(x => '    - ' + x.trim()).join('\n').trim()
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
      state: ContentReducerState.DEFAULT
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

    state.state = ContentReducerState.DEFAULT
  }
}

export namespace AnyReducer {
  export type State = {
    errors : (Error|null)[],
    states : any[],
    state  : ContentReducerState
  }
}
