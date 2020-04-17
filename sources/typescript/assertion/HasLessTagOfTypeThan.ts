import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocEventType } from '../event/UnidocEventType'

import { UnidocAssertion } from './UnidocAssertion'

export class HasLessTagOfTypeThan implements UnidocAssertion {
  /**
  * State of this assertion.
  */
  private _count : number

  public readonly type : string
  public readonly ceil : number

  /**
  * Instantiate a new assertion.
  *
  * @param type - Type of tag to count.
  * @param ceil - Maximum number of tag allowed (exclusive)
  */
  public constructor (type : string, ceil : number) {
    this._count = 0
    this.type = type
    this.ceil = ceil
  }

  /**
  * @see UnidocAssertion.state
  */
  public get state () : boolean {
    return this._count < this.ceil
  }

  /**
  * @see UnidocAssertion.next
  */
  public next (event: UnidocEvent) : boolean {
    switch (event.type) {
      case UnidocEventType.START_TAG:
        if (event.tag.toLowerCase() === this.type) {
          this._count += 1
        }
    }

    return this._count < this.ceil
  }

  /**
  * @see UnidocAssertion.complete
  */
  public complete () : boolean {
    return this._count < this.ceil
  }

  /**
  * @see UnidocAssertion.clone
  */
  public clone () : HasLessTagOfTypeThan {
    const result : HasLessTagOfTypeThan = new HasLessTagOfTypeThan(this.type, this.ceil)
    result._count = this._count
    return result
  }

  /**
  * @see UnidocAssertion.reset
  */
  public reset () : boolean {
    this._count = 0
    return this._count < this.ceil
  }

  /**
  * @see Object.toString
  */
  public toString () : string {
    return 'has less tag of type ' + this.type + ' than ' + this.ceil
  }
}
