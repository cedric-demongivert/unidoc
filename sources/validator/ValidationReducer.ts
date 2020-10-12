import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocValidation } from '../validation/UnidocValidation'

export interface EventStreamReducer<State> {
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
}

export namespace ValidationReducer {
}
