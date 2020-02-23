import { Location } from '../Location'

import { UnidocEvent } from './UnidocEvent'
import { UnidocEventType } from './UnidocEventType'

/**
* An event emitted when the parser enter or exit a block structure.
*/
export class UnidocBlockEvent implements UnidocEvent {
  /**
  * @see UnidocEvent.timestamp
  */
  public timestamp : number

  /**
  * @see UnidocEvent.type
  */
  public type : UnidocEventType

  /**
  * @see UnidocEvent.location
  */
  public readonly location : Location

  /**
  * Identifier of this block, may be undefined
  */
  public identifier : string

  /**
  * Classes of this block.
  */
  public readonly classes : Set<string>

  /**
  * Instantiate a new block event.
  */
  public constructor () {
    this.timestamp  = Date.now()
    this.type       = UnidocEventType.START_BLOCK
    this.location   = new Location()
    this.identifier = undefined
    this.classes    = new Set<string>()
  }

  /**
  * Deep copy an existing instance.
  *
  * @param toCopy - An instance to copy.
  */
  public copy (toCopy : UnidocBlockEvent) : void {
    this.timestamp  = toCopy.timestamp
    this.type       = toCopy.type
    this.identifier = toCopy.identifier

    this.location.copy(toCopy.location)

    this.classes.clear()
    for (const clazz of toCopy.classes) {
      this.classes.add(clazz)
    }
  }

  /**
  * @see UnidocEvent#clone
  */
  public clone () : UnidocBlockEvent {
    const result : UnidocBlockEvent = new UnidocBlockEvent()
    result.copy(this)
    return result
  }

  /**
  * @see UnidocEvent#clear
  */
  public clear () : void {
    this.timestamp  = Date.now()
    this.identifier = undefined

    this.location.clear()
    this.classes.clear()
  }

  /**
  * @see Object#toString
  */
  public toString () : string {
    let result : string = ''

    result += this.timestamp
    result += ' '
    result += UnidocEventType.toString(this.type)
    result += ' '
    result += this.location.toString()

    if (this.identifier != null) {
      result += ' #'
      result += this.identifier
    }

    if (this.classes.size > 0) {
      result += ' '
      for (const clazz of this.classes) {
        result += '.'
        result += clazz
      }
    }

    return result
  }

  /**
  * @see Object#equals
  */
  public equals (other : any) : boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocBlockEvent) {
      if (
        other.timestamp !== this.timestamp      ||
        other.identifier === this.identifier    ||
        other.classes.size != this.classes.size
      ) return false

      for (const clazz of other.classes) {
        if (!this.classes.has(clazz)) {
          return false
        }
      }

      return true
    }

    return false
  }
}

export namespace UnidocBlockEvent {
  /**
  * Return a deep copy of the given instance.
  *
  * @param toCopy - An instance to copy.
  *
  * @return A deep copy of the given instance.
  */
  export function copy (toCopy : UnidocBlockEvent) : UnidocBlockEvent {
    return toCopy == null ? null : toCopy.clone()
  }
}
