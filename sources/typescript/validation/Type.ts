export type Type = number

export namespace Type {
  export const ERROR : Type = 0
  export const WARNING : Type = 1
  export const INFORMATION : Type = 2
  export const VERBOSE : Type = 3

  export const ALL : Type[] = [
    ERROR, WARNING, INFORMATION, VERBOSE
  ]

  export function toString (type : Type) : string {
    switch (type) {
      case ERROR: return 'ERROR'
      case WARNING: return 'WARNING'
      case INFORMATION: return 'INFORMATION'
      case VERBOSE: return 'VERBOSE'
      default: return 'INVALID(' + type + ')'
    }
  }

  export function assert (type : number) : void {
    switch (type) {
      case ERROR:
      case WARNING:
      case INFORMATION:
      case VERBOSE:
        return
      default:
        throw new Error(
          `The value ${type} is not a valid Type constant.`
        )
    }
  }

}
