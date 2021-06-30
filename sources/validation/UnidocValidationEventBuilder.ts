import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocValidationMessage } from './UnidocValidationMessage'
import { UnidocValidationEvent } from './UnidocValidationEvent'

/**
 * 
 */
export class UnidocValidationEventBuilder {
  /**
  *
  */
  private event: UnidocValidationEvent

  /**
  *
  */
  public constructor() {
    this.event = new UnidocValidationEvent()
  }

  /**
  *
  */
  public setIndex(index: number): UnidocValidationEventBuilder {
    this.event.setIndex(index)
    return this
  }

  /**
  *
  */
  public setBatch(batch: number): UnidocValidationEventBuilder {
    this.event.setBatch(batch)
    return this
  }

  /**
  *
  */
  public asValidation(event: UnidocEvent): UnidocValidationEventBuilder {
    this.event.asValidation(event)
    return this
  }

  /**
  *
  */
  public asDocumentCompletion(): UnidocValidationEventBuilder {
    this.event.asDocumentCompletion()
    return this
  }

  /**
  *
  */
  public asBeginGroup(group: any): UnidocValidationEventBuilder {
    this.event.asBeginGroup(group)
    return this
  }

  /**
  *
  */
  public asEndGroup(group: any): UnidocValidationEventBuilder {
    this.event.asEndGroup(group)
    return this
  }

  /**
  *
  */
  public asMessage(message?: UnidocValidationMessage): UnidocValidationEventBuilder {
    this.event.asMessage(message)
    return this
  }

  /**
  *
  */
  public build(): UnidocValidationEvent {
    return this.event.clone()
  }

  /**
  *
  */
  public get(): UnidocValidationEvent {
    return this.event
  }

  /**
  *
  */
  public configure(event: UnidocValidationEvent): void {
    event.copy(this.event)
  }

  /**
  *
  */
  public clear(): void {
    this.event.clear()
  }

  /**
  *
  */
  public copy(toCopy: UnidocValidationEventBuilder | UnidocValidationEvent): UnidocValidationEventBuilder {
    if (toCopy instanceof UnidocValidationEventBuilder) {
      this.event.copy(toCopy.event)
    } else {
      this.event.copy(toCopy)
    }

    return this
  }

  /**
  *
  */
  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocValidationEventBuilder) {
      return other.event.equals(this.event)
    }

    return false
  }
}

export namespace UnidocValidationEventBuilder {
  /**
  *
  */
  export const INSTANCE: UnidocValidationEventBuilder = new UnidocValidationEventBuilder()

  /**
  *
  */
  export function create(): UnidocValidationEventBuilder {
    return new UnidocValidationEventBuilder()
  }

  /**
  *
  */
  export function get(): UnidocValidationEventBuilder {
    return INSTANCE
  }
}
