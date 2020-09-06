export type RootValidationContextEventType = string

export namespace RootValidationContextEventType {
  export const COMPLETION : RootValidationContextEventType = 'completion'
  export const VALIDATION : RootValidationContextEventType = 'validation'

  export const ALL        : RootValidationContextEventType[] = [
    VALIDATION,
    COMPLETION
  ]
}
