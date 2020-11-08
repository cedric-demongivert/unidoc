import { UnidocInstructionType } from './UnidocInstructionType'

import { UnidocInstruction } from './UnidocInstruction'

export class UnidocEndInstruction implements UnidocInstruction {
  /**
  * @see UnidocInstruction.type
  */
  public readonly type: UnidocInstructionType

  public constructor() {
    this.type = UnidocInstructionType.END
  }

  /**
  * @see Object.equals
  */
  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocEndInstruction) {
      return other.type === this.type
    }

    return false
  }

  /**
  * @see Object.toString
  */
  public toString(): string {
    return 'end'
  }
}

export namespace UnidocEndInstruction {
  export const INSTANCE: UnidocEndInstruction = new UnidocEndInstruction()

  export function create(): UnidocEndInstruction {
    return INSTANCE
  }
}
