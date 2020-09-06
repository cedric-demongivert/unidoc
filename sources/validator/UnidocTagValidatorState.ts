export type UnidocTagValidatorState = number

export namespace UnidocTagValidatorState {
  export const BEFORE_TAG_START : UnidocTagValidatorState = 0
  export const AFTER_TAG_START : UnidocTagValidatorState = 1
  export const AFTER_TAG_END : UnidocTagValidatorState = 2
  export const AFTER_ERROR : UnidocTagValidatorState = 3

  export const ALL : UnidocTagValidatorState[] = [
    BEFORE_TAG_START, AFTER_TAG_START, AFTER_TAG_END, AFTER_ERROR
  ]

  export function toString (value : UnidocTagValidatorState) : string | undefined {
    switch (value) {
      case BEFORE_TAG_START : return 'BEFORE_TAG_START'
      case AFTER_TAG_START  : return 'AFTER_TAG_START'
      case AFTER_TAG_END    : return 'AFTER_TAG_END'
      case AFTER_ERROR      : return 'AFTER_ERROR'
      default               : return undefined
    }
  }
}
