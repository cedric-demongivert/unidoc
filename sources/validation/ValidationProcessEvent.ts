import { Allocator } from '@cedric-demongivert/gl-tool-collection'

import { UnidocEvent } from '../event/UnidocEvent'

import { UnidocValidationType } from './UnidocValidationType'
import { ValidationProcessEventType } from './ValidationProcessEventType'

const EMPTY_STRING : string = ''

export class ValidationProcessEvent {
  public type          : ValidationProcessEventType
  public messageType   : UnidocValidationType
  public event         : UnidocEvent
  public code          : string
  public readonly data : Map<string, any>

  /**
  * Instantiate a new validation instance.
  */
  public constructor () {
    this.type = ValidationProcessEventType.DEFAULT
    this.messageType = UnidocValidationType.DEFAULT
    this.event = new UnidocEvent()
    this.code = EMPTY_STRING
    this.data = new Map<string, any>()
  }

  /**
  * Clear this validation instance in order to reuse it.
  */
  public clear () : void {
    this.type = UnidocValidationType.DEFAULT
    this.messageType = UnidocValidationType.DEFAULT
    this.code = EMPTY_STRING
    this.data.clear()
    this.event.clear()
  }

  /**
  * Copy an existing instance.
  *
  * @param toCopy - An instance to copy.
  */
  public copy (toCopy : ValidationProcessEvent) : void {
    this.type = toCopy.type
    this.messageType = toCopy.messageType
    this.code = toCopy.code
    this.event = toCopy.event.clone()
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
  public clone () : ValidationProcessEvent {
    const result : ValidationProcessEvent = new ValidationProcessEvent()
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

    if (other instanceof ValidationProcessEvent) {
      if (
        other.type !== this.type ||
        other.messageType !== this.messageType ||
        other.code !== this.code ||
        other.event.equals(this.event) ||
        other.data.size !== this.data.size
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

export namespace ValidationProcessEvent {
  /**
  * Return a deep copy of the given instance.
  *
  * @param toCopy - An instance to copy.
  *
  * @return A deep copy of the given instance.
  */
  export function copy (toCopy : ValidationProcessEvent) : ValidationProcessEvent
  export function copy (toCopy : null) : null
  export function copy (toCopy : undefined) : undefined
  export function copy (toCopy : ValidationProcessEvent | null | undefined) : ValidationProcessEvent | null | undefined {
    return toCopy == null ? toCopy : toCopy.clone()
  }

  export const ALLOCATOR : Allocator<ValidationProcessEvent> = {
    allocate () : ValidationProcessEvent {
      return new ValidationProcessEvent()
    },

    clear (instance : ValidationProcessEvent) : void {
      instance.clear()
    },

    copy (source : ValidationProcessEvent, destination : ValidationProcessEvent) : void {
      destination.copy(source)
    }
  }
}
