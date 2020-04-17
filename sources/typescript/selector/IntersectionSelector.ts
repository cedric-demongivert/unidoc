import { UnidocEvent } from '../event/UnidocEvent'

import { UnidocSelector } from './UnidocSelector'

export class IntersectionSelector implements UnidocSelector {
  /**
  * Operands of this intersection.
  */
  public readonly operands : UnidocSelector[]

  /**
  * Instantiate a new intersection.
  *
  * @param operands - Operands of the intersection to instantiate.
  */
  public constructor (operands? : Iterable<UnidocSelector>) {
    this.operands = []

    if (operands) {
      for (const operand of operands) {
        if (operand instanceof IntersectionSelector) {
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
  * Return a new intersection that also contains the given selectors.
  *
  * If one of the given selectors is also a conjunction, both conjunction will
  * be merged in one selector.
  *
  * @param operand - Operand to add to this interesection.
  *
  * @return A new interesection that also contains the given selectors.
  */
  public intersect (...operands : UnidocSelector[]) : IntersectionSelector {
    const result : UnidocSelector[] = []

    for (const operand of this.operands) {
      result.push(operand.clone())
    }

    for (const operand of operands) {
      if (operand instanceof IntersectionSelector) {
        for (const childOperand of operand.operands) {
          operands.push(childOperand.clone())
        }
      } else {
        operands.push(operand.clone())
      }
    }

    return new IntersectionSelector(result)
  }

  /**
  * @see UnidocSelector.next
  */
  public next (event: UnidocEvent) : boolean {
    let result : boolean = true

    for (const operand of this.operands) {
      result = result && operand.next(event)
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
  public clone () : IntersectionSelector {
    return new IntersectionSelector(this.operands.map(x => x.clone()))
  }

  /**
  * @see UnidocSelector.toString
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
