import { UnidocQuery } from './UnidocQuery'
import { nothing } from './nothing'

/**
* Stateless mapping of given inputs to outputs.
*/
export class MergedQuery<Input, Output>
  implements UnidocQuery<Input, Output>
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
  * Merged queries.
  */
  public readonly queries : Set<UnidocQuery<Input, Output>>

  /**
  * Number of queries that currently be completed.
  */
  private _completed : number

  public constructor (queries : Iterable<UnidocQuery<Input, Output>>) {
    this.resultListener = nothing
    this.completionListener = nothing

    this.handleNextValue  = this.handleNextValue.bind(this)
    this.handleCompletion = this.handleCompletion.bind(this)

    this.queries = new Set<UnidocQuery<Input, Output>>(queries)
    Object.freeze(this.queries)

    for (const query of this.queries) {
      query.resultListener = this.handleNextValue
      query.completionListener = this.handleCompletion
    }

    this._completed = 0
  }

  private handleNextValue (output : Output) : void {
    this.resultListener(output)
  }

  private handleCompletion () : void {
    this._completed += 1

    if (this._completed === this.queries.size) {
      this.completionListener()
    }
  }

  /**
  * @see UnidocQuery.start
  */
  public start () : void {
    for (const query of this.queries) {
      query.start()
    }
  }

  /**
  * @see UnidocQuery.next
  */
  public next (value : Input) : void {
    for (const query of this.queries) {
      query.next(value)
    }
  }

  /**
  * @see UnidocQuery.complete
  */
  public complete () : void {
    for (const query of this.queries) {
      query.complete()
    }
  }

  /**
  * @see UnidocQuery.reset
  */
  public reset () : void {
    for (const query of this.queries) {
      query.reset()
    }

    this._completed = 0
  }

  /**
  * @see UnidocQuery.reset
  */
  public clear () : void {
    for (const query of this.queries) {
      query.clear()
      query.resultListener = this.handleNextValue
      query.completionListener = this.handleCompletion
    }

    this._completed = 0
  }

  /**
  * @see UnidocQuery.clone
  */
  public clone () : MergedQuery<Input, Output> {
    const queries : UnidocQuery<Input, Output>[] = []

    for (const query of this.queries) {
      queries.push(query.clone())
    }

    const result : MergedQuery<Input, Output> = new MergedQuery<Input, Output>(queries)

    result._completed = this._completed
    result.completionListener = this.completionListener
    result.resultListener = this.resultListener

    return result
  }

  /**
  * @see UnidocQuery.toString
  */
  public toString () : string {
    return 'all (' + [...this.queries].join(', ') + ')'
  }
}
