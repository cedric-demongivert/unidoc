import { UnidocQuery } from './UnidocQuery'
import { Sink } from './Sink'

/**
* Stateless mapping of given inputs to outputs.
*/
export class MergedQuery<Input, Output>
  implements UnidocQuery<Input, Output>
{
  public output : Sink<Output>

  /**
  * Merged queries.
  */
  public readonly queries : Set<UnidocQuery<Input, Output>>

  /**
  * Number of queries that are currently completed.
  */
  private _completed : number

  private subQueryHandler : Sink<Output>

  public constructor (queries : Iterable<UnidocQuery<Input, Output>>) {
    this.output = Sink.NONE
    this.subQueryHandler = {
      start: this.handleSubQueryStart.bind(this),
      next: this.handleSubQueryValue.bind(this),
      error: this.handleSubQueryError.bind(this),
      complete: this.handleSubQueryCompletion.bind(this)
    }

    this.queries = new Set<UnidocQuery<Input, Output>>(queries)
    Object.freeze(this.queries)

    for (const query of this.queries) {
      query.output = this.subQueryHandler
    }

    this._completed = 0
  }

  private handleSubQueryStart () : void {
  }

  private handleSubQueryValue (output : Output) : void {
    this.output.next(output)
  }

  private handleSubQueryError (error : Error) : void {
    this.output.error(error)
  }

  private handleSubQueryCompletion () : void {
    this._completed += 1

    if (this._completed === this.queries.size) {
      this.output.complete()
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
  * @see UnidocQuery.error
  */
  public error (error : Error) : void {
    this.output.error(error)
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
      query.output = this.subQueryHandler
    }

    this._completed = 0
    this.output = Sink.NONE
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
    result.output = this.output

    return result
  }

  /**
  * @see UnidocQuery.toString
  */
  public toString () : string {
    return 'all (' + [...this.queries].join(', ') + ')'
  }
}
