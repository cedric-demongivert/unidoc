import { UnidocInstructionType } from './UnidocInstructionType'

import { UnidocInstruction } from './UnidocInstruction'

export class UnidocEndManyInstruction implements UnidocInstruction {
  /**
  * @see UnidocInstruction.type
  */
  public readonly type: UnidocInstructionType

  public constructor() {
    this.type = UnidocInstructionType.END_MANY
  }

  /**
  * @see Object.equals
  */
  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocEndManyInstruction) {
      return other.type === this.type
    }

    return false
  }

  /**
  * @see Object.toString
  */
  public toString(): string {
    return 'end many'
  }
}

export namespace UnidocEndManyInstruction {
  export const INSTANCE: UnidocEndManyInstruction = new UnidocEndManyInstruction()

  export function create(): UnidocEndManyInstruction {
    return INSTANCE
  }
}
