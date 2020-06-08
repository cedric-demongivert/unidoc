import { UnidocEventType } from '../../event/UnidocEventType'

import { UnidocValidationProcess } from '../../validator/UnidocValidationProcess'
import { UnidocValidationContext } from '../../validator/UnidocValidationContext'

export class SkipTagValidationProcess implements UnidocValidationProcess {
  /**
  * Current depth in the subtree that represent the current tag.
  */
  private _depth : number

  /**
  * Instantiate a new validation process that will skip the current tag.
  */
  public constructor () {
    this._depth = 0
  }

  /**
  * @see UnidocValidationProcess.resolve
  */
  public resolve (context : UnidocValidationContext) : void {
    switch (context.event.type) {
      case UnidocEventType.START_TAG:
        this._depth += 1
        return
      case UnidocEventType.END_TAG:
        this._depth -= 1
        if (this._depth < 0) {
          context.terminate()
        }
        return
      default:
        return
    }
  }
}
