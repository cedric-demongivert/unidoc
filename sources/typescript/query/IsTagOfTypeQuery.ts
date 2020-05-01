import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocEventType } from '../event/UnidocEventType'

import { BasicQuery } from './BasicQuery'

export class IsTagOfTypeQuery extends BasicQuery<boolean> {
  /**
  * Allowed types.
  */
  public readonly types : Set<string>

  /**
  * Instantiate a new tag of type selector.
  *
  * @param types - Allowed types.
  */
  public constructor (types : Iterable<string>) {
    super()

    this.types = new Set<string>(types)
    Object.freeze(this.types)
  }

  public start () : void {

  }

  /**
  * @see UnidocQuery.next
  */
  public next (event : UnidocEvent) : void {
    switch (event.type) {
      case UnidocEventType.START_TAG:
      case UnidocEventType.END_TAG:
        return this.emit(this.types.has(event.tag))
      default:
        return this.emit(false)
    }
  }

  /**
  * @see UnidocQuery.reset
  */
  public reset () : void {

  }

  /**
  * @see UnidocQuery.complete
  */
  public complete () : void {
    this.emitCompletion()
  }

  /**
  * @see UnidocQuery.clone
  */
  public clone () : IsTagOfTypeQuery {
    const result : IsTagOfTypeQuery = new IsTagOfTypeQuery(this.types)

    result.copy(this)

    return result
  }

  /**
  * @see UnidocQuery.toString
  */
  public toString () : string {
    return 'IS ' + [...this.types].join(' OR ') + ' TAG'
  }
}
