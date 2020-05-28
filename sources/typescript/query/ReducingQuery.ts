import { UnidocQuery } from './UnidocQuery'
import { UnidocReducer } from './UnidocReducer'
import { Sink } from './Sink'

/**
* Stateless mapping of given inputs to outputs.
*/
export class ReducingQuery<Input, Output>
  implements UnidocQuery<Input, Output>
{
  /**
  * A listener called when a value is published by this query.
  */
  public output : Sink<Output>

  /**
  * Mapping function.
  */
  public reducer : UnidocReducer<Input, Output>

  /**
  * Initial state of the reduction.
  */
  public initialState : Output

  /**
  * Current state.
  */
  private _state : Output

  /**
  * Current index.
  */
  private _index : number

  /**
  * Instantiate a new reducing query.
  *
  * The reducer used in this query must be stateless, if not, the outgoing
  * stream will enter into an undecidable state after a reset.
  *
  * @param reducer - The reducer to use for reducing ingoing values to outgoing
  *                  values.
  * @param state - The initial state to pass to the given reducer.
  */
  public constructor (reducer : UnidocReducer<Input, Output>, state : Output) {
    this.output = Sink.NONE
    this.reducer = reducer
    this.initialState = state
    this._state = state
    this._index = 0
  }

  /**
  * @see UnidocQuery.start
  */
  public start () : void {
    this._state = this.initialState
    this._index = 0
    this.output.start()
  }

  /**
  * @see UnidocQuery.next
  */
  public next (value : Input) : void {
    this._state = this.reducer(this._state, value, this._index)
    this.output.next(this._state)
    this._index += 1
  }

  /**
  * @see UnidocQuery.complete
  */
  public complete () : void {
    this.output.complete()
  }

  /**
  * @see UnidocQuery.error
  */
  public error (error : Error) : void {
    this.output.error(error)
  }

  /**
  * @see UnidocQuery.reset
  */
  public reset () : void {
    this._state = this.initialState
    this._index = 0
  }

  /**
  * @see UnidocQuery.reset
  */
  public clear () : void {
    this.output = Sink.NONE
    this._state = this.initialState
    this._index = 0
  }

  /**
  * @see UnidocQuery.clone
  */
  public clone () : ReducingQuery<Input, Output> {
    const result : ReducingQuery<Input, Output> = new ReducingQuery<Input, Output>(this.reducer, this.initialState)

    result._index = this._index
    result.output = this.output

    return result
  }

  /**
  * @see UnidocQuery.toString
  */
  public toString () : string {
    return 'reduce:' + this.reducer.toString()
  }
}
