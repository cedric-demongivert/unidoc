import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocEventType } from '../event/UnidocEventType'

import { UnidocQueryPredicate } from './UnidocQueryPredicate'

/**
* Return a mapping function that returns true if the given event is the starting
* of a tag of any of the given types.
*
* @param types - Tag types to find.
*
* @return A mapping function that returns true if the given event is the
*         starting of a tag of any of the given types.
*/
export function isTagStartOfType (types : Iterable<string>) : UnidocQueryPredicate {
  const typeSet : Set<string> = new Set<string>(types)

  function mapper (event : UnidocEvent | symbol) : boolean {
    if (typeof event === 'symbol') return false

    switch (event.type) {
      case UnidocEventType.START_TAG:
        return typeSet.has(event.tag)
      default:
        return false
    }
  }

  mapper.toString = function toString () : string {
    return 'is ' + [...typeSet].join(' or ') + ' tag start'
  }

  return mapper
}
