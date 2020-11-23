import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocPredicate } from '../predicate/UnidocPredicate'

import { UnidocBlueprintType } from './UnidocBlueprintType'
import { UnidocBlueprint } from './UnidocBlueprint'

export class UnidocEventBlueprint implements UnidocBlueprint {
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
  public constructor() {
    this.type = UnidocBlueprintType.EVENT
    this.predicate = UnidocPredicate.anything()
  }

  /**
  *
  */
  public thatMatch(predicate: UnidocPredicate<UnidocEvent>): UnidocEventBlueprint {
    this.predicate = predicate
    return this
  }

  /**
  *
  */
  public copy(toCopy: UnidocEventBlueprint): void {
    this.predicate = toCopy.predicate
  }

  /**
  *
  */
  public clear(): void {
    this.predicate = UnidocPredicate.anything()
  }

  /**
  * @see UnidocBlueprint.equals
  */
  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocEventBlueprint) {
      return this.predicate.equals(other.predicate)
    }

    return false
  }

  /**
  * @see UnidocBlueprint.toString
  */
  public toString(): string {
    return '| ' + this.constructor.name + ' ' + this.predicate.toString()
  }
}

export namespace UnidocEventBlueprint {
  /**
  *
  */
  export function create(): UnidocEventBlueprint {
    return new UnidocEventBlueprint()
  }
}
