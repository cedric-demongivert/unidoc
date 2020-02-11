export type UnidocTokenType = number

export namespace UnidocTokenType {
  export const IDENTIFIER          : UnidocTokenType = 0
  export const CLASS               : UnidocTokenType = 1
  export const TAG                 : UnidocTokenType = 2
  export const BLOCK_START         : UnidocTokenType = 3
  export const BLOCK_END           : UnidocTokenType = 4
  export const NEW_LINE            : UnidocTokenType = 5
  export const SPACE               : UnidocTokenType = 6
  export const WORD                : UnidocTokenType = 7
  export const END_OF_FILE         : UnidocTokenType = 8

  export const ALL                 : UnidocTokenType[] = [
    IDENTIFIER, CLASS, TAG, BLOCK_START, BLOCK_END, NEW_LINE,
    SPACE, WORD, END_OF_FILE
  ]

  /**
  * Return a string representation of a given unidoc token type.
  *
  * @param value - Unidoc token type to stringify.
  */
  export function toString (value : UnidocTokenType) : string {
    switch (value) {
      case IDENTIFIER : return 'IDENTIFIER'
      case CLASS      : return 'CLASS'
      case TAG        : return 'TAG'
      case BLOCK_START: return 'BLOCK_START'
      case BLOCK_END  : return 'BLOCK_END'
      case NEW_LINE   : return 'NEW_LINE'
      case SPACE      : return 'SPACE'
      case WORD       : return 'WORD'
      case END_OF_FILE: return 'END_OF_FILE'
      default         : return undefined
    }
  }
}
