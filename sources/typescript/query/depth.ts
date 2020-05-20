import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocEventType } from '../event/UnidocEventType'

/**
* Compute the depth of the given event into it's parent tag tree.
*
* @param state - Current depth.
* @param event - Event to reduce.
*
* @return The current depth of the given event into it's parent tag tree.
*/
export function depth (state : number, event : UnidocEvent) : number {
  switch (event.type) {
    case UnidocEventType.START_TAG:
      return state + 1
    case UnidocEventType.END_TAG:
      return state - 1
    default:
      return state
  }
}

depth.toString = function toString () : string {
  return '$depth'
}
