import { Allocator } from '@cedric-demongivert/gl-tool-collection'

import { UnidocEvent } from '../event/UnidocEvent'

import { UnidocValidation } from './UnidocValidation'
import { UnidocValidationProcessEventType } from './UnidocValidationProcessEventType'

export class UnidocValidationProcessEvent {
  public type                   : UnidocValidationProcessEventType
  public readonly event         : UnidocEvent
  public readonly validation    : UnidocValidation

  /**
  * Instantiate a new validation instance.
  */
  public constructor () {
    this.type = UnidocValidationProcessEventType.DEFAULT
    this.event = new UnidocEvent()
    this.validation = new UnidocValidation()
  }

  public asSequenceStart() : void {
    this.type = UnidocValidationProcessEventType.START_SEQUENCE
  }

  public asSequenceEnd () : void {
    this.type = UnidocValidationProcessEventType.END_SEQUENCE
  }

  public asForkStart () : void {
    this.type = UnidocValidationProcessEventType.START_FORK
  }

  public asForkEnd () : void {
    this.type = UnidocValidationProcessEventType.END_FORK
  }

  public asValidation () : void {
    this.type = UnidocValidationProcessEventType.VALIDATION
  }

  public asMessage (validation : UnidocValidation) : void {
    this.type = UnidocValidationProcessEventType.MESSAGE
    this.validation.copy(validation)
  }

  public asRecovery () : void {
    this.type = UnidocValidationProcessEventType.RECOVERY
  }

  /**
  * Clear this validation instance in order to reuse it.
  */
  public clear () : void {
    this.type = UnidocValidationProcessEventType.DEFAULT
    this.validation.clear()
    this.event.clear()
  }

  /**
  * Copy an existing instance.
  *
  * @param toCopy - An instance to copy.
  */
  public copy (toCopy : UnidocValidationProcessEvent) : void {
    this.type = toCopy.type
    this.validation.copy(toCopy.validation)
    this.event.copy(toCopy.event)
  }

  /**
  * Return a copy of this instance.
  *
  * @return A copy of this instance.
  */
  public clone () : UnidocValidationProcessEvent {
    const result : UnidocValidationProcessEvent = new UnidocValidationProcessEvent()
    result.copy(this)
    return result
  }

  /**
  * @see Object.toString
  */
  // public toString () : string {
  //   return (
  //     `[${UnidocValidationType.toString(this.type)}] ${this.path.toString()} ${this.code} : {${[...this.data.entries()].map(x => x[0] + ': ' + x[1]).join(', ')}}`
  //   )
  // }

  /**
  * @see Object.equals
  */
  public equals (other : any) : boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocValidationProcessEvent) {
      return this.type === other.type &&
             this.validation.equals(other.validation) &&
             this.event.equals(other.event)
    }

    return false
  }
}

export namespace UnidocValidationProcessEvent {
  /**
  * Return a deep copy of the given instance.
  *
  * @param toCopy - An instance to copy.
  *
  * @return A deep copy of the given instance.
  */
  export function copy (toCopy : UnidocValidationProcessEvent) : UnidocValidationProcessEvent
  export function copy (toCopy : null) : null
  export function copy (toCopy : undefined) : undefined
  export function copy (toCopy : UnidocValidationProcessEvent | null | undefined) : UnidocValidationProcessEvent | null | undefined {
    return toCopy == null ? toCopy : toCopy.clone()
  }

  export const ALLOCATOR : Allocator<UnidocValidationProcessEvent> = {
    allocate () : UnidocValidationProcessEvent {
      return new UnidocValidationProcessEvent()
    },

    clear (instance : UnidocValidationProcessEvent) : void {
      instance.clear()
    },

    copy (source : UnidocValidationProcessEvent, destination : UnidocValidationProcessEvent) : void {
      destination.copy(source)
    }
  }
}
