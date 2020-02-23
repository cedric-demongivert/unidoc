import { Location } from '../Location'

import { UnidocEvent } from './UnidocEvent'
import { UnidocEventType } from './UnidocEventType'

const EMPTY_ALIAS : string = ''

/**
* An event emitted when the parser enter or exit a tag structure.
*/
export class UnidocTagEvent implements UnidocEvent {
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
  * The alias of the discovered tag.
  */
  public alias : string

  /**
  * The tag type, may be undefined if the tag was not recognized.
  */
  public tag : number

  /**
  * Identifier of this tag, may be undefined
  */
  public identifier : string

  /**
  * Classes of this tag.
  */
  public readonly classes : Set<string>

  /**
  * Instantiate a new tag event.
  */
  public constructor () {
    this.timestamp  = Date.now()
    this.type       = UnidocEventType.START_TAG
    this.location   = new Location()
    this.alias      = EMPTY_ALIAS
    this.tag        = undefined
    this.identifier = undefined
    this.classes    = new Set<string>()
  }

  /**
  * Deep copy an existing instance.
  *
  * @param toCopy - An instance to copy.
  */
  public copy (toCopy : UnidocTagEvent) : void {
    this.timestamp  = toCopy.timestamp
    this.type       = toCopy.type
    this.alias      = toCopy.alias
    this.tag        = toCopy.tag
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
  public clone () : UnidocTagEvent {
    const result : UnidocTagEvent = new UnidocTagEvent()
    result.copy(this)
    return result
  }

  /**
  * @see UnidocEvent#clear
  */
  public clear () : void {
    this.timestamp  = Date.now()
    this.alias      = EMPTY_ALIAS
    this.tag        = undefined
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
    result += ' \\'
    result += this.alias

    if (this.tag != null) {
      result += '@'
      result += this.tag
    }

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
  public equals (other : any) {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocTagEvent) {
      if (other.timestamp !== this.timestamp) return false
      if (other.classes.size != this.classes.size) return false

      for (const clazz of other.classes) {
        if (!this.classes.has(clazz)) {
          return false
        }
      }

      return other.identifier === this.identifier &&
             other.alias === this.alias &&
             other.tag === this.tag
    }

    return false
  }
}

export namespace UnidocTagEvent {
  /**
  * Return a deep copy of the given instance.
  *
  * @param toCopy - An instance to copy.
  *
  * @return A deep copy of the given instance.
  */
  export function copy (toCopy : UnidocTagEvent) : UnidocTagEvent {
    return toCopy == null ? null : toCopy.clone()
  }
}
