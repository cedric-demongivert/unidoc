import { UnidocBlueprint } from './UnidocBlueprint'
import { UnidocBlueprintInstruction } from './UnidocBlueprintInstruction'
import { UnidocInstructionType } from './UnidocInstructionType'

export class UnidocBlueprintWalker {
  public blueprint: UnidocBlueprint
  public index: number

  public get instruction(): UnidocBlueprintInstruction {
    return this.blueprint.get(this.index)
  }

  public constructor(blueprint: UnidocBlueprint) {
    this.blueprint = blueprint
    this.index = 0
  }

  public walkUntilManyBlockTermination(): number {
    let deep: number = 0
    let current: number = this.index

    if (this.instruction.instruction.type === UnidocInstructionType.START_MANY) {
      current = this.walk()
    }

    while (true) {
      if (current > this.blueprint.instructions.size) {
        return -1
      }

      switch (this.instruction.instruction.type) {
        case UnidocInstructionType.END:
        case UnidocInstructionType.END_FRAGMENT:
          return -1
        case UnidocInstructionType.END_MANY:
          if (deep > 0) {
            deep -= 1
            current = this.walk()
            break
          } else {
            return current
          }
        case UnidocInstructionType.START_MANY:
          deep += 1
          current = this.walk()
          break
        default:
          current = this.walk()
          break
      }
    }
  }

  public jump(index: number): void {
    this.index = index
  }

  public walk(): number {
    switch (this.instruction.instruction.type) {
      case UnidocInstructionType.TAG_START:
      case UnidocInstructionType.TAG_END:
      case UnidocInstructionType.WORD:
      case UnidocInstructionType.WHITESPACE:
      case UnidocInstructionType.START_MANY:
      case UnidocInstructionType.END_MANY:
      case UnidocInstructionType.ANY:
        this.index += 1
        return this.index
      case UnidocInstructionType.END:
        return this.index
      default:
        throw new Error(
          'Unable to walk over instruction ' + this.instruction.toString() +
          'because no procedure exists to handle this situation.'
        )
    }
  }
}

export namespace UnidocBlueprintWalker {
  const INSTANCE: UnidocBlueprintWalker = new UnidocBlueprintWalker(new UnidocBlueprint())

  export function get(blueprint: UnidocBlueprint, index: number = 0): UnidocBlueprintWalker {
    INSTANCE.blueprint = blueprint
    INSTANCE.index = index

    return INSTANCE
  }
}
