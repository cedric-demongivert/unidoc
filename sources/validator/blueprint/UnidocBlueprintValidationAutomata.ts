import { Pack } from '@cedric-demongivert/gl-tool-collection'

import { UnidocEvent } from '../../event/UnidocEvent'
import { UnidocEventType } from '../../event/UnidocEventType'

import { UnidocBranchAutomata } from '../tree/UnidocBranchAutomata'
import { UnidocBranchValidator } from '../tree/UnidocBranchValidator'

import { UnidocBlueprint } from '../../blueprint/UnidocBlueprint'
import { UnidocTagEndBlueprint } from '../../blueprint/UnidocTagEndBlueprint'
import { UnidocBlueprintType } from '../../blueprint/UnidocBlueprintType'

import { RequiredContent } from './messages/RequiredContent'
import { TooManyErrors } from './messages/TooManyErrors'
import { UnexpectedContent } from './messages/UnexpectedContent'
import { UnnecessaryContent } from './messages/UnnecessaryContent'
import { PreferredContent } from './messages/PreferredContent'

import { UnidocBlueprintValidationState } from './UnidocBlueprintValidationState'

const MAXIMUM_ALLOWED_RECOVERIES: number = 5

export class UnidocBlueprintValidationAutomata implements UnidocBranchAutomata {
  private _blueprint: UnidocBlueprint
  private readonly _states: Pack<UnidocBlueprintValidationState>
  private _recoveries: number

  private readonly _tagEnd: UnidocTagEndBlueprint

  public constructor(blueprint: UnidocBlueprint) {
    this._blueprint = blueprint
    this._recoveries = 0
    this._states = Pack.instance(UnidocBlueprintValidationState.ALLOCATOR, 12)
    this._tagEnd = new UnidocTagEndBlueprint()
  }

  /**
  * @see UnidocBranchAutomata.start
  */
  public initialize(branch: UnidocBranchValidator): void {

  }

  /**
  * @see UnidocBranchAutomata.validate
  */
  public validate(branch: UnidocBranchValidator, event: UnidocEvent): void
  /**
  * @see UnidocBranchAutomata.validate
  */
  public validate(branch: UnidocBranchValidator): void
  public validate(branch: UnidocBranchValidator, event?: UnidocEvent): void {
    while (true) {
      const blueprint: UnidocBlueprint = this._blueprint

      switch (blueprint.type) {
        case UnidocBlueprintType.MANY:
          this.processMany(branch)
          break
        case UnidocBlueprintType.ANY:
          this.processAny(branch)
          break
        case UnidocBlueprintType.SET:
          this.processSet(branch)
          break
        case UnidocBlueprintType.LENIENT_SEQUENCE:
          this.processLenientSequence(branch)
          break
        case UnidocBlueprintType.TAG:
          return this.validateTag(branch, event)
        case UnidocBlueprintType.TAG_START:
          return this.validateTagStart(branch, event)
        case UnidocBlueprintType.TAG_END:
          return this.validateTagEnd(branch, event)
        case UnidocBlueprintType.ANYTHING:
          this._blueprint = (blueprint as UnidocBlueprint.Anything).next
          return
        case UnidocBlueprintType.WORD:
          return this.validateWord(branch, event)
        case UnidocBlueprintType.WHITESPACE:
          return this.validateWhitespace(branch, event)
        case UnidocBlueprintType.END:
          if (this._states.size > 0) {
            if (this._states.last.blueprint.type === UnidocBlueprintType.TAG) {
              return this.validateEndOfTag(branch, event)
            } else {
              this.processEnd(branch)
              break
            }
          } else {
            return this.validateEnd(branch, event)
          }
        default:
          throw new Error(
            'Unable to validate ' + (
              event == null ? 'until an event is required'
                : 'event ' + event.toString()
            ) + ' in accordance with a blueprint of type #' + blueprint.type +
            ' (' + UnidocBlueprintType.toString(blueprint.type) + ') because ' +
            'no procedure was defined into this automata for handling this ' +
            'situation.'
          )
      }
    }
  }

  private validateTagStart(branch: UnidocBranchValidator, event?: UnidocEvent): void {
    if (event == null) return

    const blueprint: UnidocBlueprint.TagStart = this._blueprint as UnidocBlueprint.TagStart

    if (event.type !== UnidocEventType.START_TAG || event.tag !== blueprint.tag) {
      this.throwUnexpectedContent(branch)
    }

    this._blueprint = blueprint.next
  }

  private validateTagEnd(branch: UnidocBranchValidator, event?: UnidocEvent): void {
    if (event == null) return

    const blueprint: UnidocBlueprint.TagEnd = this._blueprint as UnidocBlueprint.TagEnd

    if (event.type !== UnidocEventType.END_TAG || event.tag !== blueprint.tag) {
      this.throwUnexpectedContent(branch)
    }

    this._blueprint = blueprint.next
  }

  private validateWord(branch: UnidocBranchValidator, event?: UnidocEvent): void {
    if (event == null) return

    const blueprint: UnidocBlueprint.Word = this._blueprint as UnidocBlueprint.Word

    if (event.type !== UnidocEventType.WORD) {
      this.throwUnexpectedContent(branch)
    }

    this._blueprint = blueprint.next
  }

  private validateWhitespace(branch: UnidocBranchValidator, event?: UnidocEvent): void {
    if (event == null) return

    const blueprint: UnidocBlueprint.Whitespace = this._blueprint as UnidocBlueprint.Whitespace

    if (event.type !== UnidocEventType.WHITESPACE) {
      this.throwUnexpectedContent(branch)
    }

    this._blueprint = blueprint.next
  }

  private validateEnd(branch: UnidocBranchValidator, event?: UnidocEvent): void {
    if (event == null) return

    branch.asMessageOfType(UnnecessaryContent.TYPE)
      .ofCode(UnnecessaryContent.CODE)
      .withData(UnnecessaryContent.Data.BLUEPRINT, this._blueprint)
      .produce()

    this.recover(branch)
  }

  private throwUnexpectedContent(branch: UnidocBranchValidator): void {
    branch.asMessageOfType(UnexpectedContent.TYPE)
      .ofCode(UnexpectedContent.CODE)
      .withData(UnexpectedContent.Data.BLUEPRINT, this._blueprint)
      .produce()

    this.recover(branch)
  }

  /**
  * @see UnidocBranchAutomata.end
  */
  public complete(branch: UnidocBranchValidator): void {
    while (true) {
      const blueprint: UnidocBlueprint = this._blueprint

      switch (blueprint.type) {
        case UnidocBlueprintType.MANY:
          this.processMany(branch)
          break
        case UnidocBlueprintType.ANY:
          this.processAny(branch)
          break
        case UnidocBlueprintType.SET:
          this.processSet(branch)
          break
        case UnidocBlueprintType.LENIENT_SEQUENCE:
          this.processLenientSequence(branch)
          break
        case UnidocBlueprintType.TAG:
        case UnidocBlueprintType.TAG_START:
        case UnidocBlueprintType.TAG_END:
        case UnidocBlueprintType.WORD:
        case UnidocBlueprintType.WHITESPACE:
        case UnidocBlueprintType.ANYTHING:
          return this.completeWithRequiredContent(branch)
        case UnidocBlueprintType.END:
          if (this._states.size > 0) {
            if (this._states.last.blueprint.type === UnidocBlueprintType.TAG) {
              this.completeEndOfTag(branch)
            } else {
              this.processEnd(branch)
            }
            break
          }
          return
        default:
          throw new Error(
            'Unable to end the validation branch in accordance with ' +
            'blueprint of type #' + blueprint.type + ' (' +
            UnidocBlueprintType.toString(blueprint.type) + ') because no ' +
            'procedure was defined into this automata for handling this ' +
            'situation.'
          )
      }
    }
  }

  private completeWithRequiredContent(branch: UnidocBranchValidator): void {
    branch.asMessageOfType(RequiredContent.TYPE)
      .ofCode(RequiredContent.CODE)
      .withData(RequiredContent.Data.BLUEPRINT, this._blueprint)
      .produce()

    this.recover(branch)
  }

  private processAny(branch: UnidocBranchValidator): void {
    const blueprint: UnidocBlueprint.Any = this._blueprint as UnidocBlueprint.Any

    if (blueprint.alternatives.size > 0) {
      for (let index = 1; index < blueprint.alternatives.size; ++index) {
        const fork: UnidocBlueprintValidationAutomata = this.clone()
        fork._states.size += 1
        fork._states.last.blueprint = blueprint
        fork._blueprint = blueprint.alternatives.get(index)
        branch.fork(fork)
      }

      this._states.size += 1
      this._states.last.blueprint = blueprint
      this._blueprint = blueprint.alternatives.get(0)
    } else {
      this._blueprint = blueprint.next
    }
  }

  private validateTag(branch: UnidocBranchValidator, event?: UnidocEvent): void {
    if (event == null) return

    const blueprint: UnidocBlueprint.Tag = this._blueprint as UnidocBlueprint.Tag

    if (event.type !== UnidocEventType.START_TAG) {
      this.throwUnexpectedContent(branch)
    } else if (!blueprint.matcher.validate(event.tag)) {
      this.throwUnexpectedContent(branch)
    }

    this._states.size += 1
    this._states.last.blueprint = blueprint
    this._states.last.tag = event.tag
    this._blueprint = blueprint.content
  }

  private processSet(branch: UnidocBranchValidator): void {
    const blueprint: UnidocBlueprint.Set = this._blueprint as UnidocBlueprint.Set

    if (blueprint.alternatives.size > 0) {
      for (let index = 1; index < blueprint.alternatives.size; ++index) {
        const fork: UnidocBlueprintValidationAutomata = this.clone()
        fork._states.size += 1
        fork._states.last.blueprint = blueprint

        const checked: Pack<number> = fork._states.last.checked
        checked.size = blueprint.alternatives.size
        checked.fill(0)
        checked.set(index, 1)
        fork._blueprint = blueprint.alternatives.get(index)
        branch.fork(fork)
      }

      this._states.size += 1
      this._states.last.blueprint = blueprint
      const checked: Pack<number> = this._states.last.checked
      checked.size = blueprint.alternatives.size
      checked.fill(0)
      checked.set(0, 1)

      this._blueprint = blueprint.alternatives.get(0)
    } else {
      this._blueprint = blueprint.next
    }
  }

  private processLenientSequence(branch: UnidocBranchValidator): void {
    const blueprint: UnidocBlueprint.LenientSequence = this._blueprint as UnidocBlueprint.LenientSequence

    if (blueprint.sequence.size > 0) {
      for (let index = 1; index < blueprint.sequence.size; ++index) {
        const fork: UnidocBlueprintValidationAutomata = this.clone()
        fork._states.size += 1
        fork._states.last.blueprint = blueprint

        const checked: Pack<number> = fork._states.last.checked
        checked.size = blueprint.sequence.size
        checked.fill(0)
        checked.set(index, 1)
        fork._blueprint = blueprint.sequence.get(index)
        branch.fork(fork)
      }

      this._states.size += 1
      this._states.last.blueprint = blueprint
      const checked: Pack<number> = this._states.last.checked
      checked.size = blueprint.sequence.size
      checked.fill(0)
      checked.set(0, 1)

      this._blueprint = blueprint.sequence.get(0)
    } else {
      this._blueprint = blueprint.next
    }
  }

  private processMany(branch: UnidocBranchValidator): void {
    const blueprint: UnidocBlueprint.Many = this._blueprint as UnidocBlueprint.Many

    if (blueprint.minimum === 0) {
      const fork: UnidocBlueprintValidationAutomata = this.clone()
      fork._blueprint = blueprint.next
      branch.fork(fork)
    }

    this._states.size += 1
    this._states.last.blueprint = blueprint
    this._blueprint = blueprint.content
  }

  private processEnd(branch: UnidocBranchValidator): void {
    const state: UnidocBlueprintValidationState = this._states.last

    switch (state.blueprint.type) {
      case UnidocBlueprintType.MANY:
        return this.processEndOfMany(branch)
      case UnidocBlueprintType.ANY:
        return this.processEndOfAny()
      case UnidocBlueprintType.SET:
        return this.processEndOfSet(branch)
      case UnidocBlueprintType.LENIENT_SEQUENCE:
        return this.processEndOfLenientSequence(branch)
      default:
        throw new Error(
          'Unable to process end of a state of type #' + state.blueprint.type +
          ' (' + UnidocBlueprintType.toString(state.blueprint.type) + ') ' +
          'because no procedure was defined for this.'
        )
    }
  }

  private processEndOfMany(branch: UnidocBranchValidator): void {
    const state: UnidocBlueprintValidationState = this._states.last
    const blueprint: UnidocBlueprint.Many = state.blueprint as UnidocBlueprint.Many

    state.current += 1

    if (state.current > blueprint.maximum) {
      branch.asMessageOfType(UnnecessaryContent.TYPE)
        .ofCode(UnnecessaryContent.CODE)
        .withData(UnnecessaryContent.Data.BLUEPRINT, blueprint)
        .produce()

      this.recover(branch)
    }

    if (state.current >= blueprint.minimum) {
      const fork: UnidocBlueprintValidationAutomata = this.clone()
      fork._states.pop()
      fork._blueprint = blueprint.next
      branch.fork(fork)
    }

    this._blueprint = blueprint.content
  }

  private processEndOfAny(): void {
    const state: UnidocBlueprintValidationState = this._states.last
    const blueprint: UnidocBlueprint.Any = state.blueprint as UnidocBlueprint.Any

    this._states.pop()
    this._blueprint = blueprint.next
  }

  private processEndOfSet(branch: UnidocBranchValidator): void {
    const state: UnidocBlueprintValidationState = this._states.last
    const blueprint: UnidocBlueprint.Set = state.blueprint as UnidocBlueprint.Set
    const checked: Pack<number> = state.checked

    let forks: number = 0
    let first: number = 0

    for (let index = 0; index < blueprint.alternatives.size; ++index) {
      if (checked.get(index) === 0) {
        if (forks === 0) {
          first = index
        } else {
          const fork: UnidocBlueprintValidationAutomata = this.clone()
          const fchecked: Pack<number> = fork._states.last.checked
          fchecked.set(index, 1)
          fork._blueprint = blueprint.alternatives.get(index)
          branch.fork(fork)
        }

        forks += 1
      }
    }

    if (forks > 0) {
      checked.set(first, 1)
      this._blueprint = blueprint.alternatives.get(first)
    } else {
      this._states.pop()
      this._blueprint = blueprint.next
    }
  }

  private processEndOfLenientSequence(branch: UnidocBranchValidator): void {
    const state: UnidocBlueprintValidationState = this._states.last
    const blueprint: UnidocBlueprint.LenientSequence = state.blueprint as UnidocBlueprint.LenientSequence
    const checked: Pack<number> = state.checked

    let forks: number = 0
    let first: number = 0
    let ordered: number = -1
    let mustWarn: boolean = true

    for (let index = 0; index < blueprint.sequence.size; ++index) {
      if (checked.get(index) === 0) {
        if (ordered < 0) {
          ordered = index
        }

        if (forks === 0) {
          first = index
        } else {
          const fork: UnidocBlueprintValidationAutomata = this.clone()
          const fchecked: Pack<number> = fork._states.last.checked
          fchecked.set(index, 1)
          fork._blueprint = blueprint.sequence.get(index)
          branch.fork(fork)
        }

        forks += 1
      } else if (ordered >= 0 && mustWarn) {
        mustWarn = false
        this.emitPreferredContentWarning(branch, blueprint.sequence.get(ordered))
      }
    }

    if (forks > 0) {
      checked.set(first, 1)
      this._blueprint = blueprint.sequence.get(first)
    } else {
      this._states.pop()
      this._blueprint = blueprint.next
    }
  }

  private completeEndOfTag(branch: UnidocBranchValidator): void {
    const state: UnidocBlueprintValidationState = this._states.last
    const blueprint: UnidocBlueprint.Tag = state.blueprint as UnidocBlueprint.Tag

    this._blueprint = this._tagEnd
    this._tagEnd.tag = state.tag
    this._tagEnd.next = blueprint.next

    this.completeWithRequiredContent(branch)

    this._states.pop()
    this._blueprint = blueprint.next
  }

  private validateEndOfTag(branch: UnidocBranchValidator, event?: UnidocEvent): void {
    if (event == null) return

    const state: UnidocBlueprintValidationState = this._states.last
    const blueprint: UnidocBlueprint.Tag = state.blueprint as UnidocBlueprint.Tag

    this._blueprint = this._tagEnd
    this._tagEnd.tag = state.tag
    this._tagEnd.next = blueprint.next

    if (event.type !== UnidocEventType.END_TAG) {
      this.throwUnexpectedContent(branch)
    } else if (event.tag !== state.tag) {
      this.throwUnexpectedContent(branch)
    }

    this._states.pop()
    this._blueprint = blueprint.next
  }

  private emitPreferredContentWarning(branch: UnidocBranchValidator, blueprint: UnidocBlueprint): void {
    branch.asMessageOfType(PreferredContent.TYPE)
      .ofCode(PreferredContent.CODE)
      .withData(PreferredContent.Data.BLUEPRINT, blueprint)
      .produce()
  }

  /**
  * @see UnidocBranchAutomata.last
  */
  public last(branch: UnidocBranchValidator): void {

  }

  public copy(toCopy: UnidocBlueprintValidationAutomata): void {
    this._blueprint = toCopy._blueprint
    this._blueprint = toCopy._blueprint
    this._recoveries = toCopy._recoveries
    this._states.copy(toCopy._states)
  }

  public clone(): UnidocBlueprintValidationAutomata {
    const result: UnidocBlueprintValidationAutomata = new UnidocBlueprintValidationAutomata(this._blueprint)
    result.copy(this)
    return result
  }

  private recover(branch: UnidocBranchValidator): void {
    this._recoveries += 1

    if (this._recoveries >= MAXIMUM_ALLOWED_RECOVERIES) {
      branch.asMessageOfType(TooManyErrors.TYPE)
        .ofCode(TooManyErrors.CODE)
        .withData(TooManyErrors.Data.BLUEPRINT, this._blueprint)
        .withData(TooManyErrors.Data.RECOVERIES, this._recoveries)
        .produce()

      branch.complete()
    }
  }
}
