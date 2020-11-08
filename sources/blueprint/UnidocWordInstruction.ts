import { UnidocInstructionType } from './UnidocInstructionType'

import { UnidocInstruction } from './UnidocInstruction'

export class UnidocWordInstruction implements UnidocInstruction {
  /**
  * @see UnidocInstruction.type
  */
  public readonly type: UnidocInstructionType

  public constructor() {
    this.type = UnidocInstructionType.WORD
  }

  /**
  * @see Object.equals
  */
  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocWordInstruction) {
      return other.type === this.type
    }

    return false
  }

  /**
  * @see Object.toString
  */
  public toString(): string {
    return 'word'
  }
}

export namespace UnidocWordInstruction {
  export const INSTANCE: UnidocWordInstruction = new UnidocWordInstruction()

  export function create(): UnidocWordInstruction {
    return INSTANCE
  }
}
