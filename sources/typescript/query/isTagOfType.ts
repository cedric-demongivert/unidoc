import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocEventType } from '../event/UnidocEventType'

import { UnidocMapper } from './UnidocMapper'

export function isTagOfType (types : Iterable<string>) : UnidocMapper<UnidocEvent, boolean> {
  const typeSet : Set<string> = new Set<string>(types)

  function mapper (event : UnidocEvent) : boolean {
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
