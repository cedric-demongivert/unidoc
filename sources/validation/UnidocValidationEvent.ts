import { Duplicator } from '@cedric-demongivert/gl-tool-collection'

import { UnidocEvent } from '../event/UnidocEvent'

import { UnidocValidationMessage } from './UnidocValidationMessage'
import { UnidocValidationEventType } from './UnidocValidationEventType'

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
  * Type of validation event emitted.
  */
  public type: UnidocValidationEventType

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
  * The related blueprint if this is a UnidocValidationEventType.BEGIN_GROUP
  * or UnidocValidationEventType.END_GROUP.
  */
  public group: any

  /**
  * Instantiate a new event instance.
  */
  public constructor() {
    this.index = 0
    this.batch = 0
    this.type = UnidocValidationEventType.DEFAULT
    this.event = new UnidocEvent()
    this.message = new UnidocValidationMessage()
    this.group = undefined
  }

  /**
  *
  */
  public setIndex(index: number): UnidocValidationEvent {
    this.index = index
    return this
  }

  /**
  *
  */
  public setBatch(batch: number): UnidocValidationEvent {
    this.batch = batch
    return this
  }

  /**
  *
  */
  public isMessage(): boolean {
    return this.type === UnidocValidationEventType.MESSAGE
  }

  /**
  *
  */
  public isValidation(): boolean {
    return this.type === UnidocValidationEventType.VALIDATION
  }

  /**
  *
  */
  public isBeginGroup(): boolean {
    return this.type === UnidocValidationEventType.BEGIN_GROUP
  }

  /**
  *
  */
  public isEndGroup(): boolean {
    return this.type === UnidocValidationEventType.END_GROUP
  }

  /**
  *
  */
  public isDocumentCompletion(): boolean {
    return this.type === UnidocValidationEventType.DOCUMENT_COMPLETION
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
    this.event.copy(event)
    this.type = UnidocValidationEventType.VALIDATION
    this.group = undefined
    return this
  }

  /**
  * Transform this event instance into a document completion event.
  *
  * @return This event instance for chaining purposes.
  */
  public asDocumentCompletion(): UnidocValidationEvent {
    this.message.clear()
    this.event.clear()
    this.type = UnidocValidationEventType.DOCUMENT_COMPLETION
    this.group = undefined
    return this
  }

  /**
  *
  */
  public asBeginGroup(group: any): UnidocValidationEvent {
    this.message.clear()
    this.event.clear()
    this.type = UnidocValidationEventType.BEGIN_GROUP
    this.group = group
    return this
  }

  /**
  *
  */
  public asEndGroup(group: any): UnidocValidationEvent {
    this.message.clear()
    this.event.clear()
    this.type = UnidocValidationEventType.END_GROUP
    this.group = group
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

    if (message) {
      this.message.copy(message)
    } else {
      this.message.clear()
    }

    this.type = UnidocValidationEventType.MESSAGE
    this.group = undefined
    return this
  }

  /**
  * Clear this event instance in order to reuse it.
  */
  public clear(): void {
    this.index = 0
    this.batch = 0
    this.type = UnidocValidationEventType.DEFAULT
    this.message.clear()
    this.event.clear()
    this.group = undefined
  }

  /**
  * Copy an existing instance.
  *
  * @param toCopy - An instance to copy.
  */
  public copy(toCopy: UnidocValidationEvent): void {
    this.index = toCopy.index
    this.batch = toCopy.batch
    this.type = toCopy.type
    this.message.copy(toCopy.message)
    this.event.copy(toCopy.event)
    this.group = toCopy.group
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

    result += ' batch #'
    result += this.batch.toString().padEnd(5)
    result += ' of type '
    result += UnidocValidationEventType.toDebugString(this.type)

    switch (this.type) {
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
      case UnidocValidationEventType.BEGIN_GROUP:
        result += ' start of group '
        result += this.group ? this.group.toString() : 'null'
        break
      case UnidocValidationEventType.END_GROUP:
        result += ' end of group '
        result += this.group ? this.group.toString() : 'null'
        break
      default:
        throw new Error(
          'Unable to stringify validation event of type ' +
          UnidocValidationEventType.toDebugString(this.type) + ' because ' +
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
        this.type === other.type &&
        this.message.equals(other.message) &&
        this.event.equals(other.event) &&
        this.group === other.group
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
  export function copy(toCopy: UnidocValidationEvent | null | undefined): UnidocValidationEvent | null | undefined
  export function copy(toCopy: UnidocValidationEvent | null | undefined): UnidocValidationEvent | null | undefined {
    return toCopy == null ? toCopy : toCopy.clone()
  }

  /**
  *
  */
  export function create(): UnidocValidationEvent {
    return new UnidocValidationEvent()
  }

  /**
  *
  */
  export const ALLOCATOR: Duplicator<UnidocValidationEvent> = Duplicator.fromFactory(create)
}
