/**
 * 
 */
export type UnidocImportExtractorState = (
  UnidocImportExtractorState.CONTENT |
  UnidocImportExtractorState.LEADING_WHITESPACE |
  UnidocImportExtractorState.URI |
  UnidocImportExtractorState.URI_TRAILING_WHITESPACE |
  UnidocImportExtractorState.TYPEDEF |
  UnidocImportExtractorState.TYPEDEF_VALUE |
  UnidocImportExtractorState.TYPEDEF_TRAILING_WHITESPACE
)

/**
 * 
 */
export namespace UnidocImportExtractorState {
  /**
   * 
   */
  export type CONTENT = 0

  /**
   * 
   */
  export const CONTENT: CONTENT = 0

  /**
   * 
   */
  export type LEADING_WHITESPACE = 1

  /**
   * 
   */
  export const LEADING_WHITESPACE: LEADING_WHITESPACE = 1

  /**
   * 
   */
  export type URI = 2

  /**
   * 
   */
  export const URI: URI = 2

  /**
   * 
   */
  export type URI_TRAILING_WHITESPACE = 3

  /**
   * 
   */
  export const URI_TRAILING_WHITESPACE: URI_TRAILING_WHITESPACE = 3

  /**
   * 
   */
  export type TYPEDEF = 4

  /**
   * 
   */
  export const TYPEDEF: TYPEDEF = 4

  /**
   * 
   */
  export type TYPEDEF_VALUE = 5

  /**
   * 
   */
  export const TYPEDEF_VALUE: TYPEDEF_VALUE = 5

  /**
   * 
   */
  export type TYPEDEF_TRAILING_WHITESPACE = 6

  /**
   * 
   */
  export const TYPEDEF_TRAILING_WHITESPACE: TYPEDEF_TRAILING_WHITESPACE = 6

  /**
   * 
   */
  export const ALL: UnidocImportExtractorState[] = [
    CONTENT,
    LEADING_WHITESPACE,
    URI,
    URI_TRAILING_WHITESPACE,
    TYPEDEF,
    TYPEDEF_VALUE,
    TYPEDEF_TRAILING_WHITESPACE
  ]

  /**
   * 
   */
  export function toString(value: UnidocImportExtractorState): string | undefined {
    switch (value) {
      case CONTENT: return 'CONTENT'
      case LEADING_WHITESPACE: return 'LEADING_WHITESPACE'
      case URI: return 'URI'
      case URI_TRAILING_WHITESPACE: return 'URI_TRAILING_WHITESPACE'
      case TYPEDEF: return 'TYPEDEF'
      case TYPEDEF_VALUE: return 'TYPEDEF_VALUE'
      case TYPEDEF_TRAILING_WHITESPACE: return 'TYPEDEF_TRAILING_WHITESPACE'
      default: return undefined
    }
  }

  /**
   * 
   */
  export function toDebugString(value: UnidocImportExtractorState): string {
    return 'UnidocImportExtractorState #' + value + ' (' + (toString(value) || 'undefined') + ')'
  }
}
