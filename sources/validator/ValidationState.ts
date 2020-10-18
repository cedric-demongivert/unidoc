import { UnidocValidationType } from '../validation/UnidocValidationType'

export type ValidationState = number

export namespace ValidationState {
  export const NEUTRAL : ValidationState = 0
  export const SUCCESS : ValidationState = 1
  export const VERBOSE : ValidationState = 2
  export const SUBJECT : ValidationState = 3
  export const WARNING : ValidationState = 4
  export const FAILURE : ValidationState = 5

  export const DEFAULT : ValidationState = NEUTRAL

  export const ALL : ValidationState[] = [
    NEUTRAL,
    SUCCESS,
    VERBOSE,
    SUBJECT,
    WARNING,
    FAILURE
  ]

  export function toString (state : ValidationState) : string | undefined {
    switch (state) {
      case NEUTRAL : return 'NEUTRAL'
      case SUCCESS : return 'SUCCESS'
      case VERBOSE : return 'VERBOSE'
      case SUBJECT : return 'SUBJECT'
      case WARNING : return 'WARNING'
      case FAILURE : return 'FAILURE'
      default      : return undefined
    }
  }

  export function fromValidationType (state : UnidocValidationType) : ValidationState {
    switch (state) {
      case UnidocValidationType.INFORMATION : return SUBJECT
      case UnidocValidationType.WARNING     : return WARNING
      case UnidocValidationType.VERBOSE     : return VERBOSE
      case UnidocValidationType.ERROR       : return FAILURE
      default                               :
        throw new Error(
          'Unable to convert unidoc validation type #' + state + ' (' +
          UnidocValidationType.toString(state) + ') to a validation state as ' +
          'no mapping exists for this particular one.'
        )
    }
  }
}
