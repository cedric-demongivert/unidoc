import { UnidocEvent } from '../../../event/UnidocEvent'

import { TokenReducer } from './TokenReducer'
import { ContentReducer } from './ContentReducer'
import { TextReducer } from './TextReducer'
import { StreamReducer } from './StreamReducer'
import { ObjectReducer } from './ObjectReducer'
import { AnyReducer } from './AnyReducer'
import { SwitchReducer } from './SwitchReducer'

export interface EventStreamReducer<State, Result> {
  /**
  * Notify the begining of the stream of event to reduce.
  *
  * @return The initial state of the reducing operation.
  */
  start () : State

  /**
  * Notify that a new event was published into the stream of event to reduce.
  *
  * @param state - The current state of the reducer.
  * @param event - An event to reduce.
  */
  reduce (state : State, event : UnidocEvent) : void

  /**
  * Notify the termination of the stream of event to reduce.
  *
  * @param sate - The current state of the reducer.
  */
  complete (state : State) : Result

  /**
  * Reset the given state to it's starting value.
  *
  * @param sate - The current state of the reducer.
  */
  restart (state : State) : void

  /**
  * Start or restart the given state.
  *
  * @param state - The state to bootstrap, or nothing for creating a new state.
  */
  bootstrap (state? : State) : State

  /**
  * Map this reducer in order to return a specific value.
  *
  * @param mapper - A mapper to use for translating this reducer output.
  *
  * @return A new reducer that store the mapping information.
  */
  map <To> (mapper : (from : Result) => To) : EventStreamReducer<any, To>
}

export namespace EventStreamReducer {
  export const INTEGER : EventStreamReducer<any, number> = (
    new ContentReducer(TokenReducer.INSTANCE)
  ).map(parseInt)

  export const FLOAT : EventStreamReducer<any, number> = (
    new ContentReducer(TokenReducer.INSTANCE)
  ).map(parseFloat)

  export const TOKEN : EventStreamReducer<any, string> = (
    new ContentReducer(TokenReducer.INSTANCE)
  )

  export const TEXT : EventStreamReducer<any, string> = (
    new ContentReducer(TextReducer.INSTANCE)
  )

  export function integer () : EventStreamReducer<any, number> {
    return INTEGER
  }

  export function float () : EventStreamReducer<any, number> {
    return FLOAT
  }

  export function token () : EventStreamReducer<any, string> {
    return TOKEN
  }

  export function text () : EventStreamReducer<any, string> {
    return TEXT
  }

  export function stream <T> (valueReducer? : EventStreamReducer<any, T>) : StreamReducer<T> {
    return new StreamReducer<T>(valueReducer)
  }

  export function object <T> (descriptor? : any) : ObjectReducer<T> {
    const result : ObjectReducer<T> = new ObjectReducer()

    if (descriptor) {
      for (const key of Object.keys(descriptor)) {
        result.reducers.set(key, descriptor[key])
      }
    }

    return result
  }

  export function any <T> (...reducers : EventStreamReducer<any, any>[]) : AnyReducer<T> {
    return new AnyReducer(reducers)
  }

  export function tags <T> (descriptor? : any) : SwitchReducer<T> {
    const result : SwitchReducer<T> = new SwitchReducer()

    if (descriptor) {
      for (const key of Object.keys(descriptor)) {
        result.reducers.set(key, descriptor[key])
      }
    }

    return result
  }

  export function unwrap <T> (reducer : EventStreamReducer<any, T>) : EventStreamReducer<any, T> {
    return new ContentReducer(reducer)
  }

  export function enumeration <T> (reducer : EventStreamReducer<any, T>, ...enumeration : T[]) : EventStreamReducer<any, T> {
    const values : Set<T> = new Set<T>(enumeration)

    function mapValid (value : T) : T {
      if (!values.has(value)) {
        throw new Error(
          'Invalid value "' + value + '", expected value are : ' + [...values]
        )
      }

      return value
    }

    return reducer.map(mapValid)
  }
}
