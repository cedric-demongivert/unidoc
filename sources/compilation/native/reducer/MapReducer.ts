import { UnidocEvent } from '../../../event/UnidocEvent'

import { EventStreamReducer } from './EventStreamReducer'

export class MapReducer<From, To> implements EventStreamReducer<any, To>
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
    return this.innerReducer.start()
  }

  /**
  * @see EventStreamReducer.reduce
  */
  public reduce (state : MapReducer.State, event : UnidocEvent) : void {
    this.innerReducer.reduce(state, event)
  }

  /**
  * @see EventStreamReducer.complete
  */
  public complete (state : MapReducer.State) : To {
    return this.mapper(this.innerReducer.complete(state))
  }

  /**
  * @see EventStreamReducer.restart
  */
  public restart (state : MapReducer.State) : void {
    this.innerReducer.restart(state)
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
  export type State = any
}
