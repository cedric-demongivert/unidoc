import { UnidocBlueprintType } from './UnidocBlueprintType'
import { UnidocBlueprint } from './UnidocBlueprint'
import { UnidocSequentialBlueprint } from './UnidocSequentialBlueprint'
import { UnidocEndBlueprint } from './UnidocEndBlueprint'

/**
* 
*
*/
export class UnidocAnythingBlueprint implements UnidocSequentialBlueprint {
  /**
  * @see UnidocBlueprint.type
  */
  public readonly type: UnidocBlueprintType

  /**
  * @see UnidocSequentialBlueprint.next
  */
  public next: UnidocBlueprint

  public constructor() {
    this.type = UnidocBlueprintType.ANYTHING
    this.next = UnidocEndBlueprint.INSTANCE
  }

  /**
  * @see UnidocSequentialBlueprint.then
  */
  public then(value: UnidocBlueprint): UnidocAnythingBlueprint {
    this.next = value
    return this
  }

  public toString(): string {
    return 'UnidocBlueprint:Anything'
  }
}

export namespace UnidocAnythingBlueprint {
  export function create(): UnidocAnythingBlueprint {
    return new UnidocAnythingBlueprint()
  }
}
