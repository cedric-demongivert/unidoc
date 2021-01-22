export type UnidocKissValidatorOutputType = number

export namespace UnidocKissValidatorOutputType {
  /**
  *
  */
  export const CURRENT: UnidocKissValidatorOutputType = 0

  /**
  *
  */
  export const NEXT: UnidocKissValidatorOutputType = 1

  /**
  *
  */
  export const EMIT: UnidocKissValidatorOutputType = 2

  /**
  *
  */
  export const END: UnidocKissValidatorOutputType = 3

  /**
  *
  */
  export const MATCH: UnidocKissValidatorOutputType = 4

  /**
  *
  */
  export const ALL: UnidocKissValidatorOutputType[] = [
    CURRENT,
    NEXT,
    EMIT,
    END,
    MATCH
  ]

  /**
  *
  */
  export const DEFAULT: UnidocKissValidatorOutputType = CURRENT

  /**
  *
  */
  export function toString(type: UnidocKissValidatorOutputType): string | undefined {
    switch (type) {
      case CURRENT: return 'CURRENT'
      case NEXT: return 'NEXT'
      case EMIT: return 'EMIT'
      case END: return 'END'
      default: return undefined
    }
  }

  /**
  *
  */
  export function toDebugString(type: UnidocKissValidatorOutputType): string {
    return '#' + type + ' (' + (toString(type) || 'undefined') + ')'
  }
}
