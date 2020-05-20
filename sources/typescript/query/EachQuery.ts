import { CircularBuffer } from '@cedric-demongivert/gl-tool-collection'
import { Pack } from '@cedric-demongivert/gl-tool-collection'

import { UnidocQuery } from './UnidocQuery'
import { nothing } from './nothing'

const COMPLETED : symbol = Symbol('completed')

export class EachQuery<Input, Output> implements UnidocQuery<Input, Pack<Output>> {
  /**
  * A listener called when a value is published by this query.
  */
  public resultListener : UnidocQuery.ResultListener<Pack<Output>>

  /**
  * A listener called when the output stream of this query reach it's end.
  */
  public completionListener : UnidocQuery.CompletionListener

  /**
  * Operands of this conjunction.
  */
  public readonly operands : UnidocQuery<Input, Output>[]

  /**
  * Operands result buffers.
  */
  private readonly _buffers : CircularBuffer<Output | symbol>[]

  /**
  * Operands result buffers.
  */
  private readonly _result : Pack<Output>

  /**
  * Number of buffers that contains a value.
  */
  private _filled : number

  /**
  * Instantiate a new conjunction.
  *
  * @param operands - Operands of the conjunction to instantiate.
  */
  public constructor (operands? : Iterable<UnidocQuery<Input, Output>>) {
    this.operands = []
    this._buffers = []

    if (operands) {
      for (const operand of operands) {
        if (operand instanceof EachQuery) {
          for (const element of operand.operands) {
            this.operands.push(element)
          }
        } else {
          this.operands.push(operand)
        }
      }
    }

    for (let index = 0, size = this.operands.length; index < size; ++index) {
      const operand : UnidocQuery<Input, Output> = this.operands[index]

      operand.resultListener = this.handleNextValue.bind(this, index)
      operand.completionListener = this.handleCompletion.bind(this, index)

      this._buffers.push(CircularBuffer.any(16))
    }

    this.resultListener = nothing
    this.completionListener = nothing

    this._filled = 0
    this._result = Pack.any(this.operands.length)

    Object.freeze(this.operands)
  }

  private handleNextValue (index : number, value : Output) : void {
    const buffer : CircularBuffer<Output | symbol> = this._buffers[index]

    if (buffer.capacity === buffer.size) {
      buffer.reallocate(buffer.capacity * 2)
    }

    buffer.push(value)
    this._filled += buffer.size === 1 ? 1 : 0

    this.resolve()
  }

  private handleCompletion (index : number) : void {
    const buffer : CircularBuffer<Output | symbol> = this._buffers[index]

    if (buffer.capacity === buffer.size) {
      buffer.reallocate(buffer.capacity * 2)
    }

    buffer.push(COMPLETED)
    this._filled += buffer.size === 1 ? 1 : 0

    this.resolve()
  }

  private computeNextState () : boolean {
    let completed : boolean = true

    for (let index = 0, size = this.operands.length; index < size; ++index) {
      const buffer : CircularBuffer<Output | symbol> = this._buffers[index]
      const value  : Output | symbol = buffer.first

      if (value === COMPLETED) {
        this._result.set(index, undefined)
      } else {
        completed = false
        this._result.set(index, buffer.shift() as Output)
        this._filled -= buffer.size === 0 ? 1 : 0
      }
    }

    return completed
  }

  private resolve () : void {
    while (this._filled === this.operands.length) {
      if (this.computeNextState()) {
        this.completionListener()
        this._filled = 0
      } else {
        this.resultListener(this._result)
      }
    }
  }

  /**
  * @see UnidocQuery.start
  */
  public start () : void {
    for (const operand of this.operands) {
      operand.start()
    }
  }

  /**
  * @see UnidocQuery.next
  */
  public next (value : Input) : void {
    for (const operand of this.operands) {
      operand.next(value)
    }
  }

  /**
  * @see UnidocQuery.complete
  */
  public complete () : void {
    for (const operand of this.operands) {
      operand.complete()
    }
  }

  /**
  * @see UnidocQuery.reset
  */
  public reset () : void {
    for (let index = 0, size = this.operands.length; index < size; ++index) {
      this.operands[index].reset()
      this._buffers[index].clear()
    }

    this._filled = 0
  }

  /**
  * @see UnidocQuery.clear
  */
  public clear () : void {
    for (let index = 0, size = this.operands.length; index < size; ++index) {
      const operand : UnidocQuery<Input, Output> = this.operands[index]

      operand.clear()
      operand.resultListener = this.handleNextValue.bind(this, index)
      operand.completionListener = this.handleCompletion.bind(this, index)

      this._buffers[index].clear()
    }

    this.resultListener = nothing
    this.completionListener = nothing

    this._filled = 0
  }

  /**
  * @see UnidocQuery.clone
  */
  public clone () : EachQuery<Input, Output> {
    const result : EachQuery<Input, Output> = new EachQuery<Input, Output>(this.operands.map(x => x.clone()))

    for (let index = 0, size = this.operands.length; index < size; ++index) {
      result._buffers[index].copy(this._buffers[index])
    }

    result._filled = this._filled
    result.resultListener = this.resultListener
    result.completionListener = this.completionListener

    return result
  }

  /**
  * @see UnidocQuery.toString
  */
  public toString () : string {
    return 'each (' + this.operands.join(', ') + ')'
  }
}
