export type UnidocValidationEventType = number

export namespace UnidocValidationEventType {
  /**
  * Declare the validation of an event in a branch.
  */
  export const VALIDATION: UnidocValidationEventType = 0

  /**
  * Declare the termination of the validated document..
  */
  export const DOCUMENT_COMPLETION: UnidocValidationEventType = 1

  /**
  * Declare a message in a branch.
  */
  export const MESSAGE: UnidocValidationEventType = 2

  /**
  * Declare the begining of a group match.
  */
  export const BEGIN_GROUP: UnidocValidationEventType = 3

  /**
  * Declare the end of a group match.
  */
  export const END_GROUP: UnidocValidationEventType = 4

  /**
  * Default value.
  */
  export const DEFAULT: UnidocValidationEventType = VALIDATION

  /**
  * All event types.
  */
  export const ALL: UnidocValidationEventType[] = [
    VALIDATION,
    DOCUMENT_COMPLETION,
    MESSAGE,
    BEGIN_GROUP,
    END_GROUP
  ]

  /**
  *
  */
  export function toString(value: UnidocValidationEventType): string | undefined {
    switch (value) {
      case VALIDATION: return 'VALIDATION'
      case DOCUMENT_COMPLETION: return 'DOCUMENT_COMPLETION'
      case MESSAGE: return 'MESSAGE'
      case BEGIN_GROUP: return 'BEGIN_GROUP'
      case END_GROUP: return 'END_GROUP'
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
