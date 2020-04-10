export type UnidocParserStateType = number

export namespace UnidocParserStateType {
  export const START                           : UnidocParserStateType = 0
  export const START_WHITESPACE                : UnidocParserStateType = 1
  export const START_CLASSES_BEFORE_IDENTIFIER : UnidocParserStateType = 2
  export const START_CLASSES_AFTER_IDENTIFIER  : UnidocParserStateType = 3
  export const STREAM_CONTENT                  : UnidocParserStateType = 4
  export const SINGLETON_CONTENT               : UnidocParserStateType = 5
  export const SINGLETON_TERMINATION           : UnidocParserStateType = 6
  export const BLOCK_CONTENT                   : UnidocParserStateType = 7
  export const ERROR                           : UnidocParserStateType = 8
  export const WHITESPACE                      : UnidocParserStateType = 9
  export const WORD                            : UnidocParserStateType = 10
  export const TAG_CLASSES_BEFORE_IDENTIFIER   : UnidocParserStateType = 11
  export const TAG_CLASSES_AFTER_IDENTIFIER    : UnidocParserStateType = 12
  export const TERMINATION                     : UnidocParserStateType = 13

  export const ALL              : UnidocParserStateType[] = [
    START,
    START_WHITESPACE,
    START_CLASSES_BEFORE_IDENTIFIER,
    START_CLASSES_AFTER_IDENTIFIER,
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
  export function toString (state : UnidocParserStateType) : string {
    switch (state) {
      case START                           : return 'START'
      case START_WHITESPACE                : return 'START_WHITESPACE'
      case START_CLASSES_BEFORE_IDENTIFIER : return 'START_CLASSES_BEFORE_IDENTIFIER'
      case START_CLASSES_AFTER_IDENTIFIER  : return 'START_CLASSES_AFTER_IDENTIFIER'
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
