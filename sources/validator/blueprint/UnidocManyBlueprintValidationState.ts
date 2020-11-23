import { UnidocManyBlueprint } from '../../blueprint/UnidocManyBlueprint'
import { UnidocEvent } from '../../event/UnidocEvent'

import { UnnecessaryContent } from './messages/UnnecessaryContent'

import { UnidocBlueprintValidationProcess } from './UnidocBlueprintValidationProcess'
import { UnidocBlueprintValidationState } from './UnidocBlueprintValidationState'

export class UnidocManyBlueprintValidationState extends UnidocBlueprintValidationState {
  /**
  *
  */
  public blueprint: UnidocManyBlueprint | null

  /**
  *
  */
  private current: number

  /**
  *
  */
  public constructor() {
    super()

    this.blueprint = null
    this.current = 0
  }

  /**
  * @see UnidocBlueprintValidationState.enter
  */
  public onEnter(process: UnidocBlueprintValidationProcess): void {
    super.onEnter(process)

    this.current = 0
  }

  /**
  * @see UnidocBlueprintValidationState.enter
  */
  public onResume(): void {
    if (this.process == null) {
      this.throwUnboundProcess()
    } else if (this.blueprint == null) {
      this.process.exit()
    } else {
      if (this.current >= this.blueprint.maximum) {
        this.process
          .asMessageOfType(UnnecessaryContent.TYPE)
          .ofCode(UnnecessaryContent.CODE)
          .withData(UnnecessaryContent.Data.BLUEPRINT, this.blueprint)
          .produce()

        this.process.recover()
      }

      this.current += 1
    }
  }

  /**
  * @see UnidocBlueprintValidationState.exit
  */
  public onExit(): void {
    super.onExit()

    this.current = 0
  }

  /**
  * @see UnidocBlueprintValidationState.doesRequireEvent
  */
  public doesRequireEvent(): boolean {
    return false
  }

  /**
  * @see UnidocBlueprintValidationState.onContinue
  */
  public onContinue(): void {
    if (this.process == null) {
      this.throwUnboundProcess()
    } else if (this.blueprint == null) {
      this.process.exit()
    } else {
      if (this.current >= this.blueprint.minimum) {
        const fork: UnidocBlueprintValidationProcess = this.process.fork()
        fork.exit()
      }

      this.process.enter(this.blueprint.operand)
    }
  }

  /**
  * @see UnidocBlueprintValidationState.onValidate
  */
  public onValidate(next: UnidocEvent): void {
    super.onValidate(next)

    throw new Error('Trying to validate an event in accordance with a many operator.')
  }

  /**
  * @see UnidocBlueprintValidationState.onComplete
  */
  public onComplete(): void {
    super.onComplete()

    throw new Error('Trying to validate a completion in accordance with a many operator.')
  }

  /**
  * @see UnidocBlueprintValidationState.fork
  */
  public fork(): UnidocManyBlueprintValidationState {
    const copy: UnidocManyBlueprintValidationState = new UnidocManyBlueprintValidationState()

    copy.blueprint = this.blueprint
    copy.current = this.current

    return copy
  }
}

export namespace UnidocManyBlueprintValidationState {
  export function wrap(blueprint: UnidocManyBlueprint): UnidocManyBlueprintValidationState {
    const result: UnidocManyBlueprintValidationState = new UnidocManyBlueprintValidationState()
    result.blueprint = blueprint
    return result
  }
}
