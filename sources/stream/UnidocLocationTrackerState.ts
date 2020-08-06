export type UnidocLocationTrackerState = number

export namespace UnidocLocationTrackerState {
  export const SYMBOL  : UnidocLocationTrackerState = 0
  export const RETURN  : UnidocLocationTrackerState = 1

  export const DEFAULT : UnidocLocationTrackerState = SYMBOL

  export const ALL : UnidocLocationTrackerState[] = [
    SYMBOL,
    RETURN
  ]

  export function toString (value : UnidocLocationTrackerState) : string | undefined {
    switch (value) {
      case SYMBOL  : return 'SYMBOL'
      case RETURN  : return 'RETURN'
      default      : return undefined
    }
  }

  export function throwUnhandledState (value : number) : void {
    throw new Error(
      'Unhandled or unknown unidoc source reader state ' + value +
      ' "' + toString(value) + '".'
    )
  }
}
