import { UnidocBlueprintType } from './UnidocBlueprintType'
import { UnidocBlueprint } from './UnidocBlueprint'
import { UnidocSequentialBlueprint } from './UnidocSequentialBlueprint'
import { UnidocEndBlueprint } from './UnidocEndBlueprint'

export class UnidocAnyBlueprint implements UnidocSequentialBlueprint {
  /**
  * @see UnidocBlueprint.type
  */
  public readonly type: UnidocBlueprintType

  /**
  * @see UnidocSequentialBlueprint.next
  */
  public next: UnidocBlueprint

  public constructor() {
    this.type = UnidocBlueprintType.ANY
    this.next = UnidocEndBlueprint.INSTANCE
  }

  /**
  * @see UnidocSequentialBlueprint.then
  */
  public then<T extends UnidocBlueprint>(value: T): T {
    this.next = value
    return value
  }
}

export namespace UnidocAnyBlueprint {
  export function create(): UnidocAnyBlueprint {
    return new UnidocAnyBlueprint()
  }
}
