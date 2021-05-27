import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocPredicate } from '../predicate/UnidocPredicate'

import { UnidocBlueprintType } from './UnidocBlueprintType'
import { UnidocBlueprint } from './UnidocBlueprint'

const ANYTHING: RegExp = /.*/

export class UnidocRegexpBlueprint implements UnidocBlueprint {
  /**
  * @see UnidocBlueprint.type
  */
  public readonly type: UnidocBlueprintType

  /**
  *
  */
  public regexp: RegExp

  /**
  *
  */
  public constructor() {
    this.type = UnidocBlueprintType.REGEXP
    this.regexp = ANYTHING
  }

  /**
  *
  */
  public thatMatch(regexp: RegExp): UnidocRegexpBlueprint {
    this.regexp = regexp
    return this
  }

  /**
  *
  */
  public copy(toCopy: UnidocRegexpBlueprint): void {
    this.regexp = toCopy.regexp
  }

  /**
  *
  */
  public clear(): void {
    this.regexp = ANYTHING
  }

  /**
  * @see UnidocBlueprint.equals
  */
  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocRegexpBlueprint) {
      return this.regexp === other.regexp
    }

    return false
  }

  /**
  * @see UnidocBlueprint.toString
  */
  public toString(): string {
    return '| ' + this.constructor.name + ' ' + this.regexp.toString()
  }
}

export namespace UnidocRegexpBlueprint {
  /**
  *
  */
  export function create(): UnidocRegexpBlueprint {
    return new UnidocRegexpBlueprint()
  }
}
