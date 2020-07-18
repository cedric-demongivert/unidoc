export type UnidocParserEventType = string

export namespace UnidocParserEventType {
  export const EVENT      : UnidocParserEventType = 'event'
  export const COMPLETION : UnidocParserEventType = 'completion'
  export const VALIDATION : UnidocParserEventType = 'validation'
  export const ERROR      : UnidocParserEventType = 'error'

  export const ALL        : UnidocParserEventType[] = [
    EVENT, COMPLETION, VALIDATION, ERROR
  ]
}
