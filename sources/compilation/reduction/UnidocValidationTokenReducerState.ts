import { UnidocValidationTokenReducingStep } from './UnidocValidationTokenReducingStep'

const EMPTY_STRING: string = ''

export class UnidocValidationTokenReducerState {
  /**
  *
  */
  public step: UnidocValidationTokenReducingStep

  /**
  *
  */
  public result: string

  /**
  *
  */
  public constructor() {
    this.step = UnidocValidationTokenReducingStep.DEFAULT
    this.result = EMPTY_STRING
  }

  /**
  *
  */
  public whitespace(): UnidocValidationTokenReducerState {
    switch (this.step) {
      case UnidocValidationTokenReducingStep.CONTENT:
        this.step = UnidocValidationTokenReducingStep.TRAILING_WHITESPACES
      case UnidocValidationTokenReducingStep.LEADING_WHITESPACES:
      case UnidocValidationTokenReducingStep.TRAILING_WHITESPACES:
        return this
      default:
        throw new Error(
          'Unable to handle whitespace addition in step ' +
          UnidocValidationTokenReducingStep.toDebugString(this.step) +
          ' because no procedure was defined for that.'
        )
    }
  }

  /**
  *
  */
  public content(content: string): UnidocValidationTokenReducerState {
    switch (this.step) {
      case UnidocValidationTokenReducingStep.LEADING_WHITESPACES:
        this.step = UnidocValidationTokenReducingStep.CONTENT
        this.result = content
        return this
      case UnidocValidationTokenReducingStep.CONTENT:
        this.result += content
        return this
      case UnidocValidationTokenReducingStep.TRAILING_WHITESPACES:
        throw new Error(
          'Unable to add content after the reception of a trailing ' +
          'whitespace. Do not try to reduce textual content as a token.'
        )
      default:
        throw new Error(
          'Unable to handle content addition in step ' +
          UnidocValidationTokenReducingStep.toDebugString(this.step) +
          ' because no procedure was defined for that.'
        )
    }
  }

  /**
  *
  */
  public clear(): UnidocValidationTokenReducerState {
    this.step = UnidocValidationTokenReducingStep.DEFAULT
    this.result = EMPTY_STRING
    return this
  }
}

export namespace UnidocValidationTokenReducerState {

}
