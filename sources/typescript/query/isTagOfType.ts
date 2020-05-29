import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocEventType } from '../event/UnidocEventType'

import { UnidocQueryPredicate } from './UnidocQueryPredicate'

/**
* Return a mapping function that returns true if the given event is related
* to a tag of any of the given types.
*
* @param types - Tag types to find.
*
* @return A mapping function that returns true if the given event is related
*         to a tag of any of the given types.
*/
export function isTagOfType (types : Iterable<string>) : UnidocQueryPredicate {
  const typeSet : Set<string> = new Set<string>(types)

  function mapper (event : UnidocEvent | symbol) : boolean {
    if (typeof event === 'symbol') return false

    switch (event.type) {
      case UnidocEventType.START_TAG:
      case UnidocEventType.END_TAG:
        return typeSet.has(event.tag)
      default:
        return false
    }
  }

  mapper.toString = function toString () : string {
    return 'is ' + [...typeSet].join(' or ') + ' tag'
  }

  return mapper
}
