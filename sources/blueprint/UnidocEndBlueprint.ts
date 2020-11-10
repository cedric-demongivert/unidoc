import { UnidocBlueprintType } from './UnidocBlueprintType'
import { UnidocBlueprint } from './UnidocBlueprint'

export class UnidocEndBlueprint implements UnidocBlueprint {
  /**
  * @see UnidocBlueprint.type
  */
  public readonly type: UnidocBlueprintType

  public constructor() {
    this.type = UnidocBlueprintType.END
  }

  public toString(): string {
    return 'UnidocBlueprint:End'
  }
}

export namespace UnidocEndBlueprint {
  export const INSTANCE: UnidocEndBlueprint = new UnidocEndBlueprint()

  export function create(): UnidocEndBlueprint {
    return INSTANCE
  }
}
