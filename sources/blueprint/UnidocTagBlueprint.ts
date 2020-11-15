import { Pack } from '@cedric-demongivert/gl-tool-collection'

import { UnidocBlueprintType } from './UnidocBlueprintType'
import { UnidocBlueprint } from './UnidocBlueprint'
import { UnidocEndBlueprint } from './UnidocEndBlueprint'
import { UnidocSequentialBlueprint } from './UnidocSequentialBlueprint'
import { Predicate } from '../predicate/Predicate'

export class UnidocTagBlueprint implements UnidocSequentialBlueprint {
  /**
  * @see UnidocBlueprint.type
  */
  public readonly type: UnidocBlueprintType

  /**
  *
  */
  public matcher: Predicate<string>

  /**
  * A description of the content that may be repeated.
  */
  public content: UnidocBlueprint

  /**
  * @see UnidocSequentialBlueprint.next
  */
  public next: UnidocBlueprint

  public constructor() {
    this.type = UnidocBlueprintType.TAG
    this.matcher = Predicate.anything()
    this.content = UnidocEndBlueprint.INSTANCE
    this.next = UnidocEndBlueprint.INSTANCE
  }

  public withContent(content: UnidocBlueprint): UnidocTagBlueprint {
    this.content = content
    return this
  }

  public withTypeThatMatch(predicate: Predicate<string>): UnidocTagBlueprint {
    this.matcher = predicate
    return this
  }

  /**
  * @see UnidocSequentialBlueprint.then
  */
  public then(value: UnidocBlueprint): UnidocTagBlueprint {
    this.next = value
    return this
  }

  public toString(): string {
    return 'UnidocBlueprint:Tag [' + this.matcher.toString() + ', 1]'
  }
}

export namespace UnidocTagBlueprint {
  export function create(): UnidocTagBlueprint {
    return new UnidocTagBlueprint()
  }
}
