import { UnidocInstructionType } from './UnidocInstructionType'

import { UnidocInstruction } from './UnidocInstruction'

export class UnidocTagEndInstruction implements UnidocInstruction {
  /**
  * @see UnidocInstruction.type
  */
  public readonly type: UnidocInstructionType

  /**
  * The expected type of tag to start.
  */
  public readonly tag: string

  public constructor(tag: string) {
    this.type = UnidocInstructionType.TAG_END
    this.tag = tag
  }

  /**
  * @see Object.equals
  */
  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocTagEndInstruction) {
      return other.type === this.type &&
        other.tag === this.tag
    }

    return false
  }

  /**
  * @see Object.toString
  */
  public toString(): string {
    return 'tag-end "' + this.tag + '"'
  }
}

export namespace UnidocTagEndInstruction {
  export function create(tag: string): UnidocTagEndInstruction {
    return new UnidocTagEndInstruction(tag)
  }
}
