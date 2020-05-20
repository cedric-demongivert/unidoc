import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocEventType } from '../event/UnidocEventType'

import { UnidocMapper } from './UnidocMapper'

export function isTagWithClass (classes : Iterable<string>) : UnidocMapper<UnidocEvent, boolean> {
  const classSet : Set<string> = new Set<string>(classes)

  function mapper (event : UnidocEvent) : boolean {
    switch (event.type) {
      case UnidocEventType.START_TAG:
      case UnidocEventType.END_TAG:
        if (event.classes.size === classSet.size) {
          for (const clazz of classSet) {
            if (!event.classes.has(clazz)) {
              return false
            }
          }

          return true
        }
      default:
        return false
    }
  }

  mapper.toString = function toString () : string {
    return 'is tag with ' + [...classSet].join(' and ') + ' class'
  }

  return mapper
}
