export type UnidocValidationType = number

export namespace UnidocValidationType {
  export const DEFAULT     : UnidocValidationType = 0

  export const ERROR       : UnidocValidationType = 0
  export const WARNING     : UnidocValidationType = 1
  export const INFORMATION : UnidocValidationType = 2
  export const VERBOSE     : UnidocValidationType = 3

  export const ALL : UnidocValidationType[] = [
    ERROR, WARNING, INFORMATION, VERBOSE
  ]

  /**
  * Stringify the given validation type constant.
  *
  * @param type - A validation type constant.
  *
  * @return A text representation of the given type constant.
  */
  export function toString (type : UnidocValidationType) : string {
    switch (type) {
      case ERROR       : return 'ERROR'
      case WARNING     : return 'WARNING'
      case INFORMATION : return 'INFORMATION'
      case VERBOSE     : return 'VERBOSE'
      default          : return undefined
    }
  }
}
