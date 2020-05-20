import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocEventType } from '../event/UnidocEventType'

/**
* Return true if the given event is a tag-related event.
*
* @param event - A unidoc event.
*
* @return True if the given event is a tag-related event.
*/
export function isTag (event : UnidocEvent) : boolean {
  switch (event.type) {
    case UnidocEventType.START_TAG:
    case UnidocEventType.END_TAG:
      return true
    default:
      return false
  }
}

isTag.toString = function toString () : string {
  return 'is tag'
}
