import { UnidocInstructionType } from './UnidocInstructionType'

import { UnidocInstruction } from './UnidocInstruction'

export class UnidocWhitespaceInstruction implements UnidocInstruction {
  /**
  * @see UnidocInstruction.type
  */
  public readonly type: UnidocInstructionType

  public constructor() {
    this.type = UnidocInstructionType.WHITESPACE
  }

  /**
  * @see Object.equals
  */
  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocWhitespaceInstruction) {
      return other.type === this.type
    }

    return false
  }

  /**
  * @see Object.toString
  */
  public toString(): string {
    return 'whitespace'
  }
}

export namespace UnidocWhitespaceInstruction {
  export const INSTANCE: UnidocWhitespaceInstruction = new UnidocWhitespaceInstruction()

  export function create(): UnidocWhitespaceInstruction {
    return INSTANCE
  }
}
