/**
 * 
 */
export type UnidocAutoWrapperState = (
  UnidocAutoWrapperState.LEADING_WHITESPACES |
  UnidocAutoWrapperState.DOCUMENT |
  UnidocAutoWrapperState.JUST_CLOSED |
  UnidocAutoWrapperState.STREAM
)

/**
 * 
 */
export namespace UnidocAutoWrapperState {
  /**
   * 
   */
  export type LEADING_WHITESPACES = 0

  /**
   * 
   */
  export const LEADING_WHITESPACES: LEADING_WHITESPACES = 0

  /**
   * 
   */
  export type DOCUMENT = 1

  /**
   * 
   */
  export const DOCUMENT: DOCUMENT = 1

  /**
   * 
   */
  export type JUST_CLOSED = 2

  /**
   * 
   */
  export const JUST_CLOSED: JUST_CLOSED = 2

  /**
   * 
   */
  export type STREAM = 3

  /**
   * 
   */
  export const STREAM: STREAM = 3

  /**
   * 
   */
  export const ALL: UnidocAutoWrapperState[] = [
    LEADING_WHITESPACES,
    DOCUMENT,
    JUST_CLOSED,
    STREAM
  ]

  /**
   * 
   */
  export function toString(state: UnidocAutoWrapperState): string | undefined {
    switch (state) {
      case LEADING_WHITESPACES: return 'LEADING_WHITESPACES'
      case DOCUMENT: return 'DOCUMENT'
      case JUST_CLOSED: return 'JUST_CLOSED'
      case STREAM: return 'STREAM'
      default: return undefined
    }
  }

  /**
   * 
   */
  export function toDebugString(state: UnidocAutoWrapperState): string {
    return `UnidocAutoWrapperState #${state} (${toString(state) || 'undefined'})`
  }
}