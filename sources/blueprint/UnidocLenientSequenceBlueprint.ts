import { Pack } from '@cedric-demongivert/gl-tool-collection'

import { UnidocBlueprintType } from './UnidocBlueprintType'
import { UnidocBlueprint } from './UnidocBlueprint'

/**
*
*/
export class UnidocLenientSequenceBlueprint implements UnidocBlueprint {
  /**
  * @see UnidocBlueprint.type
  */
  public readonly type: UnidocBlueprintType

  /**
  *
  */
  public readonly operands: Pack<UnidocBlueprint>

  public constructor(capacity: number = 8) {
    this.type = UnidocBlueprintType.LENIENT_SEQUENCE
    this.operands = Pack.any(capacity)
  }

  /**
  * @see UnidocSequentialBlueprint.then
  */
  public then(value: UnidocBlueprint): UnidocLenientSequenceBlueprint {
    this.operands.push(value)
    return this
  }

  public clear(): void {
    this.operands.clear()
  }

  public copy(toCopy: UnidocLenientSequenceBlueprint): void {
    this.operands.copy(toCopy.operands)
  }

  /**
  * @see UnidocBlueprint.equals
  */
  public equals(other: any, maybeVisited?: Set<UnidocBlueprint>): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocLenientSequenceBlueprint) {
      if (other.operands.size !== this.operands.size) {
        return false
      }

      const visited: Set<UnidocBlueprint> = maybeVisited || new Set()

      if (!visited.has(this)) {
        visited.add(this)

        for (let index = 0; index < this.operands.size; ++index) {
          if (!this.operands.get(index).equals(other.operands.get(index), visited)) {
            return false
          }
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

    if (maxDepth > 0 || this.operands.size === 0) {
      for (let index = 0; index < this.operands.size; ++index) {
        result += '\r\n\t'
        result += (
          this.operands.get(index).toString(maxDepth - 1, visited)
            .replace(/^(\r\n|\r|\n)/gm, '$1\t')
        )
      }
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

export namespace UnidocLenientSequenceBlueprint {
  export function create(): UnidocLenientSequenceBlueprint {
    return new UnidocLenientSequenceBlueprint()
  }
}
