export type UnidocParserStateType = number

export namespace UnidocParserStateType {
  export const START            : UnidocParserStateType   = 0
  export const ERROR            : UnidocParserStateType   = 1
  export const WHITESPACE       : UnidocParserStateType   = 2
  export const WORD             : UnidocParserStateType   = 3
  export const DOCUMENT_CONTENT : UnidocParserStateType   = 4
  export const BLOCK_IDENTIFIER : UnidocParserStateType   = 5
  export const BLOCK_CLASSES    : UnidocParserStateType   = 6
  export const BLOCK_CONTENT    : UnidocParserStateType   = 7
  export const TAG_TYPE         : UnidocParserStateType   = 8
  export const TAG_IDENTIFIER   : UnidocParserStateType   = 9
  export const TAG_CLASSES      : UnidocParserStateType   = 10
  export const TAG_CONTENT      : UnidocParserStateType   = 11
  export const END              : UnidocParserStateType   = 12

  export const ALL              : UnidocParserStateType[] = [
    START,
    ERROR,
    WHITESPACE,
    WORD,
    DOCUMENT_CONTENT,
    BLOCK_IDENTIFIER,
    BLOCK_CLASSES,
    BLOCK_CONTENT,
    TAG_TYPE,
    TAG_IDENTIFIER,
    TAG_CLASSES,
    TAG_CONTENT,
    END
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
      case START            : return 'START'
      case ERROR            : return 'ERROR'
      case WHITESPACE       : return 'WHITESPACE'
      case WORD             : return 'WORD'
      case DOCUMENT_CONTENT : return 'DOCUMENT_CONTENT'
      case BLOCK_IDENTIFIER : return 'BLOCK_IDENTIFIER'
      case BLOCK_CLASSES    : return 'BLOCK_CLASSES'
      case BLOCK_CONTENT    : return 'BLOCK_CONTENT'
      case TAG_TYPE         : return 'TAG_TYPE'
      case TAG_IDENTIFIER   : return 'TAG_IDENTIFIER'
      case TAG_CLASSES      : return 'TAG_CLASSES'
      case TAG_CONTENT      : return 'TAG_CONTENT'
      case END              : return 'END'
      default               : return undefined
    }
  }
}
