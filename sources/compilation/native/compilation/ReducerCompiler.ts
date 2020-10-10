import { UnidocEvent } from '../../../event/UnidocEvent'

import { NativeCompiler } from './NativeCompiler'
import { EventStreamReducer } from '../reducer/EventStreamReducer'

export class ReducerCompiler<T> implements NativeCompiler<T> {
  private readonly _reducer : EventStreamReducer<any, T>
  private readonly _state : any

  public constructor (reducer : EventStreamReducer<any, T>) {
    this._reducer = reducer
    this._state = this._reducer.start()
  }

  /**
  * Notify the begining of the stream of event that describe the document to
  * compile.
  */
  public start () : void {
    this._reducer.restart(this._state)
  }

  /**
  * Notify that a new event was published into the stream of event that describe
  * the document to compile.
  *
  * @param event - An event to process.
  */
  public next (event : UnidocEvent) : void {
    this._reducer.reduce(this._state, event)
  }

  /**
  * Notify the termination of the stream of event that describe the document to
  * compile.
  */
  public complete () : T {
    return this._reducer.complete(this._state)
  }

  /**
  * Update the state of this compiler toke make it as if the compiler was just
  * instantiated.
  */
  public clear () : void {
    this._reducer.restart(this._state)
  }
}

export namespace ReducerCompiler {
}
