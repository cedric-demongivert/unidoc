export type UnidocSingleGroupReducingStep = number

export namespace UnidocSingleGroupReducingStep {
  /**
  *
  */
  export const LEADING: UnidocSingleGroupReducingStep = 0

  /**
  *
  */
  export const CONTENT: UnidocSingleGroupReducingStep = 1

  /**
  *
  */
  export const TRAILING: UnidocSingleGroupReducingStep = 2

  /**
  *
  */
  export const DEFAULT: UnidocSingleGroupReducingStep = LEADING

  /**
  *
  */
  export const ALL: UnidocSingleGroupReducingStep[] = [
    LEADING,
    CONTENT,
    TRAILING
  ]

  /**
  *
  */
  export function toString(value: UnidocSingleGroupReducingStep): string | undefined {
    switch (value) {
      case LEADING: return 'LEADING'
      case CONTENT: return 'CONTENT'
      case TRAILING: return 'TRAILING'
      default: return undefined
    }
  }

  /**
  *
  */
  export function toDebugString(value: UnidocSingleGroupReducingStep): string {
    return '#' + value + ' (' + (toString(value) || 'undefined') + ')'
  }
}
