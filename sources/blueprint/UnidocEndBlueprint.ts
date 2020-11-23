import { UnidocBlueprintType } from './UnidocBlueprintType'
import { UnidocBlueprint } from './UnidocBlueprint'

/**
*
*/
export class UnidocEndBlueprint implements UnidocBlueprint {
  /**
  * @see UnidocBlueprint.type
  */
  public readonly type: UnidocBlueprintType

  /**
  *
  */
  public constructor() {
    this.type = UnidocBlueprintType.END
  }

  /**
  * @see UnidocBlueprint.equals
  */
  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocEndBlueprint) {
      return true
    }

    return false
  }

  /**
  * @see UnidocBlueprint.toString
  */
  public toString(): string {
    return '| ' + this.constructor.name
  }
}

export namespace UnidocEndBlueprint {
  export const INSTANCE: UnidocEndBlueprint = new UnidocEndBlueprint()

  export function create(): UnidocEndBlueprint {
    return INSTANCE
  }
}
