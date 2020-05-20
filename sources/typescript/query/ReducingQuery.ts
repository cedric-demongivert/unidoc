import { AtomicQuery } from './AtomicQuery'
import { UnidocQuery } from './UnidocQuery'
import { UnidocReducer } from './UnidocReducer'
import { nothing } from './nothing'

/**
* Stateless mapping of given inputs to outputs.
*/
export class ReducingQuery<Input, Output>
  implements UnidocQuery<Input, Output>,
             AtomicQuery<Output>
{
  /**
  * A listener called when a value is published by this query.
  */
  public resultListener : UnidocQuery.ResultListener<Output>

  /**
  * A listener called when the output stream of this query reach it's end.
  */
  public completionListener : UnidocQuery.CompletionListener

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

  public constructor (mapper : UnidocReducer<Input, Output>, initialState : Output) {
    this.resultListener = nothing
    this.completionListener = nothing
    this.reducer = mapper
    this.initialState = initialState
    this._state = initialState
    this._index = 0
  }

  /**
  * @see UnidocQuery.start
  */
  public start () : void {
    this._state = this.initialState
    this._index = 0
  }

  /**
  * @see UnidocQuery.next
  */
  public next (value : Input) : void {
    this._state = this.reducer(this._state, value, this._index)
    this.resultListener(this._state)
    this._index += 1
  }

  /**
  * @see UnidocQuery.complete
  */
  public complete () : void {
    this.completionListener()
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
    this.resultListener = nothing
    this.completionListener = nothing
    this._state = this.initialState
    this._index = 0
  }

  /**
  * @see UnidocQuery.clone
  */
  public clone () : ReducingQuery<Input, Output> {
    const result : ReducingQuery<Input, Output> = new ReducingQuery<Input, Output>(this.reducer, this.initialState)

    result._index = this._index
    result.completionListener = this.completionListener
    result.resultListener = this.resultListener

    return result
  }

  /**
  * @see UnidocQuery.toString
  */
  public toString () : string {
    return 'reduce ' + this.reducer.toString()
  }
}
