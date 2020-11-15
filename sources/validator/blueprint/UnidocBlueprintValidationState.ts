import { Pack } from '@cedric-demongivert/gl-tool-collection'
import { Allocator } from '@cedric-demongivert/gl-tool-collection'

import { UnidocBlueprint } from '../../blueprint/UnidocBlueprint'
import { UnidocEndBlueprint } from '../../blueprint/UnidocEndBlueprint'

const EMPTY_STRING: string = ''

export class UnidocBlueprintValidationState {
  public blueprint: UnidocBlueprint
  public current: number
  public tag: string
  public readonly checked: Pack<number>

  public constructor() {
    this.blueprint = UnidocEndBlueprint.INSTANCE
    this.current = 0
    this.tag = EMPTY_STRING
    this.checked = Pack.uint8(16)
  }

  public copy(toCopy: UnidocBlueprintValidationState): void {
    this.blueprint = toCopy.blueprint
    this.current = toCopy.current
    this.checked.copy(toCopy.checked)
    this.tag = toCopy.tag
  }

  public clone(): UnidocBlueprintValidationState {
    const result: UnidocBlueprintValidationState = new UnidocBlueprintValidationState()
    result.copy(this)
    return result
  }

  public clear(): void {
    this.blueprint = UnidocEndBlueprint.INSTANCE
    this.current = 0
    this.tag = EMPTY_STRING
    this.checked.clear()
  }
}

export namespace UnidocBlueprintValidationState {
  export const ALLOCATOR: Allocator<UnidocBlueprintValidationState> = {
    /**
    * @see Allocator.copy
    */
    allocate(): UnidocBlueprintValidationState {
      return new UnidocBlueprintValidationState()
    },

    /**
    * @see Allocator.copy
    */
    copy(source: UnidocBlueprintValidationState, destination: UnidocBlueprintValidationState): void {
      destination.copy(source)
    },

    /**
    * @see Allocator.clear
    */
    clear(instance: UnidocBlueprintValidationState): void {
      instance.clear()
    }
  }
}
