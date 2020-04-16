import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocEventType } from '../event/UnidocEventType'

import { UnidocAssertion } from './UnidocAssertion'

export class Children implements UnidocAssertion {
  public readonly operand : UnidocAssertion

  private _depth : number

  /**
  * Instantiate a new assertion.
  *
  * @param operand - Operand of this operator.
  */
  public constructor (operand : UnidocAssertion) {
    this.operand = operand
    this._depth = 0
  }

  /**
  * @see UnidocAssertion.state
  */
  public get state () : boolean {
    return this.operand.state
  }

  /**
  * @see UnidocAssertion.next
  */
  public next (event: UnidocEvent) : boolean {
    if (this._depth >= 0) {
      switch (event.type) {
        case UnidocEventType.START_TAG:
          this._depth += 1
          if (this._depth === 1) {
            this.operand.next(event)
          }
          break
        case UnidocEventType.END_TAG:
          this._depth -= 1
          if (this._depth === 0) {
            this.operand.next(event)
          } else if (this._depth === -1) {
            this.operand.complete()
          }
          break
        default:
          if (this._depth === 0) {
            this.operand.next(event)
          }
          break
      }
    }

    return this.operand.state
  }

  /**
  * @see UnidocAssertion.complete
  */
  public complete () : boolean {
    if (this._depth >= 0) {
      this.operand.complete()
      return this.operand.state
    }
  }

  /**
  * @see UnidocAssertion.clone
  */
  public clone () : Children {
    const result : Children = new Children(this.operand.clone())
    result._depth = this._depth
    return result
  }

  /**
  * @see UnidocAssertion.reset
  */
  public reset () : boolean {
    this._depth = 0
    return this.operand.reset()
  }

  /**
  * @see Object.toString
  */
  public toString () : string {
    return 'immediate children ' + this.operand.toString()
  }
}
