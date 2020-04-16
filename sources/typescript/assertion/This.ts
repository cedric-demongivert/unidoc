import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocEventType } from '../event/UnidocEventType'

import { UnidocAssertion } from './UnidocAssertion'

/**
* An operator that filter the event stream to keep only the stream of event
* related to the current tag.
*/
export class This implements UnidocAssertion {
  /**
  * Operand of this operator.
  */
  private _operand : UnidocAssertion

  /**
  * Current depth in the tree relative to the begining of the stream of event.
  */
  private _depth   : number

  /**
  * Instantiate a new this operator.
  *
  * @param operand - Operand of the operator to instantiate.
  */
  public constructor (operand : UnidocAssertion) {
    this._depth = 0
    this._operand = operand
  }

  /**
  * @see UnidocAssertion.state
  */
  public get state () : boolean {
    return this._operand.state
  }

  /**
  * @see UnidocAssertion.next
  */
  public next (event: UnidocEvent) : boolean {
    if (this._depth > 0) {
      switch (event.type) {
        case UnidocEventType.START_TAG:
          this._depth += 1
          break
        case UnidocEventType.END_TAG:
          this._depth -= 1
          break
      }
    } else if (this._depth === 0) {
      switch (event.type) {
        case UnidocEventType.START_TAG:
          this._depth += 1
          break
        case UnidocEventType.END_TAG:
          this._depth -= 1
          this._operand.complete()
          break
      }
    }

    return this._operand.state
  }

  /**
  * @see UnidocAssertion.complete
  */
  public complete () : boolean {
    if (this._depth >= 0) {
      this._depth = -1
      this._operand.complete()
    }

    return this._operand.state
  }

  /**
  * @see UnidocAssertion.reset
  */
  public reset () : boolean {
    this._depth = 0
    return this._operand.reset()
  }

  /**
  * @see UnidocAssertion.clone
  */
  public clone () : This {
    const result : This = new This(this._operand.clone())
    result._depth = this._depth
    return result
  }

  /**
  * @see Object.toString
  */
  public toString () : string {
    return 'this ' + this._operand.toString()
  }
}
