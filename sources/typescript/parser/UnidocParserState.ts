export type UnidocParserState = number

export namespace UnidocParserState {
  export const START                  : UnidocParserState = 0
  export const ERROR                  : UnidocParserState = 1
  export const WHITESPACE             : UnidocParserState = 2
  export const WORD                   : UnidocParserState = 3
  export const DOCUMENT_CONTENT       : UnidocParserState = 4
  export const BLOCK_IDENTIFIER       : UnidocParserState = 5
  export const BLOCK_CLASSES          : UnidocParserState = 6
  export const BLOCK_CONTENT          : UnidocParserState = 7
  export const TAG_TYPE               : UnidocParserState = 8
  export const TAG_IDENTIFIER         : UnidocParserState = 9
  export const TAG_CLASSES            : UnidocParserState = 10
  export const TAG_CONTENT            : UnidocParserState = 11
  export const END                    : UnidocParserState = 12

  export function toString (state : UnidocParserState) : string {
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
