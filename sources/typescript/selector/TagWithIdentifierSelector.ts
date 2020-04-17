import { UnidocEvent } from '../event/UnidocEvent'

import { UnidocSelector } from './UnidocSelector'
import { TagSelector } from './TagSelector'

export class TagWithIdentifierSelector implements UnidocSelector {
  public readonly identifiers : Set<string>

  /**
  * Instantiate a new tag with identifier selector.
  *
  * @param identifiers - Allowed identifiers.
  */
  public constructor (identifiers : Iterable<string>) {
    this.identifiers = new Set<string>(identifiers)
    Object.freeze(this.identifiers)
  }

  /**
  * @see UnidocSelector.next
  */
  public next (event : UnidocEvent) : boolean {
    return TagSelector.INSTANCE.next(event) &&
           this.identifiers.has(event.identifier)
  }

  /**
  * @see UnidocSelector.reset
  */
  public reset () : void {

  }

  /**
  * @see UnidocSelector.clone
  */
  public clone () : TagWithIdentifierSelector {
    return this
  }

  /**
  * @see UnidocSelector.toString
  */
  public toString () : string {
    return 'is tag with identifier ' + [...this.identifiers].join(' or ')
  }
}
