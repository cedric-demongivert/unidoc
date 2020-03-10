import { UnidocLocation } from '../UnidocLocation'

import { UnidocEventType } from './UnidocEventType'
import { UnidocBlockEvent } from './UnidocBlockEvent'
import { UnidocTagEvent } from './UnidocTagEvent'
import { UnidocCommonEvent } from './UnidocCommonEvent'

const BLOCK_EVENT_CONFIGURATION : RegExp = /^(#[a-zA-Z0-9\-]+)?(\.[a-zA-Z0-9\-]+)*$/i
const TAG_EVENT_CONFIGURATION : RegExp = /^([a-zA-Z0-9\-]+)(#[a-zA-Z0-9\-]+)?(\.[a-zA-Z0-9\-]+)*$/i

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
  * UnidocLocation of this event into the document stream.
  */
  location : UnidocLocation

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

  /**
  * Instantiate a new starting block event.
  *
  * @param location - Location of the event into the parent document.
  * @param [configuration = ''] - Identifiers and classes of the resulting block.
  */
  export function blockStart (location : UnidocLocation, configuration : string = '') : UnidocBlockEvent {
    const tokens : RegExpExecArray = BLOCK_EVENT_CONFIGURATION.exec(configuration)
    const result : UnidocBlockEvent = new UnidocBlockEvent()

    result.type = UnidocEventType.START_BLOCK
    result.location.copy(location)
    result.timestamp = Date.now()

    for (let index = 1; index < tokens.length; ++index) {
      const token : string = tokens[index]

      if (token.startsWith('#')) {
        result.identifier = token.substring(1)
      } else {
        result.classes.add(token.substring(1))
      }
    }

    return result
  }

  /**
  * Instantiate a new ending block event.
  *
  * @param location - Location of the event into the parent document.
  */
  export function blockEnd (location : UnidocLocation) : UnidocBlockEvent {
    const result : UnidocBlockEvent = new UnidocBlockEvent()

    result.type = UnidocEventType.END_BLOCK
    result.location.copy(location)
    result.timestamp = Date.now()

    return result
  }

  /**
  * Instantiate a new word event.
  *
  * @param location - Location of the event into the parent document.
  * @param content - Content of the resulting event.
  */
  export function word (location : UnidocLocation, content : string) : UnidocCommonEvent {
    const result : UnidocCommonEvent = new UnidocCommonEvent()

    result.type = UnidocEventType.WORD
    result.location.copy(location)
    result.timestamp = Date.now()
    result.text = content

    return result
  }

  /**
  * Instantiate a new whitespace event.
  *
  * @param location - Location of the event into the parent document.
  * @param content - Content of the resulting event.
  */
  export function whitespace (location : UnidocLocation, content : string) : UnidocCommonEvent {
    const result : UnidocCommonEvent = new UnidocCommonEvent()

    result.type = UnidocEventType.WHITESPACE
    result.location.copy(location)
    result.timestamp = Date.now()
    result.text = content

    return result
  }

  /**
  * Instantiate a new document starting event.
  *
  * @param location - Location of the event into the parent document.
  */
  export function documentStart (location : UnidocLocation) : UnidocCommonEvent {
    const result : UnidocCommonEvent = new UnidocCommonEvent()

    result.type = UnidocEventType.START_DOCUMENT
    result.location.copy(location)
    result.timestamp = Date.now()

    return result
  }

  /**
  * Instantiate a new document ending event.
  *
  * @param location - Location of the event into the parent document.
  */
  export function documentEnd (location : UnidocLocation) : UnidocCommonEvent {
    const result : UnidocCommonEvent = new UnidocCommonEvent()

    result.type = UnidocEventType.END_DOCUMENT
    result.location.copy(location)
    result.timestamp = Date.now()

    return result
  }

  /**
  * Instantiate a new starting tag event.
  *
  * @param location - Location of the event into the parent document.
  * @param configuration - Type, identifiers and classes of the resulting tag.
  */
  export function tagStart (location : UnidocLocation, configuration : string) : UnidocTagEvent {
    const tokens : RegExpExecArray = TAG_EVENT_CONFIGURATION.exec(configuration)
    const result : UnidocTagEvent = new UnidocTagEvent()

    result.type = UnidocEventType.START_TAG
    result.location.copy(location)
    result.timestamp = Date.now()

    for (let index = 1; index < tokens.length; ++index) {
      const token : string = tokens[index]

      if (token.startsWith('#')) {
        result.identifier = token.substring(1)
      } else if (token.startsWith('.')) {
        result.classes.add(token.substring(1))
      } else {
        result.alias = token
      }
    }

    return result
  }

  /**
  * Instantiate a new ending tag event.
  *
  * @param location - Location of the event into the parent document.
  */
  export function tagEnd (location : UnidocLocation) : UnidocTagEvent {
    const result : UnidocTagEvent = new UnidocTagEvent()

    result.type = UnidocEventType.END_TAG
    result.location.copy(location)
    result.timestamp = Date.now()

    return result
  }
}
