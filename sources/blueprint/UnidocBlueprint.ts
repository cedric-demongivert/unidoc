import { Sequence } from '@cedric-demongivert/gl-tool-collection'
import { Pack } from '@cedric-demongivert/gl-tool-collection'

import { UnidocBlueprintInstruction } from './UnidocBlueprintInstruction'
import { UnidocInstruction } from './UnidocInstruction'

/**
* A blueprint is a sequence of instruction that describe a class of unidoc
* document.
*/
export class UnidocBlueprint {
  private _instructions: Pack<UnidocBlueprintInstruction>

  public instructions: Sequence<UnidocBlueprintInstruction>

  public constructor(capacity: number = 64) {
    this._instructions = Pack.any(capacity)
    this.instructions = this._instructions.view()
  }

  public get capacity(): number {
    return this._instructions.capacity
  }

  public reallocate(capacity: number): void {
    this._instructions.reallocate(capacity)
  }

  public fit(): void {
    this._instructions.fit()
  }

  public push(instruction: UnidocInstruction): void {
    this._instructions.push(
      new UnidocBlueprintInstruction(
        this, this._instructions.size, instruction
      )
    )
  }

  public get(index: number): UnidocBlueprintInstruction {
    return this._instructions.get(index)
  }

  public copy(toCopy: UnidocBlueprint): void {
    this._instructions.copy(this._instructions)
  }

  public clone(): UnidocBlueprint {
    const result: UnidocBlueprint = new UnidocBlueprint(this._instructions.capacity)

    result._instructions.copy(this._instructions)

    return result
  }

  public clear(): void {
    this._instructions.clear()
  }

  /**
  * @see Object.toString
  */
  public toString(): string {
    let result: string = 'unidoc blueprint ['

    for (const instruction of this._instructions) {
      result += '\r\n\t'
      result += instruction.index.toString().padStart(5)
      result += ' : '
      result += instruction.instruction.toString()
    }

    if (this._instructions.size > 0) {
      result += '\r\n'
    }

    result += ']'

    return result
  }

  /**
  * @see Symbol.iterator
  */
  public *[Symbol.iterator](): Iterator<UnidocBlueprintInstruction> {
    yield* this._instructions
  }
}
