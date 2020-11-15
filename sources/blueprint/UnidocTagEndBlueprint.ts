import { UnidocBlueprintType } from './UnidocBlueprintType'
import { UnidocBlueprint } from './UnidocBlueprint'
import { UnidocSequentialBlueprint } from './UnidocSequentialBlueprint'
import { UnidocEndBlueprint } from './UnidocEndBlueprint'

const DEFAULT_TAG: string = 'block'

export class UnidocTagEndBlueprint implements UnidocSequentialBlueprint {
  /**
  * @see UnidocBlueprint.type
  */
  public readonly type: UnidocBlueprintType

  /**
  * The expected type of tag to end.
  */
  public tag: string

  /**
  * @see UnidocSequentialBlueprint.next
  */
  public next: UnidocBlueprint

  public constructor() {
    this.type = UnidocBlueprintType.TAG_END
    this.tag = DEFAULT_TAG
    this.next = UnidocEndBlueprint.INSTANCE
  }

  public ofTag(tag: string): UnidocTagEndBlueprint {
    this.tag = tag
    return this
  }

  /**
  * @see UnidocSequentialBlueprint.then
  */
  public then(value: UnidocBlueprint): UnidocTagEndBlueprint {
    this.next = value
    return this
  }

  public toString(): string {
    return 'UnidocBlueprint:TagEnd ' + this.tag
  }

  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocTagEndBlueprint) {
      return (
        other.tag === this.tag &&
        other.next === this.next
      )
    }

    return false
  }
}

export namespace UnidocTagEndBlueprint {
  export function create(): UnidocTagEndBlueprint {
    return new UnidocTagEndBlueprint()
  }
}
