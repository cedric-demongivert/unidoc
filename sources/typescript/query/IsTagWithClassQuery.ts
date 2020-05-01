import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocEventType } from '../event/UnidocEventType'

import { BasicQuery } from './BasicQuery'

export class IsTagWithClassQuery extends BasicQuery<boolean> {
  public readonly classes : Set<string>

  /**
  * Instantiate a new tag with classes query.
  *
  * @param classes - Classes to search.
  */
  public constructor (classes : Iterable<string>) {
    super()
    this.classes = new Set<string>(classes)
    Object.freeze(this.classes)
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
        if (event.classes.size === this.classes.size) {
          for (const clazz of this.classes) {
            if (!event.classes.has(clazz)) {
              return this.emit(false)
            }
          }

          return this.emit(true)
        }
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
  public clone () : IsTagWithClassQuery {
    const copy : IsTagWithClassQuery = new IsTagWithClassQuery(this.classes)

    copy.copy(this)

    return copy
  }

  /**
  * @see UnidocQuery.toString
  */
  public toString () : string {
    return 'IS TAG WITH ' + [...this.classes].join(' AND ') + ' CLASS'
  }
}
