import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocEventType } from '../event/UnidocEventType'

import { BasicQuery } from './BasicQuery'

export class IsTagWithIdentifierQuery extends BasicQuery<boolean> {
  public readonly identifiers : Set<string>

  /**
  * Instantiate a new tag with identifier query.
  *
  * @param identifiers - Allowed identifiers.
  */
  public constructor (identifiers : Iterable<string>) {
    super()

    this.identifiers = new Set<string>(identifiers)
    Object.freeze(this.identifiers)
  }

  /**
  * @see UnidocQuery.start
  */
  public start () : void {

  }

  /**
  * @see UnidocQuery.next
  */
  public next (event : UnidocEvent) : void {
    switch (event.type) {
      case UnidocEventType.START_TAG:
      case UnidocEventType.END_TAG:
        return this.emit(this.identifiers.has(event.identifier))
      default:
        return this.emit(false)
    }
  }

  /**
  * @see UnidocQuery.complete
  */
  public complete () : void {

  }

  /**
  * @see UnidocQuery.reset
  */
  public reset () : void {

  }

  /**
  * @see UnidocQuery.clone
  */
  public clone () : IsTagWithIdentifierQuery {
    const result : IsTagWithIdentifierQuery = new IsTagWithIdentifierQuery(this.identifiers)

    result.copy(this)

    return result
  }

  /**
  * @see UnidocQuery.toString
  */
  public toString () : string {
    return 'IS TAG WITH ' + [...this.identifiers].join(' OR ') + ' IDENTIFIER'
  }
}
