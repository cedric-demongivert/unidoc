
/**
 * 
 */
export type UnidocTokenType = (
  UnidocTokenType.IDENTIFIER |
  UnidocTokenType.CLASS |
  UnidocTokenType.TAG |
  UnidocTokenType.BLOCK_START |
  UnidocTokenType.BLOCK_END |
  UnidocTokenType.NEW_LINE |
  UnidocTokenType.SPACE |
  UnidocTokenType.WORD
)

/**
 * 
 */
export namespace UnidocTokenType {
  /**
   * 
   */
  export type IDENTIFIER = 0

  /**
   * 
   */
  export const IDENTIFIER: IDENTIFIER = 0

  /**
   * 
   */
  export type CLASS = 1

  /**
   * 
   */
  export const CLASS: CLASS = 1

  /**
   * 
   */
  export type TAG = 2

  /**
   * 
   */
  export const TAG: TAG = 2

  /**
   * 
   */
  export type BLOCK_START = 3

  /**
   * 
   */
  export const BLOCK_START: BLOCK_START = 3

  /**
   * 
   */
  export type BLOCK_END = 4

  /**
   * 
   */
  export const BLOCK_END: BLOCK_END = 4

  /**
   * 
   */
  export type NEW_LINE = 5

  /**
   * 
   */
  export const NEW_LINE: NEW_LINE = 5

  /**
   * 
   */
  export type SPACE = 6

  /**
   * 
   */
  export const SPACE: SPACE = 6

  /**
   * 
   */
  export type WORD = 7

  /**
   * 
   */
  export const WORD: WORD = 7

  /**
   * 
   */
  export const DEFAULT_TYPE: UnidocTokenType = 0

  /**
   * 
   */
  export const ALL: UnidocTokenType[] = [
    IDENTIFIER, CLASS, TAG, BLOCK_START, BLOCK_END, NEW_LINE,
    SPACE, WORD
  ]

  /**
  * Return a string representation of a given unidoc token type.
  *
  * @param value - Unidoc token type to stringify.
  */
  export function toString(value: UnidocTokenType): string | undefined {
    switch (value) {
      case IDENTIFIER: return 'IDENTIFIER'
      case CLASS: return 'CLASS'
      case TAG: return 'TAG'
      case BLOCK_START: return 'BLOCK_START'
      case BLOCK_END: return 'BLOCK_END'
      case NEW_LINE: return 'NEW_LINE'
      case SPACE: return 'SPACE'
      case WORD: return 'WORD'
      default: return undefined
    }
  }
}
