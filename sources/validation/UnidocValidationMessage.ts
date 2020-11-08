import { Allocator } from '@cedric-demongivert/gl-tool-collection'

import { UnidocPath } from '../path/UnidocPath'

import { UnidocValidationMessageType } from './UnidocValidationMessageType'

const EMPTY_STRING: string = ''

export class UnidocValidationMessage {
  public type: UnidocValidationMessageType
  public path: UnidocPath
  public code: string
  public readonly data: Map<string, any>

  /**
  * Instantiate a new validation instance.
  */
  public constructor() {
    this.type = UnidocValidationMessageType.DEFAULT
    this.path = new UnidocPath()
    this.code = EMPTY_STRING
    this.data = new Map<string, any>()
  }

  public withData(key: string, value: any): void {
    this.data.set(key, value)
  }

  public ofCode(code: string): void {
    this.code = code
  }

  /**
  * Configure this validation as verbose message.
  *
  * @see UnidocValidationEventType.VERBOSE
  */
  public asVerbose(): void {
    this.type = UnidocValidationMessageType.VERBOSE
  }

  /**
  * Configure this validation as an information.
  *
  * @see UnidocValidationEventType.INFORMATION
  */
  public asInformation(): void {
    this.type = UnidocValidationMessageType.INFORMATION
  }

  /**
  * Configure this validation as a warning.
  *
  * @see UnidocValidationEventType.WARNING
  */
  public asWarning(): void {
    this.type = UnidocValidationMessageType.WARNING
  }

  /**
  * Configure this validation as an error.
  *
  * @see UnidocValidationEventType.ERROR
  */
  public asError(): void {
    this.type = UnidocValidationMessageType.ERROR
  }

  /**
  * Configure this validation as a failure.
  *
  * @see UnidocValidationEventType.FAILURE
  */
  public asFailure(): void {
    this.type = UnidocValidationMessageType.FAILURE
  }

  /**
  * Clear this validation instance in order to reuse it.
  */
  public clear(): void {
    this.type = UnidocValidationMessageType.DEFAULT
    this.code = EMPTY_STRING
    this.data.clear()
    this.path.clear()
  }

  /**
  * Copy an existing instance.
  *
  * @param toCopy - An instance to copy.
  */
  public copy(toCopy: UnidocValidationMessage): void {
    this.type = toCopy.type
    this.code = toCopy.code
    this.path.copy(toCopy.path)
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
      `[${UnidocValidationMessageType.toString(this.type)}] ${this.path.toString()} ${this.code} : {${[...this.data.entries()].map(x => x[0] + ': ' + x[1]).join(', ')}}`
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
        other.data.size !== this.data.size ||
        !other.path.equals(this.path)
      ) return false

      for (const [key, data] of this.data) {
        if (other.data.get(key) !== data) {
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
  export function copy(toCopy: null): null
  export function copy(toCopy: UnidocValidationMessage | null): UnidocValidationMessage | null {
    return toCopy == null ? toCopy : toCopy.clone()
  }

  export const ALLOCATOR: Allocator<UnidocValidationMessage> = {
    allocate(): UnidocValidationMessage {
      return new UnidocValidationMessage()
    },

    clear(instance: UnidocValidationMessage): void {
      instance.clear()
    },

    copy(source: UnidocValidationMessage, destination: UnidocValidationMessage): void {
      destination.copy(source)
    }
  }
}
