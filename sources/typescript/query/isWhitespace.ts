import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocEventType } from '../event/UnidocEventType'

/**
* Return true if the given event notify a whitespace.
*
* @param event - A unidoc event.
*
* @return True if the given event notify a whitespace.
*/
export function isWhitespace (event : UnidocEvent) : boolean {
  return event.type === UnidocEventType.WHITESPACE
}

isWhitespace.toString = function toString () : string {
  return 'is whitespace'
}
