export type UnidocLexerEventType = string

export namespace UnidocLexerEventType {
  export const TOKEN      : UnidocLexerEventType = 'token'
  export const COMPLETION : UnidocLexerEventType = 'completion'
  export const VALIDATION : UnidocLexerEventType = 'validation'
  export const ERROR      : UnidocLexerEventType = 'error'

  export const ALL        : UnidocLexerEventType[] = [
    TOKEN, COMPLETION, VALIDATION, ERROR
  ]
}
