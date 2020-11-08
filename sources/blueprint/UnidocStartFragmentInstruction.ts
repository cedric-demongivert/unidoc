import { UnidocInstructionType } from './UnidocInstructionType'

import { UnidocInstruction } from './UnidocInstruction'

export class UnidocStartFragmentInstruction implements UnidocInstruction {
  /**
  * @see UnidocInstruction.type
  */
  public readonly type: UnidocInstructionType

  /**
  * The name of the fragment to start.
  */
  public readonly name: string

  public constructor(name: string) {
    this.type = UnidocInstructionType.START_FRAGMENT
    this.name = name
  }

  /**
  * @see Object.equals
  */
  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocStartFragmentInstruction) {
      return other.type === this.type &&
        other.name === this.name
    }

    return false
  }
}

export namespace UnidocStartFragmentInstruction {
  export function create(tag: string): UnidocStartFragmentInstruction {
    return new UnidocStartFragmentInstruction(tag)
  }
}
