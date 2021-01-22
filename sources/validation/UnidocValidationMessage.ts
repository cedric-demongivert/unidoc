import { Duplicator } from '@cedric-demongivert/gl-tool-collection'

import { UnidocValidationMessageType } from './UnidocValidationMessageType'

const EMPTY_STRING: string = ''

export class UnidocValidationMessage {
  /**
  *
  */
  public type: UnidocValidationMessageType

  /**
  *
  */
  public code: string

  /**
  *
  */
  public readonly data: Map<string, any>

  /**
  * Instantiate a new validation instance.
  */
  public constructor() {
    this.type = UnidocValidationMessageType.DEFAULT
    this.code = EMPTY_STRING
    this.data = new Map<string, any>()
  }

  /**
  *
  */
  public setData(key: string, value: any): UnidocValidationMessage {
    this.data.set(key, value)
    return this
  }

  /**
  *
  */
  public setCode(code: string): UnidocValidationMessage {
    this.code = code
    return this
  }

  /**
  *
  */
  public setType(type: UnidocValidationMessageType): UnidocValidationMessage {
    this.type = type
    return this
  }

  /**
  * Configure this validation as verbose message.
  *
  * @see UnidocValidationEventType.VERBOSE
  */
  public asVerbose(): UnidocValidationMessage {
    this.type = UnidocValidationMessageType.VERBOSE
    return this
  }

  /**
  * Configure this validation as an information.
  *
  * @see UnidocValidationEventType.INFORMATION
  */
  public asInformation(): UnidocValidationMessage {
    this.type = UnidocValidationMessageType.INFORMATION
    return this
  }

  /**
  * Configure this validation as a warning.
  *
  * @see UnidocValidationEventType.WARNING
  */
  public asWarning(): UnidocValidationMessage {
    this.type = UnidocValidationMessageType.WARNING
    return this
  }

  /**
  * Configure this validation as an error.
  *
  * @see UnidocValidationEventType.ERROR
  */
  public asError(): UnidocValidationMessage {
    this.type = UnidocValidationMessageType.ERROR
    return this
  }

  /**
  * Configure this validation as a failure.
  *
  * @see UnidocValidationEventType.FAILURE
  */
  public asFailure(): UnidocValidationMessage {
    this.type = UnidocValidationMessageType.FAILURE
    return this
  }

  /**
  *
  */
  public isVerbose(): boolean {
    return this.type === UnidocValidationMessageType.VERBOSE
  }

  /**
  *
  */
  public isInformation(): boolean {
    return this.type === UnidocValidationMessageType.INFORMATION
  }

  /**
  *
  */
  public isWarning(): boolean {
    return this.type === UnidocValidationMessageType.WARNING
  }

  /**
  *
  */
  public isError(): boolean {
    return this.type === UnidocValidationMessageType.ERROR
  }

  /**
  *
  */
  public isFailure(): boolean {
    return this.type === UnidocValidationMessageType.FAILURE
  }

  /**
  * Clear this validation instance in order to reuse it.
  */
  public clear(): void {
    this.type = UnidocValidationMessageType.DEFAULT
    this.code = EMPTY_STRING
    this.data.clear()
  }

  /**
  * Copy an existing instance.
  *
  * @param toCopy - An instance to copy.
  */
  public copy(toCopy: UnidocValidationMessage): void {
    this.type = toCopy.type
    this.code = toCopy.code
    this.data.clear()

    for (const [key, data] of toCopy.data) {
      this.data.set(key, data)
    }
  }

  /**
  * Return a copy of this instance.
  *
  * @return A copy of this instance.
  */
  public clone(): UnidocValidationMessage {
    const result: UnidocValidationMessage = new UnidocValidationMessage()
    result.copy(this)
    return result
  }

  /**
  * @see Object#toString
  */
  public toString(): string {
    return (
      `${UnidocValidationMessageType.toDebugString(this.type)} ${this.code} : {${[...this.data.entries()].map(x => x[0] + ': ' + x[1]).join(', ')}}`
    )
  }

  /**
  * @see Object#equals
  */
  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocValidationMessage) {
      if (
        other.type !== this.type ||
        other.code !== this.code ||
        other.data.size !== this.data.size
      ) return false

      for (const [key, data] of this.data) {
        const value: any = other.data.get(key)

        if (value.equals) {
          if (!value.equals(data)) {
            return false
          }
        } else if (value !== data) {
          return false
        }
      }

      return true
    }

    return false
  }
}

export namespace UnidocValidationMessage {
  /**
  * Return a deep copy of the given instance.
  *
  * @param toCopy - An instance to copy.
  *
  * @return A deep copy of the given instance.
  */
  export function copy(toCopy: UnidocValidationMessage): UnidocValidationMessage
  /**
  *
  */
  export function copy(toCopy: null): null
  /**
  *
  */
  export function copy(toCopy: undefined): undefined
  /**
  *
  */
  export function copy(toCopy: UnidocValidationMessage | null | undefined): UnidocValidationMessage | null | undefined
  export function copy(toCopy: UnidocValidationMessage | null | undefined): UnidocValidationMessage | null | undefined {
    return toCopy == null ? toCopy : toCopy.clone()
  }

  /**
  *
  */
  export function create(): UnidocValidationMessage {
    return new UnidocValidationMessage()
  }

  /**
  *
  */
  export const ALLOCATOR: Duplicator<UnidocValidationMessage> = Duplicator.fromFactory(create)
}
