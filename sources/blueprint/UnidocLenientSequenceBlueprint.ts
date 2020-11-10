import { Pack } from '@cedric-demongivert/gl-tool-collection'

import { UnidocBlueprintType } from './UnidocBlueprintType'
import { UnidocBlueprint } from './UnidocBlueprint'
import { UnidocEndBlueprint } from './UnidocEndBlueprint'
import { UnidocSequentialBlueprint } from './UnidocSequentialBlueprint'

export class UnidocLenientSequenceBlueprint implements UnidocSequentialBlueprint {
  /**
  * @see UnidocBlueprint.type
  */
  public readonly type: UnidocBlueprintType

  public sequence: Pack<UnidocBlueprint>

  /**
  * @see UnidocSequentialBlueprint.next
  */
  public next: UnidocBlueprint

  public constructor(capacity: number = 8) {
    this.type = UnidocBlueprintType.LENIENT_SEQUENCE
    this.sequence = Pack.any(capacity)
    this.next = UnidocEndBlueprint.INSTANCE
  }

  public ofContent(content: UnidocBlueprint): UnidocLenientSequenceBlueprint {
    this.sequence.push(content)
    return this
  }

  /**
  * @see UnidocSequentialBlueprint.then
  */
  public then(value: UnidocBlueprint): UnidocLenientSequenceBlueprint {
    this.next = value
    return this
  }

  public toString(): string {
    return 'UnidocBlueprint:LenientSequence [' + this.sequence.size + ']'
  }
}

export namespace UnidocLenientSequenceBlueprint {
  export function create(): UnidocLenientSequenceBlueprint {
    return new UnidocLenientSequenceBlueprint()
  }
}
