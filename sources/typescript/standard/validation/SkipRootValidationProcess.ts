import { UnidocEventType } from '../../event/UnidocEventType'

import { UnidocValidationProcess } from '../../validator/UnidocValidationProcess'
import { UnidocValidationContext } from '../../validator/UnidocValidationContext'

export class SkipRootValidationProcess implements UnidocValidationProcess {
  private _subProcess : UnidocValidationProcess

  public constructor (subProcess : UnidocValidationProcess) {
    this._subProcess = subProcess
  }

  /**
  * @see UnidocValidationProcess.resolve
  */
  public resolve (context : UnidocValidationContext) : void {
    switch (context.event.type) {
      case UnidocEventType.START_TAG:
        context.replace(this._subProcess)
        return
      default:
        return
    }
  }
}
