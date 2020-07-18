export type UnidocLexerState = number

export namespace UnidocLexerState {
  export const START           : UnidocLexerState = 0
  export const ANTISLASH       : UnidocLexerState = 1
  export const SHARP           : UnidocLexerState = 2
  export const IDENTIFIER      : UnidocLexerState = 3
  export const DOT             : UnidocLexerState = 4
  export const CLASS           : UnidocLexerState = 5
  export const TAG             : UnidocLexerState = 6
  export const SPACE           : UnidocLexerState = 7
  export const CARRIAGE_RETURN : UnidocLexerState = 8
  export const WORD            : UnidocLexerState = 9
  export const END             : UnidocLexerState = 10

  export const ALL             : UnidocLexerState[] = [
    START, ANTISLASH, SHARP, IDENTIFIER, DOT, CLASS,
    TAG, SPACE, CARRIAGE_RETURN, WORD, END
  ]

  export function toString (state : UnidocLexerState) : string | undefined {
    switch (state) {
      case START: return 'START'
      case ANTISLASH: return 'ANTISLASH'
      case SHARP: return 'SHARP'
      case IDENTIFIER: return 'IDENTIFIER'
      case DOT: return 'DOT'
      case CLASS: return 'CLASS'
      case TAG: return 'TAG'
      case SPACE: return 'SPACE'
      case CARRIAGE_RETURN: return 'CARRIAGE_RETURN'
      case WORD: return 'WORD'
      case END: return 'END'
      default: return undefined
    }
  }
}
