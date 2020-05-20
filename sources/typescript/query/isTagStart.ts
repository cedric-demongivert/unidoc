import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocEventType } from '../event/UnidocEventType'

/**
* Return true if the given event notify the begining of a tag.
*
* @param event - A unidoc event.
*
* @return True if the given event notify the begining of a tag.
*/
export function isTagStart (event : UnidocEvent) : boolean {
  return event.type === UnidocEventType.START_TAG
}

isTagStart.toString = function toString () : string {
  return 'is tag begining'
}
