/**
 * A number that describe the inner state of an unidoc location tracker.
 */
export type UnidocLocationTrackerState = (
  UnidocLocationTrackerState.SYMBOL |
  UnidocLocationTrackerState.RETURN
)

/**
 * 
 */
export namespace UnidocLocationTrackerState {
  /**
   * 
   */
  export type SYMBOL = 0

  /**
   * 
   */
  export const SYMBOL: SYMBOL = 0

  /**
   * 
   */
  export type RETURN = 1

  /**
   * 
   */
  export const RETURN: RETURN = 1

  /**
   * 
   */
  export const DEFAULT: UnidocLocationTrackerState = SYMBOL

  /**
   * 
   */
  export const ALL: UnidocLocationTrackerState[] = [
    SYMBOL,
    RETURN
  ]

  /**
   * 
   * @param value 
   * @returns 
   */
  export function toString(value: number): string | undefined {
    switch (value) {
      case SYMBOL: return 'SYMBOL'
      case RETURN: return 'RETURN'
      default: return undefined
    }
  }

  /**
   * 
   */
  export function throwUnhandledState(value: number): void {
    throw new Error(
      'Unhandled or unknown unidoc source reader state ' + value +
      ' "' + toString(value) + '".'
    )
  }
}
