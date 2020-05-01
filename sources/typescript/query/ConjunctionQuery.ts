import { CircularBuffer } from '@cedric-demongivert/gl-tool-collection'

import { UnidocEvent } from '../event/UnidocEvent'

import { UnidocQuery } from './UnidocQuery'
import { BasicQuery } from './BasicQuery'

const FALSE    : number = 0
const TRUE     : number = 1
const COMPLETE : number = 2

export class ConjunctionQuery extends BasicQuery<boolean> {
  /**
  * Operands of this conjunction.
  */
  public readonly operands : UnidocQuery<boolean>[]

  /**
  * Operands result buffers.
  */
  private readonly _buffers : CircularBuffer<number>[]

  /**
  * Number of buffers that contains a value.
  */
  private _filled : number

  /**
  * Instantiate a new conjunction.
  *
  * @param operands - Operands of the conjunction to instantiate.
  */
  public constructor (operands? : Iterable<UnidocQuery<boolean>>) {
    super()
    this.operands = []
    this._buffers = []

    if (operands) {
      for (const operand of operands) {
        if (operand instanceof ConjunctionQuery) {
          for (const element of operand.operands) {
            this.operands.push(element)
          }
        } else {
          this.operands.push(operand)
        }
      }
    }

    for (let index = 0, size = this.operands.length; index < size; ++index) {
      const operand : UnidocQuery<boolean> = this.operands[index]

      operand.addEventListener('next', this.handleNextValue.bind(this, index))
      operand.addEventListener('complete', this.handleCompletion.bind(this, index))
      this._buffers.push(CircularBuffer.uint8(16))
    }

    this._filled = 0

    Object.freeze(this.operands)
  }

  /**
  * Return a new conjunction that also contains the given operators.
  *
  * If one of the given operators is also a conjunction, both conjunctions will
  * be merged in one operator.
  *
  * @param operand - Operand to add to this conjunction.
  *
  * @return A new conjunction that also contains the given operators.
  */
  public and (...operands : UnidocQuery<boolean>[]) : ConjunctionQuery {
    const result : UnidocQuery<boolean>[] = []

    for (const operand of this.operands) {
      result.push(operand.clone())
    }

    for (const operand of operands) {
      if (operand instanceof ConjunctionQuery) {
        for (const childOperand of operand.operands) {
          operands.push(childOperand.clone())
        }
      } else {
        operands.push(operand.clone())
      }
    }

    return new ConjunctionQuery(result)
  }

  private handleNextValue (index : number, value : boolean) : void {
    const buffer : CircularBuffer<number> = this._buffers[index]

    if (buffer.capacity === buffer.size) {
      buffer.reallocate(buffer.capacity * 2)
    }

    buffer.push(value ? TRUE : FALSE)
    this._filled += buffer.size === 1 ? 1 : 0

    this.resolve()
  }

  private handleCompletion (index : number) : void {
    const buffer : CircularBuffer<number> = this._buffers[index]

    if (buffer.capacity === buffer.size) {
      buffer.reallocate(buffer.capacity * 2)
    }

    buffer.push(COMPLETE)
    this._filled += buffer.size === 1 ? 1 : 0

    this.resolve()
  }

  private computeNextState () : number {
    let state : number = COMPLETE

    for (let index = 0, size = this.operands.length; index < size; ++index) {
      const buffer : CircularBuffer<number> = this._buffers[index]

      switch (buffer.first) {
        case TRUE:
          state = state === COMPLETE ? (index > 0 ? FALSE : TRUE) : state
          buffer.shift()
          break
        case FALSE:
          state = FALSE
          buffer.shift()
          break
        default:
          state = state === TRUE ? FALSE : state
          break
      }

      this._filled -= buffer.size === 0 ? 1 : 0
    }

    if (state === COMPLETE) {
      for (const buffer of this._buffers) {
        buffer.clear()
      }
      this._filled = 0
    }

    return state
  }

  private resolve () : void {
    while (this._filled === this.operands.length) {
      let state : number = this.computeNextState()

      switch (state) {
        case TRUE:
          this.emit(true)
          break
        case COMPLETE:
          this.emitCompletion()
          break
        case FALSE:
        default:
          this.emit(false)
          break
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
  public next (event: UnidocEvent) : void {
    for (const operand of this.operands) {
      operand.next(event)
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
  * @see UnidocQuery.clone
  */
  public clone () : ConjunctionQuery {
    const result : ConjunctionQuery = new ConjunctionQuery(this.operands.map(x => x.clone()))

    for (let index = 0, size = this.operands.length; index < size; ++index) {
      result._buffers[index].copy(this._buffers[index])
    }

    result._filled = this._filled

    result.copy(this)

    return result
  }

  /**
  * @see UnidocQuery.toString
  */
  public toString () : string {
    let result : string = '('

    for (let index = 0, size = this.operands.length; index < size; ++index) {
      if (index > 0) {
        result += ' AND '
      }

      result += this.operands[index].toString()
    }

    return result + ')'
  }
}
