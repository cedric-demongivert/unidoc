import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocEventType } from '../event/UnidocEventType'

export function isCountableEvent (event : UnidocEvent) : boolean {
  return event.type !== UnidocEventType.END_TAG
}

isCountableEvent.toString = function toString () : string {
  return 'is contable event'
}
