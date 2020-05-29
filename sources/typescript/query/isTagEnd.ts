import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocEventType } from '../event/UnidocEventType'

/**
* Return true if the given event notify the termination of a tag.
*
* @param event - A unidoc event.
*
* @return True if the given event notify the termination of a tag.
*/
export function isTagEnd (event : UnidocEvent | symbol) : boolean {
  if (typeof event === 'symbol') return false
  
  return event.type === UnidocEventType.END_TAG
}

isTagEnd.toString = function toString () : string {
  return 'is tag end'
}
