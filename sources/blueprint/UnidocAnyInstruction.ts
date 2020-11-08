import { UnidocInstructionType } from './UnidocInstructionType'

import { UnidocInstruction } from './UnidocInstruction'

export class UnidocAnyInstruction implements UnidocInstruction {
  /**
  * @see UnidocInstruction.type
  */
  public readonly type: UnidocInstructionType

  public constructor() {
    this.type = UnidocInstructionType.ANY
  }

  /**
  * @see Object.equals
  */
  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocAnyInstruction) {
      return other.type === this.type
    }

    return false
  }

  /**
  * @see Object.toString
  */
  public toString(): string {
    return 'any'
  }
}

export namespace UnidocAnyInstruction {
  export const INSTANCE: UnidocAnyInstruction = new UnidocAnyInstruction()

  export function create(): UnidocAnyInstruction {
    return INSTANCE
  }
}
