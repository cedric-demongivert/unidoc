import { UnidocQuery } from './UnidocQuery'
import { nothing } from './nothing'

export class ChainedQuery<Input, Join, Output> implements UnidocQuery<Input, Output>
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
    this.handleNextValue = this.handleNextValue.bind(this)
    this.handleCompletion = this.handleCompletion.bind(this)

    this.to = to
    this.to.resultListener = this.handleNextValue
    this.to.completionListener = this.handleCompletion

    this.from = from
    this.from.resultListener = this.to.next.bind(this.to)
    this.from.completionListener = this.to.complete.bind(this.to)
  }

  /**
  * @see UnidocQuery.start
  */
  public start () : void {
    this.from.start()
    this.to.start()
  }

  /**
  * @see UnidocQuery.next
  */
  public next (value : Input) : void {
    this.from.next(value)
  }

  /**
  * @see UnidocQuery.complete
  */
  public complete () : void {
    this.from.complete()
  }

  private handleNextValue (value : Output) : void {
    this.resultListener(value)
  }

  private handleCompletion () : void {
    this.completionListener()
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
    this.to.resultListener = this.handleNextValue
    this.to.completionListener = this.handleCompletion
    this.from.resultListener = this.to.next.bind(this.to)
    this.from.completionListener = this.to.complete.bind(this.to)

    this.resultListener = nothing
    this.completionListener = nothing
  }

  /**
  * @see UnidocQuery.clone
  */
  public clone () : ChainedQuery<Input, Join, Output> {
    const result : ChainedQuery<Input, Join, Output> = new ChainedQuery<Input, Join, Output>(this.from.clone(), this.to.clone())

    result.resultListener = this.resultListener
    result.completionListener = this.completionListener

    return result
  }

  /**
  * @see UnidocQuery.toString
  */
  public toString () : string {
    return this.from.toString() + ' then ' + this.to.toString()
  }
}
