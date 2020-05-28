import { UnidocQuery } from './UnidocQuery'
import { UnidocMapper } from './UnidocMapper'
import { Sink } from './Sink'

/**
* Stateless mapping of given inputs to outputs.
*/
export class MappingQuery<Input, Output>
  implements UnidocQuery<Input, Output>
{
  /**
  * A listener called when a value is published by this query.
  */
  public output : Sink<Output>

  /**
  * A stateless mapping function.
  */
  public mapper : UnidocMapper<Input, Output>

  /**
  * Current index.
  */
  private _index : number

  /**
  * Instantiate a new mapping query.
  *
  * The given mapping function must be a stateless mapping function, if not,
  * the outgoing stream will enter into a undecidable state after a reset of the
  * query.
  *
  * @param mapper - A mapping function to use for mapping ingoing values to outgoing values.
  */
  public constructor (mapper : UnidocMapper<Input, Output>) {
    this.output = Sink.NONE
    this.mapper = mapper
    this._index = 0
  }

  /**
  * @see UnidocQuery.start
  */
  public start () : void {
    this.output.start()
  }

  /**
  * @see UnidocQuery.next
  */
  public next (value : Input) : void {
    this.output.next(this.mapper(value, this._index))
    this._index += 1
  }

  /**
  * @see UnidocQuery.error
  */
  public error (error : Error) : void {
    this.output.error(error)
  }

  /**
  * @see UnidocQuery.complete
  */
  public complete () : void {
    this.output.complete()
  }

  /**
  * @see UnidocQuery.reset
  */
  public reset () : void {
    this._index = 0
  }

  /**
  * @see UnidocQuery.clear
  */
  public clear () : void {
    this.output = Sink.NONE
    this._index = 0
  }

  /**
  * @see UnidocQuery.clone
  */
  public clone () : MappingQuery<Input, Output> {
    const result : MappingQuery<Input, Output> = new MappingQuery<Input, Output>(this.mapper)

    result._index = this._index
    result.output = this.output

    return result
  }

  /**
  * @see UnidocQuery.toString
  */
  public toString () : string {
    return 'map:' + this.mapper.toString()
  }
}
