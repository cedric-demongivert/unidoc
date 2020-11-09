import { Pack } from '@cedric-demongivert/gl-tool-collection'

import { UnidocEvent } from '../../event/UnidocEvent'
import { UnidocEventType } from '../../event/UnidocEventType'

import { UnidocBranchAutomata } from '../tree/UnidocBranchAutomata'
import { UnidocBranchValidator } from '../tree/UnidocBranchValidator'

import { UnidocBlueprint } from '../../blueprint/UnidocBlueprint'
import { UnidocBlueprintType } from '../../blueprint/UnidocBlueprintType'

import { RequiredContent } from './messages/RequiredContent'
import { TooManyErrors } from './messages/TooManyErrors'
import { UnexpectedContent } from './messages/UnexpectedContent'
import { UnnecessaryContent } from './messages/UnnecessaryContent'

import { UnidocBlueprintValidationState } from './UnidocBlueprintValidationState'

const MAXIMUM_ALLOWED_RECOVERIES: number = 5

export class UnidocBlueprintValidationAutomata implements UnidocBranchAutomata {
  private _blueprint: UnidocBlueprint
  private readonly _states: Pack<UnidocBlueprintValidationState>
  private _recoveries: number

  public constructor(blueprint: UnidocBlueprint) {
    this._blueprint = blueprint
    this._recoveries = 0
    this._states = Pack.instance(UnidocBlueprintValidationState.ALLOCATOR, 12)
  }

  /**
  * @see UnidocBranchAutomata.start
  */
  public initialize(branch: UnidocBranchValidator): void {

  }

  public prevalidate(branch: UnidocBranchValidator): void {
    while (true) {
      const blueprint: UnidocBlueprint = this._blueprint

      switch (blueprint.type) {
        case UnidocBlueprintType.MANY:
          this.processMany(branch)
          break
        case UnidocBlueprintType.END:
          if (this._states.size > 0) {
            this.processEnd(branch)
            break
          } else {
            return
          }
        case UnidocBlueprintType.TAG_START:
        case UnidocBlueprintType.TAG_END:
        case UnidocBlueprintType.WORD:
        case UnidocBlueprintType.WHITESPACE:
          return
        default:
          throw new Error(
            'Unable to prevalidate in accordance with a blueprint of type #' +
            blueprint.type + ' (' + UnidocBlueprintType.toString(blueprint.type)
            + ') because no procedure was defined into this automata for ' +
            'handling this situation.'
          )
      }
    }
  }

  /**
  * @see UnidocBranchAutomata.validate
  */
  public validate(branch: UnidocBranchValidator, event: UnidocEvent): void {
    const blueprint: UnidocBlueprint = this._blueprint

    switch (blueprint.type) {
      case UnidocBlueprintType.MANY:
        throw new Error('Call for a pre-validation before each validation call.')
      case UnidocBlueprintType.TAG_START:
        return this.validateTagStart(branch, event)
      case UnidocBlueprintType.TAG_END:
        return this.validateTagEnd(branch, event)
      case UnidocBlueprintType.WORD:
        return this.validateWord(branch, event)
      case UnidocBlueprintType.WHITESPACE:
        return this.validateWhitespace(branch, event)
      case UnidocBlueprintType.END:
        if (this._states.size > 0) {
          throw new Error('Call for a pre-validation before each validation call.')
        } else {
          return this.validateEnd(branch)
        }
      default:
        throw new Error(
          'Unable to validate event ' + event.toString() + ' in accordance ' +
          'with a blueprint of type #' + blueprint.type + ' (' +
          UnidocBlueprintType.toString(blueprint.type) + ') because no ' +
          'procedure was defined into this automata for handling this ' +
          'situation.'
        )
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

  private validateTagStart(branch: UnidocBranchValidator, event: UnidocEvent): void {
    const blueprint: UnidocBlueprint.TagStart = this._blueprint as UnidocBlueprint.TagStart

    if (event.type !== UnidocEventType.START_TAG || event.tag !== blueprint.tag) {
      this.throwUnexpectedContent(branch)
    }

    this._blueprint = blueprint.next
  }

  private validateTagEnd(branch: UnidocBranchValidator, event: UnidocEvent): void {
    const blueprint: UnidocBlueprint.TagEnd = this._blueprint as UnidocBlueprint.TagEnd

    if (event.type !== UnidocEventType.END_TAG || event.tag !== blueprint.tag) {
      this.throwUnexpectedContent(branch)
    }

    this._blueprint = blueprint.next
  }

  private validateWord(branch: UnidocBranchValidator, event: UnidocEvent): void {
    const blueprint: UnidocBlueprint.Word = this._blueprint as UnidocBlueprint.Word

    if (event.type !== UnidocEventType.WORD) {
      this.throwUnexpectedContent(branch)
    }

    this._blueprint = blueprint.next
  }

  private validateWhitespace(branch: UnidocBranchValidator, event: UnidocEvent): void {
    const blueprint: UnidocBlueprint.Whitespace = this._blueprint as UnidocBlueprint.Whitespace

    if (event.type !== UnidocEventType.WHITESPACE) {
      this.throwUnexpectedContent(branch)
    }

    this._blueprint = blueprint.next
  }

  private validateEnd(branch: UnidocBranchValidator): void {
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
        case UnidocBlueprintType.TAG_START:
        case UnidocBlueprintType.TAG_END:
        case UnidocBlueprintType.WORD:
        case UnidocBlueprintType.WHITESPACE:
          return this.completeWithRequiredContent(branch)
        case UnidocBlueprintType.END:
          if (this._states.size > 0) {
            this.processEnd(branch)
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
