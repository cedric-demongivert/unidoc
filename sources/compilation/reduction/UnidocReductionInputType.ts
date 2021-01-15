export type UnidocReductionInputType = number

export namespace UnidocReductionInputType {
  /**
  *
  */
  export const START: UnidocReductionInputType = 0

  /**
  *
  */
  export const EVENT: UnidocReductionInputType = 1

  /**
  *
  */
  export const GROUP_START: UnidocReductionInputType = 2

  /**
  *
  */
  export const GROUP_END: UnidocReductionInputType = 3

  /**
  *
  */
  export const END: UnidocReductionInputType = 4

  /**
  *
  */
  export const ALL: UnidocReductionInputType[] = [
    START,
    EVENT,
    GROUP_START,
    GROUP_END,
    END
  ]

  /**
  *
  */
  export const DEFAULT: UnidocReductionInputType = START

  /**
  *
  */
  export function toString(type: UnidocReductionInputType): string | undefined {
    switch (type) {
      case START: return 'START'
      case EVENT: return 'EVENT'
      case GROUP_START: return 'GROUP_START'
      case GROUP_END: return 'GROUP_END'
      case END: return 'END'
      default: return undefined
    }
  }

  /**
  *
  */
  export function toDebugString(value: UnidocReductionInputType): string | undefined {
    return '#' + value + ' (' + (toString(value) || 'undefined') + ')'
  }
}
