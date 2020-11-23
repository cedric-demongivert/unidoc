import { UnidocSequenceBlueprint } from '../../blueprint/UnidocSequenceBlueprint'
import { UnidocEvent } from '../../event/UnidocEvent'

import { UnnecessaryContent } from './messages/UnnecessaryContent'

import { UnidocBlueprintValidationProcess } from './UnidocBlueprintValidationProcess'
import { UnidocBlueprintValidationState } from './UnidocBlueprintValidationState'

export class UnidocSequenceBlueprintValidationState extends UnidocBlueprintValidationState {
  /**
  *
  */
  public blueprint: UnidocSequenceBlueprint | null

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
    } else if (this.current < this.blueprint.operands.size) {
      this.current += 1
      this.process.enter(this.blueprint.operands.get(this.current - 1))
    } else {
      this.process.exit()
    }
  }

  /**
  * @see UnidocBlueprintValidationState.onValidate
  */
  public onValidate(next: UnidocEvent): void {
    super.onValidate(next)

    throw new Error('Trying to validate an event in accordance with a sequence.')
  }

  /**
  * @see UnidocBlueprintValidationState.onComplete
  */
  public onComplete(): void {
    super.onComplete()

    throw new Error('Trying to validate a completion in accordance with a sequence.')
  }

  /**
  * @see UnidocBlueprintValidationState.fork
  */
  public fork(): UnidocSequenceBlueprintValidationState {
    const copy: UnidocSequenceBlueprintValidationState = new UnidocSequenceBlueprintValidationState()

    copy.blueprint = this.blueprint
    copy.current = this.current

    return copy
  }
}

export namespace UnidocSequenceBlueprintValidationState {
  export function wrap(blueprint: UnidocSequenceBlueprint): UnidocSequenceBlueprintValidationState {
    const result: UnidocSequenceBlueprintValidationState = new UnidocSequenceBlueprintValidationState()
    result.blueprint = blueprint
    return result
  }
}
