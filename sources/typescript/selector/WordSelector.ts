import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocEventType } from '../event/UnidocEventType'

import { UnidocSelector } from './UnidocSelector'

export class WordSelector implements UnidocSelector {
  public static INSTANCE : WordSelector = new WordSelector()

  /**
  * @see UnidocSelector.next
  */
  public next (event : UnidocEvent) : boolean {
    return event.type === UnidocEventType.WORD
  }

  /**
  * @see UnidocSelector.reset
  */
  public reset () : void {

  }

  /**
  * @see UnidocSelector.clone
  */
  public clone () : WordSelector {
    return WordSelector.INSTANCE
  }

  /**
  * @see UnidocSelector.toString
  */
  public toString () : string {
    return 'is word'
  }
}
