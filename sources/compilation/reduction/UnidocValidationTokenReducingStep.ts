export type UnidocValidationTokenReducingStep = number

export namespace UnidocValidationTokenReducingStep {
  /**
  *
  */
  export const LEADING_WHITESPACES: UnidocValidationTokenReducingStep = 0

  /**
  *
  */
  export const CONTENT: UnidocValidationTokenReducingStep = 1

  /**
  *
  */
  export const TRAILING_WHITESPACES: UnidocValidationTokenReducingStep = 2

  /**
  *
  */
  export const DEFAULT: UnidocValidationTokenReducingStep = LEADING_WHITESPACES

  /**
  *
  */
  export const ALL: UnidocValidationTokenReducingStep[] = [
    LEADING_WHITESPACES,
    CONTENT,
    TRAILING_WHITESPACES
  ]

  /**
  *
  */
  export function toString(value: UnidocValidationTokenReducingStep): string | undefined {
    switch (value) {
      case LEADING_WHITESPACES: return 'LEADING_WHITESPACES'
      case CONTENT: return 'CONTENT'
      case TRAILING_WHITESPACES: return 'TRAILING_WHITESPACES'
      default: return undefined
    }
  }

  /**
  *
  */
  export function toDebugString(value: UnidocValidationTokenReducingStep): string {
    return '#' + value + ' (' + (toString(value) || 'undefined') + ')'
  }
}
