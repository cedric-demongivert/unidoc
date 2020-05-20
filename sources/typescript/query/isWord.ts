import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocEventType } from '../event/UnidocEventType'

/**
* Return true if the given event notify a word.
*
* @param event - A unidoc event.
*
* @return True if the given event notify a word.
*/
export function isWord (event : UnidocEvent) : boolean {
  return event.type === UnidocEventType.WORD
}

isWord.toString = function toString () : string {
  return 'is word'
}
