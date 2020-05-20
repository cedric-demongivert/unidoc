import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocEventType } from '../event/UnidocEventType'

import { UnidocMapper } from './UnidocMapper'

export function isTagWithIdentifier (identifiers : Iterable<string>) : UnidocMapper<UnidocEvent, boolean> {
  const identifierSet : Set<string> = new Set<string>(identifiers)

  function mapper (event : UnidocEvent) : boolean {
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
