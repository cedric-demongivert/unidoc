import { UnidocDisjunctionBlueprint } from '../../blueprint/UnidocDisjunctionBlueprint'
import { UnidocEvent } from '../../event/UnidocEvent'

import { UnidocBlueprintValidationProcess } from './UnidocBlueprintValidationProcess'
import { UnidocBlueprintValidationState } from './UnidocBlueprintValidationState'

export class UnidocDisjunctionBlueprintValidationState extends UnidocBlueprintValidationState {
  /**
  *
  */
  public blueprint: UnidocDisjunctionBlueprint | null

  /**
  *
  */
  private expanded: boolean

  public constructor() {
    super()

    this.blueprint = null
    this.expanded = false
  }

  /**
  * @see UnidocBlueprintValidationState.enter
  */
  public onEnter(process: UnidocBlueprintValidationProcess): void {
    super.onEnter(process)

    this.expanded = false
  }

  /**
  * @see UnidocBlueprintValidationState.exit
  */
  public onExit(): void {
    super.onExit()

    this.expanded = false
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
    } else {
      if (this.expanded || this.blueprint == null) {
        this.process.exit()
      } else {
        this.expanded = true

        for (let index = 1; index < this.blueprint.operands.size; ++index) {
          const fork: UnidocBlueprintValidationProcess = this.process.fork()
          fork.enter(this.blueprint.operands.get(index))
        }

        this.process.enter(this.blueprint.operands.get(0))
      }
    }
  }

  /**
  * @see UnidocBlueprintValidationState.onValidate
  */
  public onValidate(next: UnidocEvent): void {
    super.onValidate(next)

    throw new Error('Trying to validate an event in accordance with a disjunction.')
  }

  /**
  * @see UnidocBlueprintValidationState.onComplete
  */
  public onComplete(): void {
    super.onComplete()

    throw new Error('Trying to validate a completion in accordance with a disjunction.')
  }

  /**
  * @see UnidocBlueprintValidationState.fork
  */
  public fork(): UnidocDisjunctionBlueprintValidationState {
    const copy: UnidocDisjunctionBlueprintValidationState = new UnidocDisjunctionBlueprintValidationState()

    copy.blueprint = this.blueprint
    copy.expanded = this.expanded

    return copy
  }
}

export namespace UnidocDisjunctionBlueprintValidationState {
  export function wrap(blueprint: UnidocDisjunctionBlueprint): UnidocDisjunctionBlueprintValidationState {
    const result: UnidocDisjunctionBlueprintValidationState = new UnidocDisjunctionBlueprintValidationState()
    result.blueprint = blueprint
    return result
  }
}
