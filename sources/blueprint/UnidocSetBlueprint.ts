import { Pack } from '@cedric-demongivert/gl-tool-collection'

import { UnidocBlueprintType } from './UnidocBlueprintType'
import { UnidocBlueprint } from './UnidocBlueprint'
import { UnidocEndBlueprint } from './UnidocEndBlueprint'
import { UnidocSequentialBlueprint } from './UnidocSequentialBlueprint'

export class UnidocSetBlueprint implements UnidocSequentialBlueprint {
  /**
  * @see UnidocBlueprint.type
  */
  public readonly type: UnidocBlueprintType

  /**
  * A description of the content that may be repeated.
  */
  public alternatives: Pack<UnidocBlueprint>

  /**
  * @see UnidocSequentialBlueprint.next
  */
  public next: UnidocBlueprint

  public constructor(capacity: number = 8) {
    this.type = UnidocBlueprintType.SET
    this.alternatives = Pack.any(capacity)
    this.next = UnidocEndBlueprint.INSTANCE
  }

  public ofContent(content: UnidocBlueprint): UnidocSetBlueprint {
    this.alternatives.push(content)
    return this
  }

  /**
  * @see UnidocSequentialBlueprint.then
  */
  public then(value: UnidocBlueprint): UnidocSetBlueprint {
    this.next = value
    return this
  }

  public toString(): string {
    return 'UnidocBlueprint:Set [' + this.alternatives.size + ']'
  }
}

export namespace UnidocSetBlueprint {
  export function create(): UnidocSetBlueprint {
    return new UnidocSetBlueprint()
  }
}
