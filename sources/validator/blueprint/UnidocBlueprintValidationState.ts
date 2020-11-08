import { Allocator } from '@cedric-demongivert/gl-tool-collection'

import { UnidocBlueprintInstruction } from '../../blueprint/UnidocBlueprintInstruction'
import { UnidocInstruction } from '../../blueprint/UnidocInstruction'

import { UnidocBlueprintValidationStateType } from './UnidocBlueprintValidationStateType'

export class UnidocBlueprintValidationState {
  public type: UnidocBlueprintValidationStateType
  public since: number
  public minimum: number
  public maximum: number
  public current: number

  public constructor() {
    this.type = UnidocBlueprintValidationStateType.DEFAULT
    this.since = 0
    this.minimum = 0
    this.maximum = 0
    this.current = 0
  }

  public from(instruction: UnidocBlueprintInstruction): UnidocBlueprintValidationState {
    this.since = instruction.index
    return this
  }

  public asMany(instruction: UnidocInstruction.StartMany): void {
    this.type = UnidocBlueprintValidationStateType.MANY
    this.minimum = instruction.minimum
    this.maximum = instruction.maximum
    this.current = 0
  }

  public copy(toCopy: UnidocBlueprintValidationState): void {
    this.type = toCopy.type
    this.since = toCopy.since
    this.minimum = toCopy.minimum
    this.maximum = toCopy.maximum
    this.current = toCopy.current
  }

  public clone(): UnidocBlueprintValidationState {
    const result: UnidocBlueprintValidationState = new UnidocBlueprintValidationState()
    result.copy(this)
    return result
  }

  public clear(): void {
    this.type = UnidocBlueprintValidationStateType.DEFAULT
    this.since = 0
    this.minimum = 0
    this.maximum = 0
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
