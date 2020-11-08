import { Pack } from '@cedric-demongivert/gl-tool-collection'

import { UnidocEvent } from '../../event/UnidocEvent'
import { UnidocEventType } from '../../event/UnidocEventType'

import { UnidocBranchAutomata } from '../tree/UnidocBranchAutomata'
import { UnidocBranchValidator } from '../tree/UnidocBranchValidator'

import { UnidocBlueprint } from '../../blueprint/UnidocBlueprint'
import { UnidocBlueprintInstruction } from '../../blueprint/UnidocBlueprintInstruction'
import { UnidocInstruction } from '../../blueprint/UnidocInstruction'
import { UnidocInstructionType } from '../../blueprint/UnidocInstructionType'
import { UnidocBlueprintWalker } from '../../blueprint/UnidocBlueprintWalker'

import { RequiredContent } from './messages/RequiredContent'
import { TooManyErrors } from './messages/TooManyErrors'
import { UnexpectedContent } from './messages/UnexpectedContent'
import { UnnecessaryContent } from './messages/UnnecessaryContent'

import { UnidocBlueprintValidationState } from './UnidocBlueprintValidationState'
import { UnidocBlueprintValidationStateType } from './UnidocBlueprintValidationStateType'

const MAXIMUM_ALLOWED_RECOVERIES: number = 5

export class UnidocBlueprintValidationAutomata implements UnidocBranchAutomata {
  private _blueprint: UnidocBlueprint
  private _instruction: number
  private readonly _states: Pack<UnidocBlueprintValidationState>
  private _recoveries: number

  public get instruction(): UnidocBlueprintInstruction {
    return this._blueprint.get(this._instruction)
  }

  public constructor(blueprint: UnidocBlueprint) {
    this._blueprint = blueprint
    this._instruction = 0
    this._recoveries = 0
    this._states = Pack.instance(UnidocBlueprintValidationState.ALLOCATOR, 12)
  }

  /**
  * @see UnidocBranchAutomata.start
  */
  public initialize(branch: UnidocBranchValidator): void {

  }

  /**
  * @see UnidocBranchAutomata.validate
  */
  public validate(branch: UnidocBranchValidator, event: UnidocEvent): void {
    while (true) {
      const instruction: UnidocInstruction = this.instruction.instruction

      switch (instruction.type) {
        case UnidocInstructionType.START_MANY:
          this.startMany(branch)
          break
        case UnidocInstructionType.END_MANY:
          this.endMany(branch)
          break
        case UnidocInstructionType.TAG_START:
          return this.validateTagStart(branch, event)
        case UnidocInstructionType.TAG_END:
          return this.validateTagEnd(branch, event)
        case UnidocInstructionType.WORD:
          return this.validateWord(branch, event)
        case UnidocInstructionType.WHITESPACE:
          return this.validateWhitespace(branch, event)
        case UnidocInstructionType.END:
          return this.validateEnd(branch, event)
        default:
          throw new Error(
            'Unable to validate event ' + event.toString() + ' in accordance ' +
            'with instruction ' +
            this._blueprint.get(this._instruction).toString() +
            ' of type #' + instruction.type + ' (' +
            UnidocInstructionType.toString(instruction.type) + ') because no ' +
            'procedure was defined into this automata for handling this ' +
            'situation.'
          )
      }
    }
  }

  private startMany(branch: UnidocBranchValidator): void {
    const instruction: UnidocInstruction.StartMany = this.instruction.instruction as UnidocInstruction.StartMany

    if (instruction.minimum === 0) {
      const fork: UnidocBlueprintValidationAutomata = this.clone()
      fork._instruction = UnidocBlueprintWalker.get(this._blueprint, this._instruction).walkUntilManyBlockTermination() + 1
      branch.fork(fork)
    }

    this._states.size += 1
    this._states.last.from(this.instruction).asMany(instruction)
    this._instruction += 1
  }

  private endMany(branch: UnidocBranchValidator): void {
    const state: UnidocBlueprintValidationState = this._states.last

    if (state.type === UnidocBlueprintValidationStateType.MANY) {
      state.current += 1

      if (state.current >= state.minimum) {
        const fork: UnidocBlueprintValidationAutomata = this.clone()
        fork._states.pop()
        fork._instruction += 1
        branch.fork(fork)
      }

      if (state.current > state.maximum) {
        branch.asMessageOfType(UnnecessaryContent.TYPE)
          .ofCode(UnnecessaryContent.CODE)
          .withData(UnnecessaryContent.Data.BLUEPRINT, this._blueprint)
          .withData(UnnecessaryContent.Data.INSTRUCTION, this._blueprint.get(state.since))
          .produce()

        this.recover(branch)
      }

      this._instruction = state.since + 1
    } else {
      throw 'Illegal many block termination.'
    }
  }

  private validateTagStart(branch: UnidocBranchValidator, event: UnidocEvent): void {
    const instruction: UnidocInstruction.TagStart = this.instruction.instruction as UnidocInstruction.TagStart

    if (event.type !== UnidocEventType.START_TAG || event.tag !== instruction.tag) {
      this.throwUnexpectedContent(branch)
    }

    this._instruction += 1
  }

  private validateTagEnd(branch: UnidocBranchValidator, event: UnidocEvent): void {
    const instruction: UnidocInstruction.TagEnd = this.instruction.instruction as UnidocInstruction.TagEnd

    if (event.type !== UnidocEventType.END_TAG || event.tag !== instruction.tag) {
      this.throwUnexpectedContent(branch)
    }

    this._instruction += 1
  }

  private validateWord(branch: UnidocBranchValidator, event: UnidocEvent): void {
    if (event.type !== UnidocEventType.WORD) {
      this.throwUnexpectedContent(branch)
    }

    this._instruction += 1
  }

  private validateWhitespace(branch: UnidocBranchValidator, event: UnidocEvent): void {
    if (event.type !== UnidocEventType.WHITESPACE) {
      this.throwUnexpectedContent(branch)
    }

    this._instruction += 1
  }

  private validateEnd(branch: UnidocBranchValidator, event: UnidocEvent): void {
    branch.asMessageOfType(UnnecessaryContent.TYPE)
      .ofCode(UnnecessaryContent.CODE)
      .withData(UnnecessaryContent.Data.BLUEPRINT, this._blueprint)
      .withData(UnnecessaryContent.Data.INSTRUCTION, this.instruction)
      .produce()

    this.recover(branch)
  }

  private throwUnexpectedContent(branch: UnidocBranchValidator): void {
    branch.asMessageOfType(UnexpectedContent.TYPE)
      .ofCode(UnexpectedContent.CODE)
      .withData(UnexpectedContent.Data.BLUEPRINT, this._blueprint)
      .withData(UnexpectedContent.Data.INSTRUCTION, this.instruction)
      .produce()

    this.recover(branch)
  }

  /**
  * @see UnidocBranchAutomata.end
  */
  public complete(branch: UnidocBranchValidator): void {
    while (true) {
      const instruction: UnidocInstruction = this.instruction.instruction

      switch (instruction.type) {
        case UnidocInstructionType.START_MANY:
          this.startMany(branch)
          break
        case UnidocInstructionType.END_MANY:
          this.endMany(branch)
          break
        case UnidocInstructionType.TAG_START:
        case UnidocInstructionType.TAG_END:
        case UnidocInstructionType.WORD:
        case UnidocInstructionType.WHITESPACE:
          return this.completeWithRequiredContent(branch)
        case UnidocInstructionType.END:
          return
        default:
          throw new Error(
            'Unable to end the validation branch in accordance with ' +
            'instruction ' + this._blueprint.get(this._instruction).toString() +
            ' of type #' + instruction.type + ' (' +
            UnidocInstructionType.toString(instruction.type) + ') because no ' +
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
      .withData(RequiredContent.Data.INSTRUCTION, this.instruction)
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
    this._instruction = toCopy._instruction
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
        .withData(TooManyErrors.Data.INSTRUCTION, this.instruction)
        .withData(TooManyErrors.Data.RECOVERIES, this._recoveries)
        .produce()

      branch.complete()
    }
  }
}
