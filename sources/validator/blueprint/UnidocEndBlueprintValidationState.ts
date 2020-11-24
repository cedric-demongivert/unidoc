import { UnidocBlueprint } from '../../blueprint/UnidocBlueprint'
import { UnidocEndBlueprint } from '../../blueprint/UnidocEndBlueprint'
import { UnidocEvent } from '../../event/UnidocEvent'

import { UnnecessaryContent } from './messages/UnnecessaryContent'

import { UnidocBlueprintValidationState } from './UnidocBlueprintValidationState'

export class UnidocEndBlueprintValidationState extends UnidocBlueprintValidationState {
  /**
  * @see UnidocBlueprintValidationState.doesRequireEvent
  */
  public doesRequireEvent(): boolean {
    return true
  }

  /**
  * @see UnidocBlueprintValidationState.onValidate
  */
  public onValidate(next: UnidocEvent): void {
    if (this.process == null) {
      this.throwUnboundProcess()
    } else {
      this.process
        .asMessageOfType(UnnecessaryContent.TYPE)
        .ofCode(UnnecessaryContent.CODE)
        .withData(UnnecessaryContent.Data.BLUEPRINT, UnidocBlueprint.end())
        .produce()

      this.process.stop()
    }
  }

  /**
  * @see UnidocBlueprintValidationState.fork
  */
  public fork(): UnidocEndBlueprintValidationState {
    return new UnidocEndBlueprintValidationState()
  }
}

export namespace UnidocEndBlueprintValidationState {
  export function wrap(blueprint: UnidocEndBlueprint): UnidocEndBlueprintValidationState {
    return new UnidocEndBlueprintValidationState()
  }
}
