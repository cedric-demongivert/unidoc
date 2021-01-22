import { Allocator } from '@cedric-demongivert/gl-tool-collection'

import { UnidocValidationEvent } from '../../validation/UnidocValidationEvent'

import { UnidocKissValidatorOutputType } from './UnidocKissValidatorOutputType'

export class UnidocKissValidatorOutput {
  /**
  *
  */
  public type: UnidocKissValidatorOutputType

  /**
  *
  */
  public readonly event: UnidocValidationEvent

  /**
  *
  */
  public constructor() {
    this.type = UnidocKissValidatorOutputType.DEFAULT
    this.event = new UnidocValidationEvent()
  }

  /**
  *
  */
  public isCurrent(): boolean {
    return this.type === UnidocKissValidatorOutputType.CURRENT
  }

  /**
  *
  */
  public isNext(): boolean {
    return this.type === UnidocKissValidatorOutputType.NEXT
  }

  /**
  *
  */
  public isEmit(): boolean {
    return this.type === UnidocKissValidatorOutputType.EMIT
  }

  /**
  *
  */
  public isEnd(): boolean {
    return this.type === UnidocKissValidatorOutputType.END
  }

  /**
  *
  */
  public isMatch(): boolean {
    return this.type === UnidocKissValidatorOutputType.MATCH
  }

  /**
  *
  */
  public asCurrent(): UnidocKissValidatorOutput {
    this.type = UnidocKissValidatorOutputType.CURRENT
    this.event.clear()
    return this
  }

  /**
  *
  */
  public asNext(): UnidocKissValidatorOutput {
    this.type = UnidocKissValidatorOutputType.NEXT
    this.event.clear()
    return this
  }

  /**
  *
  */
  public asMatch(): UnidocKissValidatorOutput {
    this.type = UnidocKissValidatorOutputType.MATCH
    this.event.clear()
    return this
  }

  /**
  *
  */
  public asEmit(event: UnidocValidationEvent): UnidocKissValidatorOutput {
    this.type = UnidocKissValidatorOutputType.EMIT
    this.event.copy(event)
    return this
  }

  /**
  *
  */
  public asEnd(): UnidocKissValidatorOutput {
    this.type = UnidocKissValidatorOutputType.END
    this.event.clear()
    return this
  }

  /**
  * Clear this event instance in order to reuse it.
  */
  public clear(): void {
    this.type = UnidocKissValidatorOutputType.DEFAULT
    this.event.clear()
  }

  /**
  * Copy an existing instance.
  *
  * @param toCopy - An instance to copy.
  */
  public copy(toCopy: UnidocKissValidatorOutput): void {
    this.type = toCopy.type
    this.event.copy(toCopy.event)
  }

  /**
  * Return a copy of this instance.
  *
  * @return A copy of this instance.
  */
  public clone(): UnidocKissValidatorOutput {
    const result: UnidocKissValidatorOutput = new UnidocKissValidatorOutput()
    result.copy(this)
    return result
  }

  /**
  * @see Object.toString
  */
  public toString(): string {
    let result = UnidocKissValidatorOutputType.toDebugString(this.type)

    switch (this.type) {
      case UnidocKissValidatorOutputType.CURRENT:
        result += ' get current event'
        break
      case UnidocKissValidatorOutputType.NEXT:
        result += ' get next event'
        break
      case UnidocKissValidatorOutputType.EMIT:
        result += ' emit '
        result += this.event.toString()
        break
      case UnidocKissValidatorOutputType.END:
        result += ' end'
        break
      case UnidocKissValidatorOutputType.MATCH:
        result += ' match'
        break
      default:
        throw new Error(
          'Unable to stringify validator output of type ' +
          UnidocKissValidatorOutputType.toDebugString(this.type) + ' because ' +
          'no procedure was defined to stringify this type of event.'
        )
    }

    return result
  }

  /**
  * @see Object.equals
  */
  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocKissValidatorOutput) {
      return (
        this.type === other.type &&
        this.event.equals(other.event)
      )
    }

    return false
  }
}

export namespace UnidocKissValidatorOutput {
  /**
  *
  */
  export const CURRENT: UnidocKissValidatorOutput = create().asCurrent()

  /**
  *
  */
  export const NEXT: UnidocKissValidatorOutput = create().asNext()

  /**
  *
  */
  export const END: UnidocKissValidatorOutput = create().asEnd()

  /**
  *
  */
  export const MATCH: UnidocKissValidatorOutput = create().asMatch()

  /**
  * Return a deep copy of the given instance.
  *
  * @param toCopy - An instance to copy.
  *
  * @return A deep copy of the given instance.
  */
  export function copy(toCopy: UnidocKissValidatorOutput): UnidocKissValidatorOutput
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
  export function copy(toCopy: UnidocKissValidatorOutput | null | undefined): UnidocKissValidatorOutput | null | undefined
  export function copy(toCopy: UnidocKissValidatorOutput | null | undefined): UnidocKissValidatorOutput | null | undefined {
    return toCopy == null ? toCopy : toCopy.clone()
  }

  /**
  *
  */
  export function create(): UnidocKissValidatorOutput {
    return new UnidocKissValidatorOutput()
  }

  /**
  *
  */
  export const ALLOCATOR: Allocator<UnidocKissValidatorOutput> = Allocator.fromFactory(create)
}
