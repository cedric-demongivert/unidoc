import { UnidocEvent } from '../event/UnidocEvent'

import { UnidocQuery } from './UnidocQuery'
import { UnaryOperator } from './UnaryOperator'
import { BasicQuery } from './BasicQuery'

export class HeadQuery<Output>
       extends BasicQuery<Output>
       implements UnaryOperator<Output, Output>
{
  /**
  * @see UnaryOperator.operand
  */
  public readonly operand : UnidocQuery<Output>

  /**
  * Number of element to return.
  */
  public readonly count : number

  /**
  * Number of element returned.
  */
  private _current : number

  /**
  * Instantiate a new head query.
  *
  * @param operand - Operand of the head query to instantiate.
  * @param count - Number of elements to return.
  */
  public constructor (operand : UnidocQuery<Output>, count : number) {
    super()

    this.operand = operand
    this.count = count
    this._current = 0

    this.handleNextValue = this.handleNextValue.bind(this)
    this.handleCompletion = this.handleCompletion.bind(this)

    this.operand.addEventListener('next', this.handleNextValue)
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
  public next (event : UnidocEvent) : void {
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
  private handleNextValue (value : Output) : void {
    if (this._current < this.count) {
      this._current += 1
      this.emit(value)

      if (this._current === this.count) {
        this.emitCompletion()
      }
    }
  }

  /**
  * Called when the operand stream of boolean value ends.
  */
  private handleCompletion () : void {
    if (this._current < this.count) {
      this.emitCompletion()
      this._current = this.count
    }
  }

  /**
  * @see UnidocQuery.reset
  */
  public reset () : void {
    this.operand.reset()
    this._current = 0
  }

  /**
  * @see UnidocQuery.clone
  */
  public clone () : HeadQuery<Output> {
    const result : HeadQuery<Output> = new HeadQuery<Output>(this.operand.clone(), this.count)

    result._current = this._current
    result.copy(this)

    return result
  }

  /**
  * @see UnidocQuery.toString
  */
  public toString () : string {
    return 'FIRST ' + this.count + ' OF ' + this.operand.toString()
  }
}
