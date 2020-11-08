import { UnidocInstructionType } from './UnidocInstructionType'

import { UnidocInstruction } from './UnidocInstruction'

export class UnidocEndFragmentInstruction implements UnidocInstruction {
  /**
  * @see UnidocInstruction.type
  */
  public readonly type: UnidocInstructionType

  /**
  * The name of the fragment to end.
  */
  public readonly name: string

  public constructor(name: string) {
    this.type = UnidocInstructionType.END_FRAGMENT
    this.name = name
  }

  /**
  * @see Object.equals
  */
  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocEndFragmentInstruction) {
      return other.type === this.type &&
        other.name === this.name
    }

    return false
  }
}

export namespace UnidocEndFragmentInstruction {
  export function create(tag: string): UnidocEndFragmentInstruction {
    return new UnidocEndFragmentInstruction(tag)
  }
}
