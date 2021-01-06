export type UnidocValidationTextReducingStep = number

export namespace UnidocValidationTextReducingStep {
  /**
  *
  */
  export const LEADING_WHITESPACES: UnidocValidationTextReducingStep = 0

  /**
  *
  */
  export const CONTENT: UnidocValidationTextReducingStep = 1

  /**
  *
  */
  export const WHITESPACES: UnidocValidationTextReducingStep = 2

  /**
  *
  */
  export const DEFAULT: UnidocValidationTextReducingStep = LEADING_WHITESPACES

  /**
  *
  */
  export const ALL: UnidocValidationTextReducingStep[] = [
    LEADING_WHITESPACES,
    CONTENT,
    WHITESPACES
  ]

  /**
  *
  */
  export function toString(value: UnidocValidationTextReducingStep): string | undefined {
    switch (value) {
      case LEADING_WHITESPACES: return 'LEADING_WHITESPACES'
      case CONTENT: return 'CONTENT'
      case WHITESPACES: return 'WHITESPACES'
      default: return undefined
    }
  }

  /**
  *
  */
  export function toDebugString(value: UnidocValidationTextReducingStep): string {
    return '#' + value + ' (' + (toString(value) || 'undefined') + ')'
  }
}
