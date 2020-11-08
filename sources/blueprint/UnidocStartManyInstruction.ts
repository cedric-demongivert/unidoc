import { UnidocInstructionType } from './UnidocInstructionType'

import { UnidocInstruction } from './UnidocInstruction'

export class UnidocStartManyInstruction implements UnidocInstruction {
  /**
  * @see UnidocInstruction.type
  */
  public readonly type: UnidocInstructionType

  /**
  * The minimum number of repetition that is required.
  */
  public readonly minimum: number

  /**
  * The maximum number of repetition that is allowed.
  */
  public readonly maximum: number

  public constructor(minimum: number = 0, maximum: number = Number.POSITIVE_INFINITY) {
    this.type = UnidocInstructionType.START_MANY
    this.minimum = minimum
    this.maximum = maximum
  }

  /**
  * @see Object.toString
  */
  public toString(): string {
    return 'start many ' + this.minimum + ' - ' + this.maximum
  }

  /**
  * @see Object.equals
  */
  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocStartManyInstruction) {
      return other.type === this.type &&
        other.minimum === this.minimum &&
        other.maximum === this.maximum
    }

    return false
  }
}

export namespace UnidocStartManyInstruction {
  export function create(minimum: number = 0, maximum: number = Number.POSITIVE_INFINITY): UnidocStartManyInstruction {
    return new UnidocStartManyInstruction(minimum, maximum)
  }
}
