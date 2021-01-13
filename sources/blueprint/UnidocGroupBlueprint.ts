import { UnidocBlueprintType } from './UnidocBlueprintType'
import { UnidocBlueprint } from './UnidocBlueprint'
import { UnidocSequenceBlueprint } from './UnidocSequenceBlueprint'

/**
*
*/
export class UnidocGroupBlueprint implements UnidocBlueprint {
  /**
  * @see UnidocBlueprint.type
  */
  public readonly type: UnidocBlueprintType

  /**
  * The group label.
  */
  public group: any

  /**
  * A description of the content of the group.
  */
  public operand: UnidocBlueprint

  /**
  *
  */
  public constructor() {
    this.type = UnidocBlueprintType.GROUP
    this.group = 0
    this.operand = UnidocSequenceBlueprint.empty()
  }

  /**
  *
  */
  public of(operand: UnidocBlueprint): UnidocGroupBlueprint {
    this.operand = operand
    return this
  }

  /**
  *
  */
  public as(group: any): UnidocGroupBlueprint {
    this.group = group
    return this
  }

  /**
  *
  */
  public copy(toCopy: UnidocGroupBlueprint): void {
    this.group = toCopy.group
    this.operand = toCopy.operand
  }

  /**
  *
  */
  public clear(): void {
    this.group = 0
    this.operand = UnidocSequenceBlueprint.empty()
  }

  /**
  * @see UnidocBlueprint.equals
  */
  public equals(other: any, maybeVisited?: Set<UnidocBlueprint>): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocGroupBlueprint) {
      if (this.group !== other.group) {
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
    result += ' as '
    result += this.group

    if (maxDepth > 0) {
      result += '\r\n\t'
      result += (
        this.operand.toString(maxDepth - 1, visited)
          .replace(/^(\r\n|\r|\n)/gm, '$1\t')
      )
    } else {
      result += '\r\n\t...'
    }

    result += '\r\n- '
    result += visited.get(this)
    result += ': '
    result += this.constructor.name

    return result
  }
}

export namespace UnidocGroupBlueprint {
  /**
  *
  */
  export function create(): UnidocGroupBlueprint {
    return new UnidocGroupBlueprint()
  }
}
