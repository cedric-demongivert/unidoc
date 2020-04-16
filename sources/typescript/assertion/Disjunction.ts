import { UnidocEvent } from '../event/UnidocEvent'

import { UnidocAssertion } from './UnidocAssertion'

const EMPTY_ARRAY : UnidocAssertion[] = []

export class Disjunction implements UnidocAssertion {
  /**
  * State of this assertion.
  */
  private _state : boolean

  /**
  * Operands of the disjunction in order.
  */
  private _operands : UnidocAssertion[]

  /**
  * Instantiate a new disjunction.
  *
  * @param [operands = []] - Operands of the disjunction to instantiate.
  */
  public constructor (operands : Iterable<UnidocAssertion> = EMPTY_ARRAY) {
    this._state = false
    this._operands = []

    for (const operand of operands) {
      if (operand instanceof Disjunction) {
        for (const element of operand._operands) {
          this._operands.push(element)
          this._state = this._state || element.state
        }
      } else {
        this._operands.push(operand)
        this._state = this._state || operand.state
      }
    }
  }

  /**
  * Return a new disjunction that also contains the given operand.
  *
  * If the given operand is also a disjunction, both disjunction will be
  * merged in one operator.
  *
  * @param operand - Operand to add to this disjunction.
  *
  * @return A new disjunction that also contains the given assertion.
  */
  public or (operand : UnidocAssertion) : Disjunction {
    const operands : UnidocAssertion[] = []

    for (const element of this._operands) {
      operands.push(element.clone())
    }

    if (operand instanceof Disjunction) {
      for (const element of operand._operands) {
        operands.push(element.clone())
      }
    } else {
      operands.push(operand.clone())
    }

    return new Disjunction(operands)
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
    this._state = false

    for (const operand of this._operands) {
      this._state = this._state || operand.next(event)
    }

    return this._state
  }

  /**
  * @see UnidocAssertion.complete
  */
  public complete () : boolean {
    this._state = false

    for (const operand of this._operands) {
      this._state = this._state || operand.complete()
    }

    return this._state
  }

  /**
  * @see UnidocAssertion.reset
  */
  public reset () : boolean {
    this._state = false

    for (const operand of this._operands) {
      this._state = this._state || operand.reset()
    }

    return this._state
  }

  /**
  * @see UnidocAssertion.clone
  */
  public clone () : Disjunction {
    return new Disjunction(this._operands.map(x => x.clone()))
  }

  /**
  * @see Object.toString
  */
  public toString () : string {
    let result : string = '('

    for (let index = 0, size = this._operands.length; index < size; ++index) {
      if (index > 0) {
        result += ' OR '
      }

      result += this._operands[index].toString()
    }

    return result + ')'
  }
}
