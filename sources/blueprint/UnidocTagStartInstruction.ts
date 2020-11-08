import { UnidocInstructionType } from './UnidocInstructionType'

import { UnidocInstruction } from './UnidocInstruction'

export class UnidocTagStartInstruction implements UnidocInstruction {
  /**
  * @see UnidocInstruction.type
  */
  public readonly type: UnidocInstructionType

  /**
  * The expected type of tag to start.
  */
  public readonly tag: string

  public constructor(tag: string) {
    this.type = UnidocInstructionType.TAG_START
    this.tag = tag
  }

  /**
  * @see Object.equals
  */
  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocTagStartInstruction) {
      return other.type === this.type &&
        other.tag === this.tag
    }

    return false
  }

  /**
  * @see Object.toString
  */
  public toString(): string {
    return 'tag-start "' + this.tag + '"'
  }
}

export namespace UnidocTagStartInstruction {
  export function create(tag: string): UnidocTagStartInstruction {
    return new UnidocTagStartInstruction(tag)
  }
}
