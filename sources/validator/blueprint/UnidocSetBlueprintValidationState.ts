import { Pack } from '@cedric-demongivert/gl-tool-collection'

import { UnidocSetBlueprint } from '../../blueprint/UnidocSetBlueprint'
import { UnidocEvent } from '../../event/UnidocEvent'

import { UnidocBlueprintValidationProcess } from './UnidocBlueprintValidationProcess'
import { UnidocBlueprintValidationState } from './UnidocBlueprintValidationState'

export class UnidocSetBlueprintValidationState extends UnidocBlueprintValidationState {
  /**
  *
  */
  public blueprint: UnidocSetBlueprint | null

  /**
  *
  */
  private readonly tested: Pack<boolean>

  /**
  *
  */
  public constructor() {
    super()

    this.blueprint = null
    this.tested = Pack.any(8)
  }

  /**
  * @see UnidocBlueprintValidationState.enter
  */
  public onEnter(process: UnidocBlueprintValidationProcess): void {
    super.onEnter(process)

    this.tested.clear()
    this.tested.size = this.blueprint ? this.blueprint.operands.size : 0
  }

  /**
  * @see UnidocBlueprintValidationState.exit
  */
  public onExit(): void {
    super.onExit()

    this.tested.clear()
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
      let last: number = -1

      for (let index = 0; index < this.blueprint.operands.size; ++index) {
        if (!this.tested.get(index)) {
          if (last > -1) {
            this.tested.set(last, true)
            const fork: UnidocBlueprintValidationProcess = this.process.fork()
            fork.enter(this.blueprint.operands.get(last))
            this.tested.set(last, false)
          }

          last = index
        }
      }

      if (last > -1) {
        this.tested.set(last, true)
        this.process.enter(this.blueprint.operands.get(last))
      } else {
        this.process.exit()
      }
    }
  }

  /**
  * @see UnidocBlueprintValidationState.onValidate
  */
  public onValidate(next: UnidocEvent): void {
    super.onValidate(next)

    throw new Error('Trying to validate an event in accordance with a set.')
  }

  /**
  * @see UnidocBlueprintValidationState.onComplete
  */
  public onComplete(): void {
    super.onComplete()

    throw new Error('Trying to validate a completion in accordance with a set.')
  }

  /**
  * @see UnidocBlueprintValidationState.fork
  */
  public fork(): UnidocSetBlueprintValidationState {
    const copy: UnidocSetBlueprintValidationState = new UnidocSetBlueprintValidationState()

    copy.blueprint = this.blueprint
    copy.tested.copy(this.tested)

    return copy
  }
}

export namespace UnidocSetBlueprintValidationState {
  export function wrap(blueprint: UnidocSetBlueprint): UnidocSetBlueprintValidationState {
    const result: UnidocSetBlueprintValidationState = new UnidocSetBlueprintValidationState()
    result.blueprint = blueprint
    return result
  }
}
