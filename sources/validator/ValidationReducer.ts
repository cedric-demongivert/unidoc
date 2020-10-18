import { UnidocEvent } from '../event/UnidocEvent'

import { ValidationState } from './ValidationState'

export interface ValidationReducer<State> {
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
  complete (state : State) : void

  /**
  * Return the current validation state from the given reducer state.
  *
  * @param state - The current state of the reducer.
  *
  * @return A validation state.
  */
  state (state : State) : ValidationState

  /**
  * Reset the given state to it's starting value.
  *
  * @param sate - The current state of the reducer.
  */
  restart (state : State) : void
}

export namespace ValidationReducer {
}
