export type UnidocValidationEventType = number

export namespace UnidocValidationEventType {
  /**
  * Declare the initialization of a branch.
  */
  export const INITIALIZATION: UnidocValidationEventType = 0

  /**
  * Declare the completion of a branch.
  */
  export const COMPLETION: UnidocValidationEventType = 1

  /**
  * Declare a branch fork.
  */
  export const FORK: UnidocValidationEventType = 2

  /**
  * Declare the validation of an event in a branch.
  */
  export const VALIDATION: UnidocValidationEventType = 3

  /**
  * Declare a message in a branch.
  */
  export const MESSAGE: UnidocValidationEventType = 4

  /**
  * Default value.
  */
  export const DEFAULT: UnidocValidationEventType = VALIDATION

  export const ALL: UnidocValidationEventType[] = [
    INITIALIZATION,
    COMPLETION,
    FORK,
    VALIDATION,
    MESSAGE
  ]

  export function toString(value: UnidocValidationEventType): string | undefined {
    switch (value) {
      case INITIALIZATION: return 'INITIALIZATION'
      case COMPLETION: return 'COMPLETION'
      case FORK: return 'FORK'
      case VALIDATION: return 'VALIDATION'
      case MESSAGE: return 'MESSAGE'
      default: return undefined
    }
  }
}
