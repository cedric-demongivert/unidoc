export type UnidocValidationEventType = number

export namespace UnidocValidationEventType {
  /**
  * Declare the creation of a branch.
  */
  export const CREATION: UnidocValidationEventType = 0

  /**
  * Declare a fork.
  */
  export const FORK: UnidocValidationEventType = 1

  /**
  * Declare the validation of an event in a branch.
  */
  export const VALIDATION: UnidocValidationEventType = 2

  /**
  * Declare the termination of the validated document..
  */
  export const DOCUMENT_COMPLETION: UnidocValidationEventType = 3

  /**
  * Declare a message in a branch.
  */
  export const MESSAGE: UnidocValidationEventType = 4

  /**
  * Declare a merge of a branch into another one.
  */
  export const MERGE: UnidocValidationEventType = 5

  /**
  * Declare the termination of a branch.
  */
  export const TERMINATION: UnidocValidationEventType = 6

  /**
  * Default value.
  */
  export const DEFAULT: UnidocValidationEventType = VALIDATION

  /**
  * All event types.
  */
  export const ALL: UnidocValidationEventType[] = [
    CREATION,
    TERMINATION,
    FORK,
    VALIDATION,
    DOCUMENT_COMPLETION,
    MESSAGE,
    MERGE
  ]

  export function toString(value: UnidocValidationEventType): string | undefined {
    switch (value) {
      case CREATION: return 'CREATION'
      case TERMINATION: return 'TERMINATION'
      case FORK: return 'FORK'
      case VALIDATION: return 'VALIDATION'
      case DOCUMENT_COMPLETION: return 'DOCUMENT_COMPLETION'
      case MESSAGE: return 'MESSAGE'
      case MERGE: return 'MERGE'
      default: return undefined
    }
  }
}
