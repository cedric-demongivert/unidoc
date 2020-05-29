import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocEventType } from '../event/UnidocEventType'

import { UnidocQueryPredicate } from './UnidocQueryPredicate'

export function isTagWithIdentifier (identifiers : Iterable<string>) : UnidocQueryPredicate {
  const identifierSet : Set<string> = new Set<string>(identifiers)

  function mapper (event : UnidocEvent | symbol) : boolean {
    if (typeof event === 'symbol') return false

    switch (event.type) {
      case UnidocEventType.START_TAG:
      case UnidocEventType.END_TAG:
        return identifierSet.has(event.identifier)
      default:
        return false
    }
  }

  mapper.toString = function toString () : string {
    return 'is tag with ' + [...identifierSet].join(' or ') + ' identifier'
  }

  return mapper
}
