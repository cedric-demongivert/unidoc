import { UnidocEvent } from '../../../event/UnidocEvent'

import { MapReducer } from './MapReducer'
import { EventStreamReducer } from './EventStreamReducer'

export class BaseEventStreamReducer<State, Result> implements EventStreamReducer<State, Result> {
  /**
  * @see EventStreamReducer.start
  */
  public start () : State {
    throw new Error('This method is not implemented yet.')
  }

  /**
  * @see EventStreamReducer.reduce
  */
  public reduce (state : State, event : UnidocEvent) : void {
    throw new Error('This method is not implemented yet.')
  }

  /**
  * @see EventStreamReducer.complete
  */
  public complete (state : State) : Result {
    throw new Error('This method is not implemented yet.')
  }

  /**
  * @see EventStreamReducer.restart
  */
  public restart (state : State) : void {
    throw new Error('This method is not implemented yet.')
  }

  /**
  * Start or restart the given state.
  *
  * @param state - The state to bootstrap, or nothing for creating a new state.
  */
  public bootstrap (state? : State) : State {
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
  public map <To> (mapper : (from : Result) => To) : MapReducer<Result, To> {
    return new MapReducer(this, mapper)
  }
}

export namespace BaseEventStreamReducer {
}
