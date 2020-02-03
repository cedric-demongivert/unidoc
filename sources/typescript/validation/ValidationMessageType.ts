export type ValidationMessageType = number

export const ERROR : ValidationMessageType = 0
export const WARNING : ValidationMessageType = 1
export const INFORMATION : ValidationMessageType = 2
export const VERBOSE : ValidationMessageType = 3

export const ALL : ValidationMessageType[] = [
  ERROR, WARNING, INFORMATION, VERBOSE
]

export function toString (type : ValidationMessageType) : string {
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
        `The value ${type} is not a valid ValidationMessageType constant.`
      )
  }
}
