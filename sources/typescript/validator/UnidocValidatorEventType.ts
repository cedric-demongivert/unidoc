export type UnidocValidatorEventType = string

export namespace UnidocValidatorEventType {
  export const COMPLETION : UnidocValidatorEventType = 'completion'
  export const VALIDATION : UnidocValidatorEventType = 'validation'

  export const ALL        : UnidocValidatorEventType[] = [
    VALIDATION, COMPLETION
  ]
}
