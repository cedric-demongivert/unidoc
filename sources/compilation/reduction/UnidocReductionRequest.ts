export type UnidocReductionRequest = number

/**
 * 
 */
export namespace UnidocReductionRequest {
  /**
   *
   */
  export const CURRENT: UnidocReductionRequest = 0

  /**
   *
   */
  export const NEXT: UnidocReductionRequest = 1

  /**
   *
   */
  export const ALL: UnidocReductionRequest[] = [
    CURRENT,
    NEXT
  ]

  /**
   *
   */
  export const DEFAULT: UnidocReductionRequest = CURRENT

  /**
   *
   */
  export function toString(type: UnidocReductionRequest): string | undefined {
    switch (type) {
      case CURRENT: return 'CURRENT'
      case NEXT: return 'NEXT'
      default: return undefined
    }
  }

  /**
   *
   */
  export function toDebugString(value: UnidocReductionRequest): string | undefined {
    return '#' + value + ' (' + (toString(value) || 'undefined') + ')'
  }
}
