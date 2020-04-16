import { UnidocEvent } from '../event/UnidocEvent'

import { UnidocAssertion } from './UnidocAssertion'

const EMPTY_ARRAY : UnidocAssertion[] = []

export class Conjunction implements UnidocAssertion {
  /**
  * State of this assertion.
  */
  private _state : boolean

  /**
  * Operands of this conjunction.
  */
  private _operands : UnidocAssertion[]

  /**
  * Instantiate a new conjunction.
  *
  * @param [operands = []] - Operands of the conjunction to instantiate.
  */
  public constructor (operands : Iterable<UnidocAssertion> = EMPTY_ARRAY) {
    this._state = true
    this._operands = []

    for (const operand of operands) {
      if (operand instanceof Conjunction) {
        for (const element of operand._operands) {
          this._operands.push(element)
          this._state = this._state && element.state
        }
      } else {
        this._operands.push(operand)
        this._state = this._state && operand.state
      }
    }
  }

  /**
  * Return a new conjunction that also contains the given operand.
  *
  * If the given operand is also a conjunction, both conjunction will be
  * merged in one operator.
  *
  * @param operand - Operand to add to this conjunction.
  *
  * @return A new conjunction that also contains the given assertion.
  */
  public and (operand : UnidocAssertion) : Conjunction {
    const operands : UnidocAssertion[] = []

    for (const element of this._operands) {
      operands.push(element.clone())
    }

    if (operand instanceof Conjunction) {
      for (const element of operand._operands) {
        operands.push(element.clone())
      }
    } else {
      operands.push(operand.clone())
    }

    return new Conjunction(operands)
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
    this._state = true

    for (const operand of this._operands) {
      this._state = this._state && operand.next(event)
    }

    return this._state
  }

  /**
  * @see UnidocAssertion.complete
  */
  public complete () : boolean {
    this._state = true

    for (const operand of this._operands) {
      this._state = this._state && operand.complete()
    }

    return this._state
  }

  /**
  * @see UnidocAssertion.reset
  */
  public reset () : boolean {
    this._state = true

    for (const operand of this._operands) {
      this._state = this._state && operand.reset()
    }

    return this._state
  }

  /**
  * @see UnidocAssertion.clone
  */
  public clone () : Conjunction {
    return new Conjunction(this._operands.map(x => x.clone()))
  }

  /**
  * @see Object.toString
  */
  public toString () : string {
    let result : string = '('

    for (let index = 0, size = this._operands.length; index < size; ++index) {
      if (index > 0) {
        result += ' AND '
      }

      result += this._operands[index].toString()
    }

    return result + ')'
  }
}
