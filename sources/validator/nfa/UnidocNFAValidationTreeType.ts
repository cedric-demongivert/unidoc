export type UnidocNFAValidationTreeType = number

export namespace UnidocNFAValidationTreeType {
  /**
  *
  */
  export const START: UnidocNFAValidationTreeType = 0

  /**
  *
  */
  export const STATE: UnidocNFAValidationTreeType = 1

  /**
  *
  */
  export const EVENT: UnidocNFAValidationTreeType = 2

  /**
  *
  */
  export const HEAD: UnidocNFAValidationTreeType = 3

  /**
  *
  */
  export const ALL: UnidocNFAValidationTreeType[] = [
    START,
    STATE,
    EVENT,
    HEAD
  ]

  /**
  *
  */
  export const DEFAULT: UnidocNFAValidationTreeType = START

  /**
  *
  */
  export function toString(type: UnidocNFAValidationTreeType): string | undefined {
    switch (type) {
      case UnidocNFAValidationTreeType.START: return 'START'
      case UnidocNFAValidationTreeType.STATE: return 'STATE'
      case UnidocNFAValidationTreeType.EVENT: return 'EVENT'
      case UnidocNFAValidationTreeType.HEAD: return 'HEAD'
      default: return undefined
    }
  }

  /**
  *
  */
  export function toDebugString(type: UnidocNFAValidationTreeType): string {
    return '#' + type + ' (' + (toString(type) || 'undefined') + ')'
  }
}
