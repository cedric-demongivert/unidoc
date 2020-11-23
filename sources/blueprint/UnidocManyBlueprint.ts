import { UnidocBlueprintType } from './UnidocBlueprintType'
import { UnidocBlueprint } from './UnidocBlueprint'
import { UnidocSequenceBlueprint } from './UnidocSequenceBlueprint'

/**
*
*/
export class UnidocManyBlueprint implements UnidocBlueprint {
  /**
  * @see UnidocBlueprint.type
  */
  public readonly type: UnidocBlueprintType

  /**
  * The minimum number of repetition that is required.
  */
  public minimum: number

  /**
  * The maximum number of repetition that is allowed.
  */
  public maximum: number

  /**
  * A description of the content that may be repeated.
  */
  public operand: UnidocBlueprint

  /**
  *
  */
  public constructor() {
    this.type = UnidocBlueprintType.MANY
    this.minimum = 0
    this.maximum = Number.POSITIVE_INFINITY
    this.operand = UnidocSequenceBlueprint.empty()
  }

  /**
  *
  */
  public between(minimum: number, maximum: number): UnidocManyBlueprint {
    this.minimum = minimum
    this.maximum = maximum
    return this
  }

  /**
  *
  */
  public optional(): UnidocManyBlueprint {
    this.minimum = 0
    this.maximum = 1
    return this
  }

  /**
  *
  */
  public atLeast(minimum: number): UnidocManyBlueprint {
    this.minimum = minimum
    return this
  }

  /**
  *
  */
  public upTo(maximum: number): UnidocManyBlueprint {
    this.maximum = maximum
    return this
  }

  /**
  *
  */
  public of(operand: UnidocBlueprint): UnidocManyBlueprint {
    this.operand = operand
    return this
  }

  /**
  *
  */
  public copy(toCopy: UnidocManyBlueprint): void {
    this.minimum = toCopy.minimum
    this.maximum = toCopy.maximum
    this.operand = toCopy.operand
  }

  /**
  *
  */
  public clear(): void {
    this.minimum = 0
    this.maximum = Number.POSITIVE_INFINITY
    this.operand = UnidocSequenceBlueprint.empty()
  }

  /**
  * @see UnidocBlueprint.equals
  */
  public equals(other: any, maybeVisited?: Set<UnidocBlueprint>): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocManyBlueprint) {
      if (this.minimum !== other.minimum || this.maximum !== other.maximum) {
        return false
      }

      const visited: Set<UnidocBlueprint> = maybeVisited || new Set()

      if (!visited.has(this)) {
        visited.add(this)

        if (!this.operand.equals(other.operand, visited)) {
          return false
        }
      }

      return true
    }

    return false
  }/**
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
    result += ' between '
    result += this.minimum
    result += ' and '
    result += this.maximum

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

export namespace UnidocManyBlueprint {
  export function create(): UnidocManyBlueprint {
    return new UnidocManyBlueprint()
  }
}
