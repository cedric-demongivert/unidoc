import { UnidocEventType } from '../event/UnidocEventType'

import { UnidocValidationProcess } from './UnidocValidationProcess'
import { UnidocValidationContext } from './UnidocValidationContext'

import { ShallowValidationPolicy } from './ShallowValidationPolicy'

/**
* A validation process that only validate the immediate children of the current
* tag in the stream.
*/
export class ShallowValidationProcess implements UnidocValidationProcess {
  private _policy : ShallowValidationPolicy
  private _depth   : number

  /**
  * Create a new shallow validation process that follow the given validation policy.
  *
  * @param policy - A shallow validation policy to follow.
  */
  public constructor (policy : ShallowValidationPolicy) {
    this._policy = policy
    this._depth = -1
  }

  /**
  * @see UnidocValidationProcess.resolve
  */
  public resolve (context : UnidocValidationContext) : void {
    if (context.event.type === UnidocEventType.START_TAG) {
      if (this._depth === -1) {
        this._policy.start(context)
      } else if (this._depth === 0) {
        this._policy.shallow(context)
      }

      this._depth += 1
    } else if (context.event.type === UnidocEventType.END_TAG) {
      if (this._depth === 0) {
        this._policy.end(context)
        context.terminate()
      } else if (this._depth === 1) {
        this._policy.shallow(context)
      }

      this._depth -= 1
    } else if (this._depth === 0) {
      this._policy.shallow(context)
    }
  }
}
