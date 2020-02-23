import { Location } from '../Location'

import { UnidocEventType } from './UnidocEventType'

/**
* A unidoc event.
*/
export interface UnidocEvent {
  /**
  * This event creation timestamp.
  */
  timestamp : number

  /**
  * Type of this event.
  */
  type : UnidocEventType

  /**
  * Location of this event into the document stream.
  */
  location : Location

  /**
  * @return A deep copy of this event.
  */
  clone () : UnidocEvent

  /**
  * Reset this event instance in order to reuse it.
  */
  clear () : void

  /**
  * @see Object#toString
  */
  toString () : string

  /**
  * @see Object#equals
  */
  equals (other : any) : boolean
}

export namespace UnidocEvent {
  /**
  * Return a deep copy of the given instance.
  *
  * @param toCopy - An instance to copy.
  *
  * @return A deep copy of the given instance.
  */
  export function copy (toCopy : UnidocEvent) : UnidocEvent {
    return toCopy == null ? null : toCopy.clone()
  }
}
