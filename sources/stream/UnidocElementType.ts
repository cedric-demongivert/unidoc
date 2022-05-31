/**
 * 
 */
export type UnidocElementType = (
  UnidocElementType.START |
  UnidocElementType.NEXT |
  UnidocElementType.FAILURE |
  UnidocElementType.SUCCESS
)

/**
 * 
 */
export namespace UnidocElementType {
  /**
    * 
    */
  export type START = 0

  /**
   * 
   */
  export const START: START = 0

  /**
   * 
   */
  export type NEXT = 1

  /**
   * 
   */
  export const NEXT: NEXT = 1

  /**
   * 
   */
  export type SUCCESS = 2

  /**
   * 
   */
  export const SUCCESS: SUCCESS = 2

  /**
   * 
   */
  export type FAILURE = 3

  /**
   * 
   */
  export const FAILURE: FAILURE = 3

  /**
   * 
   */
  export const DEFAULT: UnidocElementType = START

  /**
   * 
   */
  export const ALL: UnidocElementType[] = [
    START,
    NEXT,
    SUCCESS,
    FAILURE
  ]

  /**
   * 
   */
  export function toString(value: UnidocElementType): string | undefined {
    switch (value) {
      case START: return 'START'
      case NEXT: return 'NEXT'
      case SUCCESS: return 'SUCCESS'
      case FAILURE: return 'FAILURE'
      default: return undefined
    }
  }

  /**
   * 
   */
  export function toDebugString(value: UnidocElementType): string | undefined {
    return `UnidocElementType #${value} (${toString(value) || 'undefined'})`
  }
}