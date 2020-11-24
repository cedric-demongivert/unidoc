import { UnidocTagBlueprint } from '../../blueprint/UnidocTagBlueprint'
import { UnidocEvent } from '../../event/UnidocEvent'
import { UnidocEventType } from '../../event/UnidocEventType'

import { UnidocBlueprintValidationProcess } from './UnidocBlueprintValidationProcess'
import { UnidocBlueprintValidationState } from './UnidocBlueprintValidationState'

import { UnexpectedContent } from './messages/UnexpectedContent'
import { RequiredContent } from './messages/RequiredContent'

const AWAIT_STARTING_TAG: number = 0
const AWAIT_CONTENT: number = 1
const AWAIT_ENDING_TAG: number = 2
const NEXT: number = 3

const EMPTY_STRING: string = ''
const ANY_TAG: string = '++any'

export class UnidocTagBlueprintValidationState extends UnidocBlueprintValidationState {
  /**
  *
  */
  public blueprint: UnidocTagBlueprint | null

  /**
  *
  */
  private state: number

  /**
  *
  */
  private tag: string

  /**
  *
  */
  public constructor() {
    super()

    this.blueprint = null
    this.state = AWAIT_STARTING_TAG
    this.tag = EMPTY_STRING
  }

  /**
  * @see UnidocBlueprintValidationState.enter
  */
  public onEnter(process: UnidocBlueprintValidationProcess): void {
    super.onEnter(process)

    this.state = AWAIT_STARTING_TAG
    this.tag = EMPTY_STRING
  }

  /**
  * @see UnidocBlueprintValidationState.exit
  */
  public onExit(): void {
    super.onExit()

    this.state = AWAIT_STARTING_TAG
    this.tag = EMPTY_STRING
  }

  /**
  * @see UnidocBlueprintValidationState.doesRequireEvent
  */
  public doesRequireEvent(): boolean {
    switch (this.state) {
      case AWAIT_STARTING_TAG:
      case AWAIT_ENDING_TAG:
        return true
      default:
        return false
    }
  }

  /**
  * @see UnidocBlueprintValidationState.onContinue
  */
  public onContinue(): void {
    if (this.process == null) {
      this.throwUnboundProcess()
    } else if (this.blueprint == null) {
      this.process.exit()
    } else if (this.state === AWAIT_CONTENT) {
      this.state = AWAIT_ENDING_TAG
      this.process.enter(this.blueprint.operand)
    } else if (this.state === NEXT) {
      this.process.exit()
    }
  }

  private publishUnexpectedContent(): void {
    if (this.process == null) {
      this.throwUnboundProcess()
    } else {
      this.process
        .asMessageOfType(UnexpectedContent.TYPE)
        .ofCode(UnexpectedContent.CODE)
        .withData(UnexpectedContent.Data.BLUEPRINT, this.blueprint)
        .produce()

      this.process.stop()
    }
  }

  private publishRequiredContent(): void {
    if (this.process == null) {
      this.throwUnboundProcess()
    } else {
      this.process
        .asMessageOfType(RequiredContent.TYPE)
        .ofCode(RequiredContent.CODE)
        .withData(RequiredContent.Data.BLUEPRINT, this.blueprint)
        .produce()

      this.process.stop()
    }
  }

  /**
  * @see UnidocBlueprintValidationState.onValidate
  */
  public onValidate(next: UnidocEvent): void {
    if (this.process == null) {
      this.throwUnboundProcess()
    } else if (this.blueprint) {
      switch (this.state) {
        case AWAIT_STARTING_TAG:
          if (next.type !== UnidocEventType.START_TAG) {
            this.publishUnexpectedContent()
            this.tag = ANY_TAG
          } else if (!this.blueprint.predicate.test(next)) {
            this.publishUnexpectedContent()
            this.tag = next.tag
          } else {
            this.tag = next.tag
          }
          this.state = AWAIT_CONTENT
          return
        case AWAIT_ENDING_TAG:
          if (next.type !== UnidocEventType.END_TAG) {
            this.publishUnexpectedContent()
          } else if (this.tag !== ANY_TAG && next.tag !== this.tag) {
            this.publishUnexpectedContent()
          }
          this.state = NEXT
          return
        default:
          return
      }
    }
  }

  /**
  * @see UnidocBlueprintValidationState.onComplete
  */
  public onComplete(): void {
    if (this.process == null) {
      this.throwUnboundProcess()
    } else if (this.blueprint) {
      switch (this.state) {
        case AWAIT_STARTING_TAG:
          this.publishRequiredContent()
          this.state = AWAIT_CONTENT
          return
        case AWAIT_ENDING_TAG:
          this.publishRequiredContent()
          this.state = NEXT
          return
        default:
          return
      }
    }
  }

  /**
  * @see UnidocBlueprintValidationState.fork
  */
  public fork(): UnidocTagBlueprintValidationState {
    const copy: UnidocTagBlueprintValidationState = new UnidocTagBlueprintValidationState()

    copy.blueprint = this.blueprint
    copy.state = this.state
    copy.tag = this.tag

    return copy
  }
}

export namespace UnidocTagBlueprintValidationState {
  export function wrap(blueprint: UnidocTagBlueprint): UnidocTagBlueprintValidationState {
    const result: UnidocTagBlueprintValidationState = new UnidocTagBlueprintValidationState()
    result.blueprint = blueprint
    return result
  }
}
