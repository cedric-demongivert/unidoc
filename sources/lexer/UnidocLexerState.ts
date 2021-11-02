/**
*
*/
export type UnidocLexerState = number

/**
*
*/
export namespace UnidocLexerState {
  /**
  *
  */
  export const START: UnidocLexerState = 0

  /**
  *
  */
  export const REVERSE_SOLIDUS: UnidocLexerState = 1

  /**
  *
  */
  export const NUMBER_SIGN: UnidocLexerState = 2

  /**
  *
  */
  export const IDENTIFIER: UnidocLexerState = 3

  /**
  *
  */
  export const FULL_STOP: UnidocLexerState = 4

  /**
  *
  */
  export const CLASS: UnidocLexerState = 5

  /**
  *
  */
  export const TAG: UnidocLexerState = 6

  /**
  *
  */
  export const SPACE: UnidocLexerState = 7

  /**
  *
  */
  export const CARRIAGE_RETURN: UnidocLexerState = 8

  /**
  *
  */
  export const WORD: UnidocLexerState = 9

  /**
  *
  */
  export const END: UnidocLexerState = 10

  /**
  *
  */
  export const ALL: UnidocLexerState[] = [
    START, REVERSE_SOLIDUS, NUMBER_SIGN, IDENTIFIER, FULL_STOP, CLASS,
    TAG, SPACE, CARRIAGE_RETURN, WORD, END
  ]

  /**
  *
  */
  export const DEFAULT: UnidocLexerState = START

  /**
  *
  */
  export function toString(state: UnidocLexerState): string | undefined {
    switch (state) {
      case START: return 'START'
      case REVERSE_SOLIDUS: return 'REVERSE_SOLIDUS'
      case NUMBER_SIGN: return 'NUMBER_SIGN'
      case IDENTIFIER: return 'IDENTIFIER'
      case FULL_STOP: return 'FULL_STOP'
      case CLASS: return 'CLASS'
      case TAG: return 'TAG'
      case SPACE: return 'SPACE'
      case CARRIAGE_RETURN: return 'CARRIAGE_RETURN'
      case WORD: return 'WORD'
      case END: return 'END'
      default: return undefined
    }
  }

  /**
  *
  */
  export function toDebugString(state: UnidocLexerState): string {
    return '#' + state + ' (' + (toString(state) || 'undefined') + ')'
  }
}
