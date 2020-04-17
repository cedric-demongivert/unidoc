import { UnidocEvent } from '../event/UnidocEvent'

import { UnidocSelector } from './UnidocSelector'

export class UnionSelector implements UnidocSelector {
  /**
  * Operands of this union.
  */
  public readonly operands : UnidocSelector[]

  /**
  * Instantiate a new union.
  *
  * @param operands - Operands of the union to instantiate.
  */
  public constructor (operands? : Iterable<UnidocSelector>) {
    this.operands = []

    if (operands) {
      for (const operand of operands) {
        if (operand instanceof UnionSelector) {
          for (const element of operand.operands) {
            this.operands.push(element)
          }
        } else {
          this.operands.push(operand)
        }
      }
    }

    Object.freeze(this.operands)
  }

  /**
  * Return a new union that also contains the given selectors.
  *
  * If one of the given selectors is also a conjunction, both conjunction will
  * be merged in one selector.
  *
  * @param operand - Operand to add to this interesection.
  *
  * @return A new interesection that also contains the given selectors.
  */
  public union (...operands : UnidocSelector[]) : UnionSelector {
    const result : UnidocSelector[] = []

    for (const operand of this.operands) {
      result.push(operand.clone())
    }

    for (const operand of operands) {
      if (operand instanceof UnionSelector) {
        for (const childOperand of operand.operands) {
          operands.push(childOperand.clone())
        }
      } else {
        operands.push(operand.clone())
      }
    }

    return new UnionSelector(result)
  }

  /**
  * @see UnidocSelector.next
  */
  public next (event: UnidocEvent) : boolean {
    let result : boolean = false

    for (const operand of this.operands) {
      result = result || operand.next(event)
    }

    return result
  }

  /**
  * @see UnidocSelector.reset
  */
  public reset () : void {
    for (const operand of this.operands) {
      operand.reset()
    }
  }

  /**
  * @see UnidocSelector.clone
  */
  public clone () : UnionSelector {
    return new UnionSelector(this.operands.map(x => x.clone()))
  }

  /**
  * @see UnidocSelector.toString
  */
  public toString () : string {
    let result : string = '('

    for (let index = 0, size = this.operands.length; index < size; ++index) {
      if (index > 0) {
        result += ' OR '
      }

      result += this.operands[index].toString()
    }

    return result + ')'
  }
}
