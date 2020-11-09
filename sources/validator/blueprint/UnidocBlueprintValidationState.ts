import { Allocator } from '@cedric-demongivert/gl-tool-collection'

import { UnidocBlueprint } from '../../blueprint/UnidocBlueprint'
import { UnidocEndBlueprint } from '../../blueprint/UnidocEndBlueprint'

export class UnidocBlueprintValidationState {
  public blueprint: UnidocBlueprint
  public current: number

  public constructor() {
    this.blueprint = UnidocEndBlueprint.INSTANCE
    this.current = 0
  }

  public copy(toCopy: UnidocBlueprintValidationState): void {
    this.blueprint = toCopy.blueprint
    this.current = toCopy.current
  }

  public clone(): UnidocBlueprintValidationState {
    const result: UnidocBlueprintValidationState = new UnidocBlueprintValidationState()
    result.copy(this)
    return result
  }

  public clear(): void {
    this.blueprint = UnidocEndBlueprint.INSTANCE
    this.current = 0
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
