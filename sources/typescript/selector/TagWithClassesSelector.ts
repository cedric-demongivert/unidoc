import { UnidocEvent } from '../event/UnidocEvent'

import { UnidocSelector } from './UnidocSelector'
import { TagSelector } from './TagSelector'

export class TagWithClassesSelector implements UnidocSelector {
  public readonly classes : Set<string>

  /**
  * Instantiate a new tag with classes selector.
  *
  * @param classes - Classes to search.
  */
  public constructor (classes : Iterable<string>) {
    this.classes = new Set<string>(classes)
    Object.freeze(this.classes)
  }

  /**
  * @see UnidocSelector.next
  */
  public next (event : UnidocEvent) : boolean {
    if (TagSelector.INSTANCE.next(event)) {
      if (event.classes.size === this.classes.size) {
        for (const clazz of this.classes) {
          if (!event.classes.has(clazz)) {
            return false
          }
        }

        return true
      }
    }

    return false
  }

  /**
  * @see UnidocSelector.reset
  */
  public reset () : void {

  }

  /**
  * @see UnidocSelector.clone
  */
  public clone () : TagWithClassesSelector {
    return this
  }

  /**
  * @see UnidocSelector.toString
  */
  public toString () : string {
    return 'is tag with classes ' + [...this.classes].join(' and ')
  }
}
