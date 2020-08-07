export type UnidocParserStateType = number

export namespace UnidocParserStateType {
  /**
  * State of the parser before it receive any token.
  */
  export const START                           : UnidocParserStateType = 0

  /**
  * State of the parser when only spaces was discovered at the begining of the
  * document. The following may be a regular document content or a document tag
  * specification.
  */
  export const START_WHITESPACE                : UnidocParserStateType = 1

  /**
  * State of the parser when a document tag was discovered, await tag content,
  * tag class, tag identifier or spaces.
  */
  export const START_CLASSES_BEFORE_IDENTIFIER : UnidocParserStateType = 2

  /**
  * State of the parser when a document tag was discovered, and some spaces.
  * Spaces may be future content, or just a separator between each tag classes.
  */
  export const START_SPACE_BEFORE_IDENTIFIER   : UnidocParserStateType = 3

  /**
  * State of the parser when a document tag identifier was discovered, await
  * tag content, tag class, or spaces.
  */
  export const START_CLASSES_AFTER_IDENTIFIER  : UnidocParserStateType = 4

  /**
  * State of the parser when a document tag identifier was discovered, and some
  * spaces. Saces may be future content, or just a separator between each tag
  * classes.
  */
  export const START_SPACE_AFTER_IDENTIFIER    : UnidocParserStateType = 5


  /**
  * State of the parser when it await for more document content.
  */
  export const STREAM_CONTENT                  : UnidocParserStateType = 6

  /**
  * State of the parser when it await for the only content of a unclosed tag.
  */
  export const SINGLETON_CONTENT               : UnidocParserStateType = 7
  export const SINGLETON_TERMINATION           : UnidocParserStateType = 8

  /**
  * State of the parser when it await for the content of a closed tag.
  */
  export const BLOCK_CONTENT                   : UnidocParserStateType = 9

  /**
  * State of the parser when it is in error.
  */
  export const ERROR                           : UnidocParserStateType = 10

  /**
  * State of the parser when it await for more whitespace content.
  */
  export const WHITESPACE                      : UnidocParserStateType = 11

  /**
  * State of the parser when it await for more word content.
  */
  export const WORD                            : UnidocParserStateType = 12
  export const TAG_CLASSES_BEFORE_IDENTIFIER   : UnidocParserStateType = 13
  export const TAG_CLASSES_AFTER_IDENTIFIER    : UnidocParserStateType = 14

  /**
  * State of the parser at the end of the stream.
  */
  export const TERMINATION                     : UnidocParserStateType = 15

  export const ALL              : UnidocParserStateType[] = [
    START,
    START_WHITESPACE,
    START_CLASSES_BEFORE_IDENTIFIER,
    START_SPACE_BEFORE_IDENTIFIER,
    START_CLASSES_AFTER_IDENTIFIER,
    START_SPACE_AFTER_IDENTIFIER,
    STREAM_CONTENT,
    SINGLETON_CONTENT,
    SINGLETON_TERMINATION,
    BLOCK_CONTENT,
    ERROR,
    WHITESPACE,
    WORD,
    TAG_CLASSES_BEFORE_IDENTIFIER,
    TAG_CLASSES_AFTER_IDENTIFIER,
    TERMINATION
  ]

  /**
  * Stringify the given state.
  *
  * @param state - A state to stringify.
  *
  * @return A string representation of the given state.
  */
  export function toString (state : UnidocParserStateType) : string | undefined {
    switch (state) {
      case START                           : return 'START'
      case START_WHITESPACE                : return 'START_WHITESPACE'
      case START_CLASSES_BEFORE_IDENTIFIER : return 'START_CLASSES_BEFORE_IDENTIFIER'
      case START_SPACE_BEFORE_IDENTIFIER   : return 'START_SPACE_BEFORE_IDENTIFIER'
      case START_CLASSES_AFTER_IDENTIFIER  : return 'START_CLASSES_AFTER_IDENTIFIER'
      case START_SPACE_AFTER_IDENTIFIER    : return 'START_SPACE_AFTER_IDENTIFIER'
      case STREAM_CONTENT                  : return 'STREAM_CONTENT'
      case SINGLETON_CONTENT               : return 'SINGLETON_CONTENT'
      case SINGLETON_TERMINATION           : return 'SINGLETON_TERMINATION'
      case BLOCK_CONTENT                   : return 'BLOCK_CONTENT'
      case ERROR                           : return 'ERROR'
      case WHITESPACE                      : return 'WHITESPACE'
      case WORD                            : return 'WORD'
      case TAG_CLASSES_BEFORE_IDENTIFIER   : return 'TAG_CLASSES_BEFORE_IDENTIFIER'
      case TAG_CLASSES_AFTER_IDENTIFIER    : return 'TAG_CLASSES_AFTER_IDENTIFIER'
      case TERMINATION                     : return 'TERMINATION'
      default                              : return undefined
    }
  }
}
