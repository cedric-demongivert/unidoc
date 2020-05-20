import { AtomicQuery } from './AtomicQuery'
import { UnidocQuery } from './UnidocQuery'
import { UnidocMapper } from './UnidocMapper'
import { nothing } from './nothing'

/**
* Stateless mapping of given inputs to outputs.
*/
export class MappingQuery<Input, Output>
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
  public mapper : UnidocMapper<Input, Output>

  /**
  * Current index.
  */
  private _index : number

  public constructor (mapper : UnidocMapper<Input, Output>) {
    this.resultListener = nothing
    this.completionListener = nothing
    this.mapper = mapper
    this._index = 0
  }

  /**
  * @see UnidocQuery.start
  */
  public start () : void {

  }

  /**
  * @see UnidocQuery.next
  */
  public next (value : Input) : void {
    this.resultListener(this.mapper(value, this._index))
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
    this._index = 0
  }

  /**
  * @see UnidocQuery.reset
  */
  public clear () : void {
    this.resultListener = nothing
    this.completionListener = nothing
    this._index = 0
  }

  /**
  * @see UnidocQuery.clone
  */
  public clone () : MappingQuery<Input, Output> {
    const result : MappingQuery<Input, Output> = new MappingQuery<Input, Output>(this.mapper)

    result._index = this._index
    result.completionListener = this.completionListener
    result.resultListener = this.resultListener

    return result
  }

  /**
  * @see UnidocQuery.toString
  */
  public toString () : string {
    return 'map ' + this.mapper.toString()
  }
}
