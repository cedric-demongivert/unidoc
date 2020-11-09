import { Allocator } from '@cedric-demongivert/gl-tool-collection'

import { UnidocEvent } from '../event/UnidocEvent'

import { UnidocValidationMessage } from './UnidocValidationMessage'
import { UnidocValidationEventType } from './UnidocValidationEventType'
import { UnidocValidationBranchIdentifier } from './UnidocValidationBranchIdentifier'
import { UnidocValidationMessageType } from './UnidocValidationMessageType'

export class UnidocValidationEvent {
  /**
  * Index of this event into the validation stream.
  */
  public index: number

  /**
  * Batch index of this event that is related to the number of validation events that precede it.
  */
  public batch: number

  /**
  * Branch of the validation tree that emitted this event.
  */
  public readonly branch: UnidocValidationBranchIdentifier

  /**
  * Type of validation event emitted.
  */
  public type: UnidocValidationEventType

  /**
  * The fork identifier if this is a UnidocValidationEventType.FORK event.
  */
  public readonly fork: UnidocValidationBranchIdentifier

  /**
  * The event that is validated if this is a UnidocValidationEventType.VALIDATION event.
  */
  public readonly event: UnidocEvent

  /**
  * The message that is published if this is a UnidocValidationEventType.MESSAGE event.
  */
  public readonly message: UnidocValidationMessage

  /**
  * Instantiate a new message instance.
  */
  public constructor() {
    this.index = 0
    this.batch = 0
    this.branch = new UnidocValidationBranchIdentifier()
    this.type = UnidocValidationEventType.DEFAULT
    this.fork = new UnidocValidationBranchIdentifier()
    this.event = new UnidocEvent()
    this.message = new UnidocValidationMessage()
  }

  /**
  * Clear this message instance in order to reuse it.
  */
  public clear(): void {
    this.index = 0
    this.batch = 0
    this.branch.clear()
    this.type = UnidocValidationEventType.DEFAULT
    this.fork.clear()
    this.message.clear()
    this.event.clear()
  }

  public fromBranch(branch: UnidocValidationBranchIdentifier): UnidocValidationEvent {
    this.clear()
    this.branch.copy(branch)
    return this
  }

  public asFork(fork: UnidocValidationBranchIdentifier): UnidocValidationEvent {
    this.event.clear()
    this.message.clear()
    this.fork.copy(fork)
    this.type = UnidocValidationEventType.FORK
    return this
  }

  public asInitialization(): UnidocValidationEvent {
    this.event.clear()
    this.message.clear()
    this.fork.clear()
    this.type = UnidocValidationEventType.INITIALIZATION
    return this
  }

  public asCompletion(): UnidocValidationEvent {
    this.event.clear()
    this.message.clear()
    this.fork.clear()
    this.type = UnidocValidationEventType.COMPLETION
    return this
  }

  public asValidation(event: UnidocEvent): UnidocValidationEvent {
    this.message.clear()
    this.fork.clear()
    this.event.copy(event)
    this.type = UnidocValidationEventType.VALIDATION
    return this
  }

  public asMessage(event: UnidocValidationMessage): UnidocValidationEvent {
    this.event.clear()
    this.fork.clear()
    this.message.copy(event)
    this.type = UnidocValidationEventType.MESSAGE
    return this
  }

  public asMessageOfType(type: UnidocValidationMessageType): UnidocValidationEvent {
    this.event.clear()
    this.fork.clear()
    this.message.clear()
    this.message.type = type
    this.type = UnidocValidationEventType.MESSAGE
    return this
  }

  public asVerboseMessage(): UnidocValidationEvent {
    return this.asMessageOfType(UnidocValidationMessageType.VERBOSE)
  }

  public asInformationMessage(): UnidocValidationEvent {
    return this.asMessageOfType(UnidocValidationMessageType.INFORMATION)
  }

  public asWarningMessage(): UnidocValidationEvent {
    return this.asMessageOfType(UnidocValidationMessageType.WARNING)
  }

  public asErrorMessage(): UnidocValidationEvent {
    return this.asMessageOfType(UnidocValidationMessageType.ERROR)
  }

  public asFailureMessage(): UnidocValidationEvent {
    return this.asMessageOfType(UnidocValidationMessageType.FAILURE)
  }

  public ofCode(code: string): UnidocValidationEvent {
    this.message.ofCode(code)
    return this
  }

  public withData(key: string, value: any): UnidocValidationEvent {
    this.message.withData(key, value)
    return this
  }

  /**
  * Copy an existing instance.
  *
  * @param toCopy - An instance to copy.
  */
  public copy(toCopy: UnidocValidationEvent): void {
    this.index = toCopy.index
    this.batch = toCopy.batch
    this.branch.copy(toCopy.branch)
    this.type = toCopy.type
    this.fork.copy(toCopy.fork)
    this.message.copy(toCopy.message)
    this.event.copy(toCopy.event)
  }

  /**
  * Return a copy of this instance.
  *
  * @return A copy of this instance.
  */
  public clone(): UnidocValidationEvent {
    const result: UnidocValidationEvent = new UnidocValidationEvent()
    result.copy(this)
    return result
  }

  /**
  * @see Object.toString
  */
  public toString(): string {
    let result: string = this.index.toString().padEnd(5)

    result += ' branch global #'
    result += this.branch.global.toString().padEnd(5)
    result += ' local #'
    result += this.branch.local.toString().padEnd(5)
    result += ' batch #'
    result += this.batch.toString().padEnd(5)
    result += ' of type #'
    result += this.type
    result += ' ('
    result += UnidocValidationEventType.toString(this.type)
    result += ')'

    switch (this.type) {
      case UnidocValidationEventType.INITIALIZATION:
        result += ' initialization'
        break
      case UnidocValidationEventType.COMPLETION:
        result += ' completion'
        break
      case UnidocValidationEventType.FORK:
        result += ' fork into branch global '
        result += this.fork.global.toString().padEnd(5)
        result += ' local #'
        result += this.fork.local.toString().padEnd(5)
        break
      case UnidocValidationEventType.MESSAGE:
        result += ' '
        result += this.message.toString()
        break
      case UnidocValidationEventType.VALIDATION:
        result += ' validating '
        result += this.event
        break
      default:
        throw new Error(
          'Unable to stringify validation event of type #' + this.type +
          ' (' + UnidocValidationEventType.toString(this.type) + ') because ' +
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

    if (other instanceof UnidocValidationEvent) {
      return this.index === other.index &&
        this.batch === other.batch &&
        this.branch.equals(other.branch) &&
        this.type === other.type &&
        this.fork.equals(other.fork) &&
        this.message.equals(other.message) &&
        this.event.equals(other.event)
    }

    return false
  }
}

export namespace UnidocValidationEvent {
  /**
  * Return a deep copy of the given instance.
  *
  * @param toCopy - An instance to copy.
  *
  * @return A deep copy of the given instance.
  */
  export function copy(toCopy: UnidocValidationEvent): UnidocValidationEvent
  export function copy(toCopy: null): null
  export function copy(toCopy: undefined): undefined
  export function copy(toCopy: UnidocValidationEvent | null | undefined): UnidocValidationEvent | null | undefined {
    return toCopy == null ? toCopy : toCopy.clone()
  }

  export const ALLOCATOR: Allocator<UnidocValidationEvent> = {
    allocate(): UnidocValidationEvent {
      return new UnidocValidationEvent()
    },

    clear(instance: UnidocValidationEvent): void {
      instance.clear()
    },

    copy(source: UnidocValidationEvent, destination: UnidocValidationEvent): void {
      destination.copy(source)
    }
  }
}
