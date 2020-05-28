import { UnidocQuery } from './UnidocQuery'
import { Sink } from './Sink'

export class ChainedQuery<Input, Join, Output> implements UnidocQuery<Input, Output>
{
  private _output : Sink<Output>

  /**
  * @see UnaryOperator.operand
  */
  public readonly from : UnidocQuery<Input, Join>

  /**
  * @see UnaryOperator.operand
  */
  public readonly to : UnidocQuery<Join, Output>

  /**
  * Instantiate a new chain.
  *
  * @param operand - Operand of the negation to instantiate.
  */
  public constructor (from : UnidocQuery<Input, Join>, to : UnidocQuery<Join, Output>) {
    this._output = Sink.NONE

    this.from = from
    this.to = to

    this.from.output = this.to
    this.to.output = this._output
  }

  public get output () : Sink<Output> {
    return this._output
  }

  public set output (value : Sink<Output>) {
    this._output = value
    this.to.output = value
  }

  /**
  * @see UnidocQuery.start
  */
  public start () : void {
    this.from.start()
  }

  /**
  * @see UnidocQuery.next
  */
  public next (value : Input) : void {
    this.from.next(value)
  }

  /**
  * @see UnidocQuery.error
  */
  public error (error : Error) : void {
    this.from.error(error)
  }

  /**
  * @see UnidocQuery.complete
  */
  public complete () : void {
    this.from.complete()
  }

  /**
  * @see UnidocQuery.reset
  */
  public reset () : void {
    this.from.reset()
    this.to.reset()
  }

  /**
  * @see UnidocQuery.clear
  */
  public clear () : void {
    this.from.clear()
    this.to.clear()

    this._output = Sink.NONE

    this.to.output = this._output
    this.from.output = this.to
  }

  /**
  * @see UnidocQuery.clone
  */
  public clone () : ChainedQuery<Input, Join, Output> {
    const result : ChainedQuery<Input, Join, Output> = new ChainedQuery<Input, Join, Output>(this.from.clone(), this.to.clone())

    result.output = this.output

    return result
  }

  /**
  * @see UnidocQuery.toString
  */
  public toString () : string {
    return this.from.toString() + ' then ' + this.to.toString()
  }
}
