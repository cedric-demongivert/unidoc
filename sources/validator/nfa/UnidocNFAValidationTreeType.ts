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
  export const ALL: UnidocNFAValidationTreeType[] = [
    START,
    STATE,
    EVENT
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
