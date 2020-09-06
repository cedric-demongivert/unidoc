import { UnidocEvent } from './event/UnidocEvent'
import { UnidocEventType } from './event/UnidocEventType'

export function isTagEvent (event : UnidocEvent) : boolean {
  return event.type === UnidocEventType.START_TAG ||
         event.type === UnidocEventType.END_TAG
}
