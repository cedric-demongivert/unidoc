import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocEventType } from '../event/UnidocEventType'

import { UnidocSelector } from './UnidocSelector'

export class WhitespaceSelector implements UnidocSelector {
  public static INSTANCE : WhitespaceSelector = new WhitespaceSelector()

  /**
  * @see UnidocSelector.next
  */
  public next (event : UnidocEvent) : boolean {
    return event.type === UnidocEventType.WHITESPACE
  }

  /**
  * @see UnidocSelector.reset
  */
  public reset () : void {

  }

  /**
  * @see UnidocSelector.clone
  */
  public clone () : WhitespaceSelector {
    return WhitespaceSelector.INSTANCE
  }

  /**
  * @see UnidocSelector.toString
  */
  public toString () : string {
    return 'is whitespace'
  }
}
