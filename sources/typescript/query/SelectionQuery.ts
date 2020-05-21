import { CircularBuffer } from '@cedric-demongivert/gl-tool-collection'
import { Pack } from '@cedric-demongivert/gl-tool-collection'

import { UnidocEvent } from '../event/UnidocEvent'

import { UnidocQuery } from './UnidocQuery'
import { nothing } from './nothing'

export class SelectionQuery implements UnidocQuery<UnidocEvent, UnidocEvent>
{
  /**
  * A listener called when a value is published by this query.
  */
  public resultListener : UnidocQuery.ResultListener<UnidocEvent>

  /**
  * A listener called when the output stream of this query reach it's end.
  */
  public completionListener : UnidocQuery.CompletionListener

  /**
  * @see UnaryOperator.operand
  */
  public readonly operand : UnidocQuery<UnidocEvent, boolean>

  private readonly _buffer : CircularBuffer<UnidocEvent>

  /**
  * Instantiate a new chain.
  *
  * @param operand - Operand of the negation to instantiate.
  */
  public constructor (operand : UnidocQuery<UnidocEvent, boolean>) {
    this.handleNextValue = this.handleNextValue.bind(this)
    this.handleCompletion = this.handleCompletion.bind(this)

    this.operand = operand
    this.operand.resultListener = this.handleNextValue
    this.operand.completionListener = this.handleCompletion

    this._buffer = CircularBuffer.fromPack(Pack.instance(UnidocEvent.ALLOCATOR, 16))
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
  public next (value : UnidocEvent) : void {
    this._buffer.push(value)
    this.operand.next(value)
  }

  /**
  * @see UnidocQuery.complete
  */
  public complete () : void {
    this.operand.complete()
  }

  private handleNextValue (value : boolean) : void {
    if (value) {
      this.resultListener(this._buffer.shift())
    } else {
      this._buffer.shift()
    }
  }

  private handleCompletion () : void {
    this.completionListener()
    this._buffer.clear()
  }

  /**
  * @see UnidocQuery.reset
  */
  public reset () : void {
    this.operand.reset()
    this._buffer.clear()
  }

  /**
  * @see UnidocQuery.clear
  */
  public clear () : void {
    this.operand.clear()
    this.operand.resultListener = this.handleNextValue
    this.operand.completionListener = this.handleCompletion

    this._buffer.clear()

    this.resultListener = nothing
    this.completionListener = nothing
  }

  /**
  * @see UnidocQuery.clone
  */
  public clone () : SelectionQuery {
    const result : SelectionQuery = new SelectionQuery(this.operand.clone())

    result.resultListener = this.resultListener
    result.completionListener = this.completionListener

    return result
  }

  /**
  * @see UnidocQuery.toString
  */
  public toString () : string {
    return 'select (' + this.operand + ')'
  }
}
