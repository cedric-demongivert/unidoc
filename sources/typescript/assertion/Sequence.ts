import { UnidocEvent } from '../event/UnidocEvent'

import { UnidocAssertion } from './UnidocAssertion'

const EMPTY_ARRAY : UnidocAssertion[] = []

export class Sequence implements UnidocAssertion {
  /**
  * State of this assertion.
  */
  private _state : boolean

  /**
  * Operands of the sequence in order.
  */
  private _operands : UnidocAssertion[]

  /**
  * Current index in the sequence.
  */
  private _index : number

  /**
  * Instantiate a new sequence.
  *
  * @param [operands = []] - Operands of the sequence to instantiate.
  */
  public constructor (operands : Iterable<UnidocAssertion> = EMPTY_ARRAY) {
    this._operands = [...operands]

    let index : number = 0

    while (index < this._operands.length && this._operands[index].state) {
      index += 1
    }

    this._state = index === this._operands.length
    this._index = index
  }

  /**
  * @see UnidocAssertion.state
  */
  public get state () : boolean {
    return this._state
  }

  /**
  * @see UnidocAssertion.next
  */
  public next (event: UnidocEvent) : boolean {
    if (!this._state) {
      const operand : UnidocAssertion = this._operands[this._index]

      if (operand.next(event)) {
        this._index += 1
      }

      this._state = this._index === this._operands.length
    }

    return this._state
  }

  /**
  * @see UnidocAssertion.complete
  */
  public complete () : boolean {
    if (!this._state) {
      const operand : UnidocAssertion = this._operands[this._index]

      if (operand.complete()) {
        this._index += 1
      }

      this._state = this._index === this._operands.length
    }

    return this._state
  }

  /**
  * @see UnidocAssertion.reset
  */
  public reset () : boolean {
    for (const operand of this._operands) {
      operand.reset()
    }

    let index : number = 0

    while (index < this._operands.length && this._operands[index].state) {
      index += 1
    }

    this._state = index === this._operands.length
    this._index = index

    return this._state
  }

  /**
  * @see UnidocAssertion.clone
  */
  public clone () : Sequence {
    return new Sequence(this._operands.map(x => x.clone()))
  }

  /**
  * @see Object.toString
  */
  public toString () : string {
    let result : string = '('

    for (let index = 0, size = this._operands.length; index < size; ++index) {
      if (index > 0) {
        result += ' THEN '
      }

      result += this._operands[index].toString()
    }

    return result + ')'
  }
}
