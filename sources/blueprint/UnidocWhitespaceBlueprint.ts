import { UnidocBlueprintType } from './UnidocBlueprintType'
import { UnidocBlueprint } from './UnidocBlueprint'
import { UnidocSequentialBlueprint } from './UnidocSequentialBlueprint'
import { UnidocEndBlueprint } from './UnidocEndBlueprint'

export class UnidocWhitespaceBlueprint implements UnidocSequentialBlueprint {
  /**
  * @see UnidocBlueprint.type
  */
  public readonly type: UnidocBlueprintType

  /**
  * @see UnidocSequentialBlueprint.next
  */
  public next: UnidocBlueprint

  public constructor() {
    this.type = UnidocBlueprintType.WHITESPACE
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

export namespace UnidocWhitespaceBlueprint {
  export function create(): UnidocWhitespaceBlueprint {
    return new UnidocWhitespaceBlueprint()
  }
}
