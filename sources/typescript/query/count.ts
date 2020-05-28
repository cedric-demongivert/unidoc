import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocEventType } from '../event/UnidocEventType'

/**
* Compute the count of truthy values in a stream.
*
* @param state - Current count of element.
* @param value - Value to reduce.
*
* @return The next count of truthy values in the stream.
*/
export function count (state : number, value : boolean) : number {
  return state + (value ? 1 : 0)
}

count.toString = function toString () : string {
  return '$count'
}
