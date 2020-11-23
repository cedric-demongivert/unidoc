import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocPredicate } from '../predicate/UnidocPredicate'

import { UnidocBlueprintType } from './UnidocBlueprintType'
import { UnidocBlueprint } from './UnidocBlueprint'
import { UnidocSequenceBlueprint } from './UnidocSequenceBlueprint'

/**
*
*/
export class UnidocTagBlueprint implements UnidocBlueprint {
  /**
  * @see UnidocBlueprint.type
  */
  public readonly type: UnidocBlueprintType

  /**
  *
  */
  public predicate: UnidocPredicate<UnidocEvent>

  /**
  *
  */
  public operand: UnidocBlueprint

  /**
  *
  */
  public constructor() {
    this.type = UnidocBlueprintType.TAG
    this.predicate = UnidocPredicate.anything()
    this.operand = UnidocSequenceBlueprint.empty()
  }

  /**
  *
  */
  public thatMatch(predicate: UnidocPredicate<UnidocEvent>): UnidocTagBlueprint {
    this.predicate = predicate
    return this
  }

  /**
  *
  */
  public withContent(operand: UnidocBlueprint): UnidocTagBlueprint {
    this.operand = operand
    return this
  }

  /**
  *
  */
  public copy(toCopy: UnidocTagBlueprint): void {
    this.predicate = toCopy.predicate
    this.operand = toCopy.operand
  }

  /**
  *
  */
  public clear(): void {
    this.predicate = UnidocPredicate.anything()
    this.operand = UnidocSequenceBlueprint.empty()
  }

  /**
  * @see UnidocBlueprint.equals
  */
  public equals(other: any, maybeVisited?: Set<UnidocBlueprint>): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocTagBlueprint) {
      if (!other.predicate.equals(other.predicate)) {
        return false
      }

      const visited: Set<UnidocBlueprint> = maybeVisited || new Set()

      if (!visited.has(this)) {
        visited.add(this)

        if (this.operand.equals(other.operand, visited)) {
          return false
        }
      }

      return true
    }

    return false
  }

  /**
  * @see UnidocBlueprint.toString
  */
  public toString(maxDepth: number = Number.POSITIVE_INFINITY, maybeVisited?: Map<UnidocBlueprint, string>): string {
    const visited: Map<UnidocBlueprint, string> = maybeVisited || new Map()

    if (visited.has(this)) {
      return '| @' + visited.get(this)
    } else {
      visited.set(this, visited.size.toString())
    }

    let result: string = '+ '
    result += visited.get(this)
    result += ': '
    result += this.constructor.name
    result += ' '
    result += this.predicate.toString()

    if (maxDepth > 0) {
      result += '\r\n\t'
      result += (
        this.operand.toString(maxDepth - 1, visited)
          .replace(/^(\r\n|\r|\n)/gm, '$1\t')
      )
    } else {
      result += '\r\n\t...\r\n'
    }

    result += '- '
    result += visited.get(this)
    result += ': '
    result += this.constructor.name

    return result
  }
}

export namespace UnidocTagBlueprint {
  export function create(): UnidocTagBlueprint {
    return new UnidocTagBlueprint()
  }
}
