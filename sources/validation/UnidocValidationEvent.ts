import { Allocator } from '@cedric-demongivert/gl-tool-collection'

import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocBlueprint } from '../blueprint/UnidocBlueprint'

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
  * Batch index of this event that is equal to the number of validation events
  * that precede it.
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
  * The target identifier if this is an UnidocValidationEventType.FORK or an
  * UnidocValidationEventType.MERGE event.
  */
  public readonly target: UnidocValidationBranchIdentifier

  /**
  * The event that is validated if this is a
  * UnidocValidationEventType.VALIDATION event.
  */
  public readonly event: UnidocEvent

  /**
  * The message that is published if this is a UnidocValidationEventType.MESSAGE
  * event.
  */
  public readonly message: UnidocValidationMessage

  /**
  * The related blueprint if this is a UnidocValidationEventType.ENTER_BLUEPRINT
  * or UnidocValidationEventType.EXIT_BLUEPRINT.
  */
  public blueprint: UnidocBlueprint | null

  /**
  * Instantiate a new event instance.
  */
  public constructor() {
    this.index = 0
    this.batch = 0
    this.branch = new UnidocValidationBranchIdentifier()
    this.type = UnidocValidationEventType.DEFAULT
    this.target = new UnidocValidationBranchIdentifier()
    this.event = new UnidocEvent()
    this.message = new UnidocValidationMessage()
    this.blueprint = null
  }

  /**
  * Clear this event instance in order to reuse it.
  */
  public clear(): void {
    this.index = 0
    this.batch = 0
    this.branch.clear()
    this.type = UnidocValidationEventType.DEFAULT
    this.target.clear()
    this.message.clear()
    this.event.clear()
    this.blueprint = null
  }

  /**
  * Set the branch that emitted this event.
  *
  * @param branch - The branch that emitted this event.
  *
  * @return This event instance for chaining purposes.
  */
  public fromBranch(branch: UnidocValidationBranchIdentifier): UnidocValidationEvent {
    this.branch.copy(branch)
    return this
  }

  public ofIndex(index: number): UnidocValidationEvent {
    this.index = index
    return this
  }

  public ofBatch(batch: number): UnidocValidationEvent {
    this.batch = batch
    return this
  }

  /**
  * Transform this event instance into a fork event.
  *
  * @param target - The branch in which the original branch forked.
  *
  * @return This event instance for chaining purposes.
  */
  public asFork(target: UnidocValidationBranchIdentifier): UnidocValidationEvent {
    this.event.clear()
    this.message.clear()
    this.target.copy(target)
    this.type = UnidocValidationEventType.FORK
    this.blueprint = null
    return this
  }

  /**
  * Transform this event instance into a forked event.
  *
  * @param source
  *
  * @return This event instance for chaining purposes.
  */
  public asForked(source: UnidocValidationBranchIdentifier): UnidocValidationEvent {
    this.event.clear()
    this.message.clear()
    this.target.copy(source)
    this.type = UnidocValidationEventType.FORKED
    this.blueprint = null
    return this
  }

  /**
  * Transform this event instance into a merge event.
  *
  * @param target - The branch in which the original branch merged.
  *
  * @return This event instance for chaining purposes.
  */
  public asMerge(target: UnidocValidationBranchIdentifier): UnidocValidationEvent {
    this.event.clear()
    this.message.clear()
    this.target.copy(target)
    this.type = UnidocValidationEventType.MERGE
    this.blueprint = null
    return this
  }

  /**
  * Transform this event instance into a branch creation event.
  *
  * @return This event instance for chaining purposes.
  */
  public asCreation(): UnidocValidationEvent {
    this.event.clear()
    this.message.clear()
    this.target.clear()
    this.type = UnidocValidationEventType.CREATION
    this.blueprint = null
    return this
  }

  /**
  * Transform this event instance into a branch termination event.
  *
  * @return This event instance for chaining purposes.
  */
  public asTermination(): UnidocValidationEvent {
    this.event.clear()
    this.message.clear()
    this.target.clear()
    this.type = UnidocValidationEventType.TERMINATION
    this.blueprint = null
    return this
  }

  /**
  * Transform this event instance into a validation event.
  *
  * @param event - The unidoc event that is validated at this point.
  *
  * @return This event instance for chaining purposes.
  */
  public asValidation(event: UnidocEvent): UnidocValidationEvent {
    this.message.clear()
    this.target.clear()
    this.event.copy(event)
    this.type = UnidocValidationEventType.VALIDATION
    this.blueprint = null
    return this
  }

  /**
  * Transform this event instance into a document completion event.
  *
  * @return This event instance for chaining purposes.
  */
  public asDocumentCompletion(): UnidocValidationEvent {
    this.message.clear()
    this.target.clear()
    this.event.clear()
    this.type = UnidocValidationEventType.DOCUMENT_COMPLETION
    this.blueprint = null
    return this
  }

  /**
  * Transform this event instance into a document completion event.
  *
  * @return This event instance for chaining purposes.
  */
  public asEnterBlueprint(blueprint: UnidocBlueprint): UnidocValidationEvent {
    this.message.clear()
    this.target.clear()
    this.event.clear()
    this.type = UnidocValidationEventType.ENTER_BLUEPRINT
    this.blueprint = blueprint
    return this
  }

  /**
  * Transform this event instance into a document completion event.
  *
  * @return This event instance for chaining purposes.
  */
  public asExitBlueprint(blueprint: UnidocBlueprint): UnidocValidationEvent {
    this.message.clear()
    this.target.clear()
    this.event.clear()
    this.type = UnidocValidationEventType.EXIT_BLUEPRINT
    this.blueprint = blueprint
    return this
  }

  /**
  * Transform this event instance into a message event.
  *
  * @param [message] - The message to publish.
  *
  * @return This event instance for chaining purposes.
  */
  public asMessage(message?: UnidocValidationMessage): UnidocValidationEvent {
    this.event.clear()
    this.target.clear()

    if (message) {
      this.message.copy(message)
    } else {
      this.message.clear()
    }

    this.type = UnidocValidationEventType.MESSAGE
    this.blueprint = null
    return this
  }

  public asMessageOfType(type: UnidocValidationMessageType): UnidocValidationEvent {
    this.event.clear()
    this.target.clear()
    this.message.clear()
    this.message.type = type
    this.type = UnidocValidationEventType.MESSAGE
    this.blueprint = null
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
    this.target.copy(toCopy.target)
    this.message.copy(toCopy.message)
    this.event.copy(toCopy.event)
    this.blueprint = toCopy.blueprint
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
      case UnidocValidationEventType.CREATION:
        result += ' creation'
        break
      case UnidocValidationEventType.TERMINATION:
        result += ' termination'
        break
      case UnidocValidationEventType.FORKED:
        result += ' forked from branch '
        result += this.target.toLongString()
        break
      case UnidocValidationEventType.FORK:
        result += ' fork into branch '
        result += this.target.toLongString()
        break
      case UnidocValidationEventType.MESSAGE:
        result += ' '
        result += this.message.toString()
        break
      case UnidocValidationEventType.VALIDATION:
        result += ' validating '
        result += this.event
        break
      case UnidocValidationEventType.DOCUMENT_COMPLETION:
        result += ' document completion'
        break
      case UnidocValidationEventType.MERGE:
        result += ' merge into branch '
        result += this.target.toLongString()
        break
      case UnidocValidationEventType.ENTER_BLUEPRINT:
        result += ' entering blueprint '
        result += this.blueprint ? this.blueprint.toString() : 'null'
        break
      case UnidocValidationEventType.EXIT_BLUEPRINT:
        result += ' exiting blueprint '
        result += this.blueprint ? this.blueprint.toString() : 'null'
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
      return (
        this.index === other.index &&
        this.batch === other.batch &&
        this.branch.equals(other.branch) &&
        this.type === other.type &&
        this.target.equals(other.target) &&
        this.message.equals(other.message) &&
        this.event.equals(other.event) &&
        this.blueprint === other.blueprint
      )
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

  export function fromBranch(branch: UnidocValidationBranchIdentifier): UnidocValidationEvent {
    return new UnidocValidationEvent().fromBranch(branch)
  }

  export function create(): UnidocValidationEvent {
    return new UnidocValidationEvent()
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
