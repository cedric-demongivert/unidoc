import { Pack } from '@cedric-demongivert/gl-tool-collection'

import { UnidocBlueprint } from '../../blueprint/UnidocBlueprint'
import { UnidocLenientSequenceBlueprint } from '../../blueprint/UnidocLenientSequenceBlueprint'
import { UnidocEvent } from '../../event/UnidocEvent'

import { PreferredContent } from './messages/PreferredContent'

import { UnidocBlueprintValidationProcess } from './UnidocBlueprintValidationProcess'
import { UnidocBlueprintValidationState } from './UnidocBlueprintValidationState'

export class UnidocLenientSequenceBlueprintValidationState extends UnidocBlueprintValidationState {
  /**
  *
  */
  public blueprint: UnidocLenientSequenceBlueprint | null

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
      let mustWarn: boolean = true
      let ordered: number = -1

      for (let index = 0; index < this.blueprint.operands.size; ++index) {
        if (!this.tested.get(index)) {
          if (ordered < 0) {
            ordered = index
          }

          if (last > -1) {
            this.tested.set(last, true)
            const fork: UnidocBlueprintValidationProcess = this.process.fork()
            fork.enter(this.blueprint.operands.get(last))
            this.tested.set(last, false)
          }

          last = index
        } else if (ordered > -1 && mustWarn) {
          mustWarn = false
          this.emitPreferredContentWarning(this.blueprint.operands.get(ordered))
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

  private emitPreferredContentWarning(blueprint: UnidocBlueprint): void {
    if (this.process == null) {
      this.throwUnboundProcess()
    } else {
      this.process
        .asMessageOfType(PreferredContent.TYPE)
        .ofCode(PreferredContent.CODE)
        .withData(PreferredContent.Data.BLUEPRINT, blueprint)
        .produce()
    }
  }

  /**
  * @see UnidocBlueprintValidationState.onValidate
  */
  public onValidate(next: UnidocEvent): void {
    super.onValidate(next)

    throw new Error('Trying to validate an event in accordance with a lenient sequence.')
  }

  /**
  * @see UnidocBlueprintValidationState.onComplete
  */
  public onComplete(): void {
    super.onComplete()

    throw new Error('Trying to validate a completion in accordance with a lenient sequence.')
  }

  /**
  * @see UnidocBlueprintValidationState.fork
  */
  public fork(): UnidocLenientSequenceBlueprintValidationState {
    const copy: UnidocLenientSequenceBlueprintValidationState = new UnidocLenientSequenceBlueprintValidationState()

    copy.blueprint = this.blueprint
    copy.tested.copy(this.tested)

    return copy
  }
}

export namespace UnidocLenientSequenceBlueprintValidationState {
  export function wrap(blueprint: UnidocLenientSequenceBlueprint): UnidocLenientSequenceBlueprintValidationState {
    const result: UnidocLenientSequenceBlueprintValidationState = new UnidocLenientSequenceBlueprintValidationState()
    result.blueprint = blueprint
    return result
  }
}
