export type UnidocLexerState = number

export namespace UnidocLexerState {
  export const START             : UnidocLexerState = 0
  export const ANTISLASH         : UnidocLexerState = 1
  export const SHARP             : UnidocLexerState = 2
  export const IDENTIFIER        : UnidocLexerState = 3
  export const DOT               : UnidocLexerState = 4
  export const CLASS             : UnidocLexerState = 5
  export const TAG               : UnidocLexerState = 6
  export const SPACE             : UnidocLexerState = 7
  export const CARRIAGE_RETURN   : UnidocLexerState = 8
  export const WORD              : UnidocLexerState = 9
}
