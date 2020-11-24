import { UnidocEventBlueprint } from '../../blueprint/UnidocEventBlueprint'
import { UnidocEvent } from '../../event/UnidocEvent'

import { RequiredContent } from './messages/RequiredContent'
import { UnexpectedContent } from './messages/UnexpectedContent'

import { UnidocBlueprintValidationState } from './UnidocBlueprintValidationState'

const EMPTY_EVENT_BLUEPRINT: UnidocEventBlueprint = new UnidocEventBlueprint()

export class UnidocEventBlueprintValidationState extends UnidocBlueprintValidationState {
  public blueprint: UnidocEventBlueprint | null

  /**
  *
  */
  public constructor() {
    super()

    this.blueprint = null
  }

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
      if (this.blueprint && !this.blueprint.predicate.test(next)) {
        this.process
          .asMessageOfType(UnexpectedContent.TYPE)
          .ofCode(UnexpectedContent.CODE)
          .withData(UnexpectedContent.Data.BLUEPRINT, this.blueprint)
          .produce()

        this.process.stop()
      } else {
        this.process.exit()
      }
    }
  }

  /**
  * @see UnidocBlueprintValidationState.onComplete
  */
  public onComplete(): void {
    if (this.process == null) {
      this.throwUnboundProcess()
    } else {
      this.process
        .asMessageOfType(RequiredContent.TYPE)
        .ofCode(RequiredContent.CODE)
        .withData(
          RequiredContent.Data.BLUEPRINT,
          this.blueprint || EMPTY_EVENT_BLUEPRINT
        )
        .produce()

      this.process.stop()
    }
  }

  /**
  * @see UnidocBlueprintValidationState.fork
  */
  public fork(): UnidocEventBlueprintValidationState {
    const result: UnidocEventBlueprintValidationState = (
      new UnidocEventBlueprintValidationState()
    )

    result.blueprint = this.blueprint

    return result
  }
}

export namespace UnidocEventBlueprintValidationState {
  export function wrap(blueprint: UnidocEventBlueprint): UnidocEventBlueprintValidationState {
    const result: UnidocEventBlueprintValidationState = new UnidocEventBlueprintValidationState()
    result.blueprint = blueprint
    return result
  }
}
