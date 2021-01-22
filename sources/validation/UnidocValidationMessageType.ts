export type UnidocValidationMessageType = number

export namespace UnidocValidationMessageType {
  /**
  * A message that is intented to be used for debugging purposes.
  */
  export const VERBOSE: UnidocValidationMessageType = 0

  /**
  * A message that describe an optional suggestion that may lead to an
  * improvment of the underlying document.
  */
  export const INFORMATION: UnidocValidationMessageType = 1

  /**
  * A message that describe a property of the underlying document that may make
  * it invalid in a particular context.
  */
  export const WARNING: UnidocValidationMessageType = 2

  /**
  * A message that describe a property of the underlying document that make it
  * invalid. The validation process of a document may continue after an error.
  */
  export const ERROR: UnidocValidationMessageType = 3

  /**
  * A message that describe a property of the underlying document that make it
  * invalid and that immediatly stop the validation process.
  */
  export const FAILURE: UnidocValidationMessageType = 4

  /**
  *
  */
  export const ALL: UnidocValidationMessageType[] = [
    VERBOSE,
    INFORMATION,
    WARNING,
    ERROR,
    FAILURE
  ]

  /**
  *
  */
  export const DEFAULT: UnidocValidationMessageType = 0

  /**
  * Stringify the given validation type constant.
  *
  * @param type - A validation type constant.
  *
  * @return A text representation of the given type constant.
  */
  export function toString(type: UnidocValidationMessageType): string | undefined {
    switch (type) {
      case VERBOSE: return 'VERBOSE'
      case INFORMATION: return 'INFORMATION'
      case WARNING: return 'WARNING'
      case ERROR: return 'ERROR'
      case FAILURE: return 'FAILURE'
      default: return undefined
    }
  }

  /**
  *
  */
  export function toDebugString(type: UnidocValidationMessageType): string {
    return '#' + type + ' (' + (toString(type) || 'undefined') + ')'
  }
}
