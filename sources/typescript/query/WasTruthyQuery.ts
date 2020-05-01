import { UnidocEvent } from '../event/UnidocEvent'

import { UnidocQuery } from './UnidocQuery'
import { UnaryOperator } from './UnaryOperator'
import { BasicQuery } from './BasicQuery'

export class WasTruthyQuery
       extends BasicQuery<boolean>
       implements UnaryOperator<boolean, boolean>
{
  /**
  * @see UnaryOperator.operand
  */
  public readonly operand : UnidocQuery<boolean>

  private _state : boolean

  /**
  * Instantiate a new negation.
  *
  * @param operand - Operand of the negation to instantiate.
  */
  public constructor (operand : UnidocQuery<boolean>) {
    super()

    this.operand = operand
    this._state = false

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
    if (!this._state && value) {
      this._state = true
      this.emit(true)
      this.emitCompletion()
    }
  }

  /**
  * Called when the operand stream of boolean value ends.
  */
  private handleCompletion () : void {
    if (!this._state) {
      this.emit(false)
      this.emitCompletion()
    }
  }

  /**
  * @see UnidocQuery.reset
  */
  public reset () : void {
    this.operand.reset()
    this._state = false
  }

  /**
  * @see UnidocQuery.clone
  */
  public clone () : WasTruthyQuery {
    const result : WasTruthyQuery = new WasTruthyQuery(this.operand.clone())

    result._state = this._state
    result.copy(this)

    return result
  }

  /**
  * @see UnidocQuery.toString
  */
  public toString () : string {
    return 'WAS ' + this.operand.toString() + ' TRUTHY'
  }
}
