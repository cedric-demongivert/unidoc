import { UnidocValidationTextReducingStep } from './UnidocValidationTextReducingStep'

const EMPTY_STRING: string = ''

export class UnidocValidationTextReducerState {
  /**
  *
  */
  public step: UnidocValidationTextReducingStep

  /**
  *
  */
  public result: string

  /**
  *
  */
  public constructor() {
    this.step = UnidocValidationTextReducingStep.DEFAULT
    this.result = EMPTY_STRING
  }

  /**
  *
  */
  public whitespace(): UnidocValidationTextReducerState {
    switch (this.step) {
      case UnidocValidationTextReducingStep.CONTENT:
        this.step = UnidocValidationTextReducingStep.WHITESPACES
      case UnidocValidationTextReducingStep.LEADING_WHITESPACES:
      case UnidocValidationTextReducingStep.WHITESPACES:
        return this
      default:
        throw new Error(
          'Unable to handle whitespace addition in step ' +
          UnidocValidationTextReducingStep.toDebugString(this.step) +
          ' because no procedure was defined for that.'
        )
    }
  }

  /**
  *
  */
  public content(content: string): UnidocValidationTextReducerState {
    switch (this.step) {
      case UnidocValidationTextReducingStep.LEADING_WHITESPACES:
        this.step = UnidocValidationTextReducingStep.CONTENT
        this.result = content
        return this
      case UnidocValidationTextReducingStep.CONTENT:
        this.result += content
        return this
      case UnidocValidationTextReducingStep.WHITESPACES:
        this.step = UnidocValidationTextReducingStep.CONTENT
        this.result += ' '
        this.result += content
        return this
      default:
        throw new Error(
          'Unable to handle content addition in step ' +
          UnidocValidationTextReducingStep.toDebugString(this.step) +
          ' because no procedure was defined for that.'
        )
    }
  }

  /**
  *
  */
  public clear(): UnidocValidationTextReducerState {
    this.step = UnidocValidationTextReducingStep.DEFAULT
    this.result = EMPTY_STRING
    return this
  }
}

export namespace UnidocValidationTextReducerState {

}
