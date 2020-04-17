import { UnidocEvent } from '../event/UnidocEvent'

import { UnidocSelector } from './UnidocSelector'
import { TagSelector } from './TagSelector'

export class TagOfTypeSelector implements UnidocSelector {
  public readonly types : Set<string>

  /**
  * Instantiate a new tag of type selector.
  *
  * @param types - Allowed types.
  */
  public constructor (types : Iterable<string>) {
    this.types = new Set<string>(types)
    Object.freeze(this.types)
  }

  /**
  * @see UnidocSelector.next
  */
  public next (event : UnidocEvent) : boolean {
    return TagSelector.INSTANCE.next(event) && this.types.has(event.tag)
  }

  /**
  * @see UnidocSelector.reset
  */
  public reset () : void {

  }

  /**
  * @see UnidocSelector.clone
  */
  public clone () : TagOfTypeSelector {
    return this
  }

  /**
  * @see UnidocSelector.toString
  */
  public toString () : string {
    return 'is tag of type ' + [...this.types].join(' or ')
  }
}
