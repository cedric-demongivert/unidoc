import { UnidocValidationType } from './UnidocValidationType'

export type ValidationState = number

export namespace ValidationState {
  export const VALID       : ValidationState = 0
  export const VERBOSE     : ValidationState = 1
  export const INFORMATION : ValidationState = 2
  export const WARNING     : ValidationState = 3
  export const ERROR       : ValidationState = 4

  export const ALL : ValidationState[] = [
    VALID,
    VERBOSE,
    INFORMATION,
    WARNING,
    ERROR
  ]

  /**
  * Stringify the given validation type constant.
  *
  * @param type - A validation type constant.
  *
  * @return A text representation of the given type constant.
  */
  export function fromValidationType (type : UnidocValidationType) : ValidationState {
    switch (type) {
      case UnidocValidationType.ERROR       : return ERROR
      case UnidocValidationType.WARNING     : return WARNING
      case UnidocValidationType.INFORMATION : return INFORMATION
      case UnidocValidationType.VERBOSE     : return VERBOSE
      default :
        throw new Error(
          'Unable to derivate a validation state from the given validation ' +
          'type : #' + type + ' (' + UnidocValidationType.toString(type) + ').'
        )
    }
  }

  /**
  * Stringify the given validation type constant.
  *
  * @param type - A validation type constant.
  *
  * @return A text representation of the given type constant.
  */
  export function toString (type : ValidationState) : string | undefined {
    switch (type) {
      case VALID       : return 'VALID'
      case VERBOSE     : return 'VERBOSE'
      case INFORMATION : return 'INFORMATION'
      case WARNING     : return 'WARNING'
      case ERROR       : return 'ERROR'
      default          : return undefined
    }
  }
}
