import { UnidocEvent } from '../event/UnidocEvent'

import { UnidocQuery } from './UnidocQuery'
import { UnaryOperator } from './UnaryOperator'
import { BasicQuery } from './BasicQuery'

export class NegationQuery
       extends BasicQuery<boolean> 
       implements UnaryOperator<boolean, boolean>
{
  /**
  * @see UnaryOperator.operand
  */
  public readonly operand : UnidocQuery<boolean>

  /**
  * Instantiate a new negation.
  *
  * @param operand - Operand of the negation to instantiate.
  */
  public constructor (operand : UnidocQuery<boolean>) {
    super()

    this.operand = operand

    this.handleNextBoolean = this.handleNextBoolean.bind(this)
    this.handleCompletion = this.handleCompletion.bind(this)

    this.operand.addEventListener('next', this.handleNextBoolean)
    this.operand.addEventListener('complete', this.handleCompletion)
  }

  /**
  * @see UnidocQuery.start
  */
  public start () : void {
    this.operand.start()
  }

  /**
  * @see UnidocQuery.next
  */
  public next (event: UnidocEvent) : void {
    this.operand.next(event)
  }

  /**
  * @see UnidocQuery.complete
  */
  public complete () : void {
    this.operand.complete()
  }

  /**
  * Called when the operand emit it's next boolean value.
  *
  * @param value - The value emitted by the underlying operand.
  */
  private handleNextBoolean (value : boolean) : void {
    this.emit(!value)
  }

  /**
  * Called when the operand stream of boolean value ends.
  */
  private handleCompletion () : void {
    this.emitCompletion()
  }

  /**
  * @see UnidocQuery.reset
  */
  public reset () : void {
    this.operand.reset()
  }

  /**
  * @see UnidocQuery.clone
  */
  public clone () : NegationQuery {
    const result : NegationQuery = new NegationQuery(this.operand.clone())

    result.copy(this)

    return result
  }

  /**
  * @see UnidocQuery.toString
  */
  public toString () : string {
    return 'NOT ' + this.operand.toString()
  }
}
