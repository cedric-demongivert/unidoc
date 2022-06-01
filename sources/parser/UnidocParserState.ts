/**
 * 
 */
export type UnidocParserState = (
  UnidocParserState.BLOCK_CONTENT |
  UnidocParserState.ERROR |
  UnidocParserState.WHITESPACE |
  UnidocParserState.WORD |
  UnidocParserState.CLASS_OF_TAG_WITHOUT_IDENTIFIER |
  UnidocParserState.CLASS_OF_TAG_WITH_IDENTIFIER |
  UnidocParserState.TERMINATION
)

/**
 * 
 */
export namespace UnidocParserState {
  /**
   * 
   */
  export type BLOCK_CONTENT = 0

  /**
  * State of the parser when it await any tag content. More precisely any new
  * spaces, tag, word or tag block termination.
  */
  export const BLOCK_CONTENT: BLOCK_CONTENT = 0

  /**
   * 
   */
  export type ERROR = 1

  /**
   * State of the parser when it fail in an unrecoverable error.
   */
  export const ERROR: ERROR = 1

  /**
   * 
   */
  export type WHITESPACE = 2

  /**
   * State of the parser when it has discovered an arbitrary number of
   * whitespaces that are a content of a tag or a document. In this state the
   * parser await for more whitespaces or any new content.
   */
  export const WHITESPACE: WHITESPACE = 2

  /**
   * 
   */
  export type WORD = 3

  /**
   * State of the parser when it has discovered an arbitrary number of words
   * that are a content of a tag or a document. In this state the parser await
   * for more words or any new content.
   */
  export const WORD: WORD = 3

  /**
   * 
   */
  export type CLASS_OF_TAG_WITHOUT_IDENTIFIER = 4

  /**
   * State of the parser when it has discovered a tag with an arbitrary number of
   * classes. In this state the parser expect to receive another tag classes, a
   * tag identifier, spaces, at tag block begining or any following content.
   */
  export const CLASS_OF_TAG_WITHOUT_IDENTIFIER: CLASS_OF_TAG_WITHOUT_IDENTIFIER = 4


  /**
   * 
   */
  export type CLASS_OF_TAG_WITH_IDENTIFIER = 5

  /**
   * State of the parser when it has discovered a tag followed by an arbitrary
   * number of classes, an identifier and another arbitrary number of classes. In
   * this state the parser expect to receive another tag classes, spaces, a tag
   * block begining or any following content.
   */
  export const CLASS_OF_TAG_WITH_IDENTIFIER: CLASS_OF_TAG_WITH_IDENTIFIER = 5

  /**
   *
   */
  export type TERMINATION = 6

  /**
   * State of the parser at the end of the stream.
   */
  export const TERMINATION: TERMINATION = 6

  /**
   * State of the parser by default.
   */
  export const DEFAULT: UnidocParserState = BLOCK_CONTENT

  /**
  * A list of all possible states of a parser.
  */
  export const ALL: UnidocParserState[] = [
    BLOCK_CONTENT,
    ERROR,
    WHITESPACE,
    WORD,
    CLASS_OF_TAG_WITHOUT_IDENTIFIER,
    CLASS_OF_TAG_WITH_IDENTIFIER,
    TERMINATION
  ]

  /**
  * Stringify the given state.
  *
  * @param state - A state to stringify.
  *
  * @return A string representation of the given state.
  */
  export function toString(state: UnidocParserState): string | undefined {
    switch (state) {
      case BLOCK_CONTENT: return 'BLOCK_CONTENT'
      case ERROR: return 'ERROR'
      case WHITESPACE: return 'WHITESPACE'
      case WORD: return 'WORD'
      case CLASS_OF_TAG_WITHOUT_IDENTIFIER: return 'CLASS_OF_TAG_WITHOUT_IDENTIFIER'
      case CLASS_OF_TAG_WITH_IDENTIFIER: return 'CLASS_OF_TAG_WITH_IDENTIFIER'
      case TERMINATION: return 'TERMINATION'
      default: return undefined
    }
  }

  /**
  * Stringify the given state.
  *
  * @param state - A state to stringify.
  *
  * @return A string representation of the given state.
  */
  export function toDebugString(state: UnidocParserState): string | undefined {
    return `UnidocParserStarte #${state} (${toString(state) || 'undefined'})`
  }
}
