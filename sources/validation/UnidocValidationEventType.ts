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
  * Declare a fork.
  */
  export const FORKED: UnidocValidationEventType = 2

  /**
  * Declare the validation of an event in a branch.
  */
  export const VALIDATION: UnidocValidationEventType = 3

  /**
  * Declare the termination of the validated document..
  */
  export const DOCUMENT_COMPLETION: UnidocValidationEventType = 4

  /**
  * Declare a message in a branch.
  */
  export const MESSAGE: UnidocValidationEventType = 5

  /**
  * Declare a merge of a branch into another one.
  */
  export const MERGE: UnidocValidationEventType = 6

  /**
  * Declare the termination of a branch.
  */
  export const TERMINATION: UnidocValidationEventType = 7

  /**
  * Declare the begining of a blueprint match.
  */
  export const ENTER_BLUEPRINT: UnidocValidationEventType = 8

  /**
  * Declare the end of a blueprint.
  */
  export const EXIT_BLUEPRINT: UnidocValidationEventType = 9

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
    FORKED,
    VALIDATION,
    DOCUMENT_COMPLETION,
    MESSAGE,
    MERGE,
    ENTER_BLUEPRINT,
    EXIT_BLUEPRINT
  ]

  /**
  *
  */
  export function toString(value: UnidocValidationEventType): string | undefined {
    switch (value) {
      case CREATION: return 'CREATION'
      case TERMINATION: return 'TERMINATION'
      case FORK: return 'FORK'
      case FORKED: return 'FORKED'
      case VALIDATION: return 'VALIDATION'
      case DOCUMENT_COMPLETION: return 'DOCUMENT_COMPLETION'
      case MESSAGE: return 'MESSAGE'
      case MERGE: return 'MERGE'
      case ENTER_BLUEPRINT: return 'ENTER_BLUEPRINT'
      case EXIT_BLUEPRINT: return 'EXIT_BLUEPRINT'
      default: return undefined
    }
  }

  /**
  *
  */
  export function toDebugString(value: UnidocValidationEventType): string {
    return '#' + value + ' (' + (toString(value) || 'undefined') + ')'
  }
}
