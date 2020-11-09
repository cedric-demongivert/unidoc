import { UnidocBlueprintType } from './UnidocBlueprintType'
import { UnidocBlueprint } from './UnidocBlueprint'
import { UnidocSequentialBlueprint } from './UnidocSequentialBlueprint'
import { UnidocEndBlueprint } from './UnidocEndBlueprint'

const DEFAULT_TAG: string = 'block'

export class UnidocTagStartBlueprint implements UnidocSequentialBlueprint {
  /**
  * @see UnidocBlueprint.type
  */
  public readonly type: UnidocBlueprintType

  /**
  * The expected type of tag to start.
  */
  public tag: string

  /**
  * @see UnidocSequentialBlueprint.next
  */
  public next: UnidocBlueprint

  public constructor() {
    this.type = UnidocBlueprintType.TAG_START
    this.tag = DEFAULT_TAG
    this.next = UnidocEndBlueprint.INSTANCE
  }

  public ofTag(tag: string): UnidocTagStartBlueprint {
    this.tag = tag
    return this
  }

  /**
  * @see UnidocSequentialBlueprint.then
  */
  public then<T extends UnidocBlueprint>(value: T): T {
    this.next = value
    return value
  }
}

export namespace UnidocTagStartBlueprint {
  export function create(): UnidocTagStartBlueprint {
    return new UnidocTagStartBlueprint()
  }
}
