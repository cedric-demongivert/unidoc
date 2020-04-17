import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocEventType } from '../event/UnidocEventType'

import { UnidocSelector } from './UnidocSelector'

export class TagSelector implements UnidocSelector {
  public static INSTANCE : TagSelector = new TagSelector()

  /**
  * @see UnidocSelector.next
  */
  public next (event : UnidocEvent) : boolean {
    return event.type === UnidocEventType.START_TAG ||
           event.type === UnidocEventType.END_TAG
  }

  /**
  * @see UnidocSelector.reset
  */
  public reset () : void {
    
  }

  /**
  * @see UnidocSelector.clone
  */
  public clone () : TagSelector {
    return TagSelector.INSTANCE
  }

  /**
  * @see UnidocSelector.toString
  */
  public toString () : string {
    return 'is tag'
  }
}
