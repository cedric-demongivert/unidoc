import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocEventType } from '../event/UnidocEventType'

/**
* Compute the count of different unidoc elements in the stream.
*
* @param state - Current count.
* @param event - Event to reduce.
*
* @return The current count of different unidoc elements in the stream.
*/
export function count (state : number, event : UnidocEvent) : number {
  return state + (event.type = UnidocEventType.END_TAG ? 0 : 1)
}

count.toString = function toString () : string {
  return '$count'
}
