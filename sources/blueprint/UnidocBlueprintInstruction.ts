import { UnidocInstruction } from './UnidocInstruction'
import { UnidocBlueprint } from './UnidocBlueprint'

export class UnidocBlueprintInstruction {
  /**
  * The blueprint that contains this instruction.
  */
  public readonly blueprint: UnidocBlueprint

  /**
  * The index of this instruction into it's parent blueprint.
  */
  public readonly index: number

  /**
  * The instruction.
  */
  public readonly instruction: UnidocInstruction

  public constructor(blueprint: UnidocBlueprint, index: number, instruction: UnidocInstruction) {
    this.blueprint = blueprint
    this.index = index
    this.instruction = instruction
  }

  /**
  * @see Object.toString
  */
  public toString(): string {
    return this.index + ' : ' + this.instruction.toString()
  }

  /**
  * @see Object.equals
  */
  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocBlueprintInstruction) {
      return this.blueprint === other.blueprint &&
        this.index === other.index &&
        this.instruction.equals(other.instruction)
    }

    return false
  }
}

export namespace UnidocBlueprintInstruction {

}
