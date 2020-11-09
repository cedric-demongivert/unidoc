import { UnidocBlueprintType } from './UnidocBlueprintType'
import { UnidocBlueprint } from './UnidocBlueprint'
import { UnidocEndBlueprint } from './UnidocEndBlueprint'
import { UnidocSequentialBlueprint } from './UnidocSequentialBlueprint'

export class UnidocManyBlueprint implements UnidocSequentialBlueprint {
  /**
  * @see UnidocBlueprint.type
  */
  public readonly type: UnidocBlueprintType

  /**
  * The minimum number of repetition that is required.
  */
  public minimum: number

  /**
  * The maximum number of repetition that is allowed.
  */
  public maximum: number

  /**
  * A description of the content that may be repeated.
  */
  public content: UnidocBlueprint

  /**
  * @see UnidocSequentialBlueprint.next
  */
  public next: UnidocBlueprint

  public constructor() {
    this.type = UnidocBlueprintType.MANY
    this.minimum = 0
    this.maximum = Number.POSITIVE_INFINITY
    this.content = UnidocEndBlueprint.INSTANCE
    this.next = UnidocEndBlueprint.INSTANCE
  }

  public between(minimum: number, maximum: number): UnidocManyBlueprint {
    this.minimum = minimum
    this.maximum = maximum
    return this
  }

  public optional(): UnidocManyBlueprint {
    this.minimum = 0
    this.maximum = 1
    return this
  }

  public atLeast(minimum: number): UnidocManyBlueprint {
    this.minimum = minimum
    return this
  }

  public upTo(maximum: number): UnidocManyBlueprint {
    this.maximum = maximum
    return this
  }

  public ofContent(content: UnidocBlueprint): UnidocManyBlueprint {
    this.content = content
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

export namespace UnidocManyBlueprint {
  export function create(): UnidocManyBlueprint {
    return new UnidocManyBlueprint()
  }
}
