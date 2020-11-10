import { UnidocBlueprintType } from './UnidocBlueprintType'
import { UnidocBlueprint } from './UnidocBlueprint'
import { UnidocSequentialBlueprint } from './UnidocSequentialBlueprint'
import { UnidocEndBlueprint } from './UnidocEndBlueprint'

export class UnidocWordBlueprint implements UnidocSequentialBlueprint {
  /**
  * @see UnidocBlueprint.type
  */
  public readonly type: UnidocBlueprintType

  /**
  * @see UnidocSequentialBlueprint.next
  */
  public next: UnidocBlueprint

  public constructor() {
    this.type = UnidocBlueprintType.WORD
    this.next = UnidocEndBlueprint.INSTANCE
  }

  /**
  * @see UnidocSequentialBlueprint.then
  */
  public then(value: UnidocBlueprint): UnidocWordBlueprint {
    this.next = value
    return this
  }

  public toString(): string {
    return 'UnidocBlueprint:Word'
  }
}

export namespace UnidocWordBlueprint {
  export function create(): UnidocWordBlueprint {
    return new UnidocWordBlueprint()
  }
}
