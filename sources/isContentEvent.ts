import { UnidocEvent } from './event/UnidocEvent'
import { UnidocEventType } from './event/UnidocEventType'

export function isContentEvent (event : UnidocEvent) : boolean {
  return event.type === UnidocEventType.WORD ||
         event.type === UnidocEventType.WHITESPACE
}
