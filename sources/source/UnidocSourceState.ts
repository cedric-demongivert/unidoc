/**
 * 
 */
export type UnidocSourceState = (
  UnidocSourceState.INSTANTIATED |
  UnidocSourceState.RUNNING |
  UnidocSourceState.FINISHED |
  UnidocSourceState.FAILED
)

/**
 * 
 */
export namespace UnidocSourceState {
  /**
   * 
   */
  export type INSTANTIATED = 0

  /**
   * 
   */
  export const INSTANTIATED: INSTANTIATED = 0

  /**
   * 
   */
  export type RUNNING = 1

  /**
   * 
   */
  export const RUNNING: RUNNING = 1

  /**
   * 
   */
  export type FINISHED = 2

  /**
   * 
   */
  export const FINISHED: FINISHED = 2

  /**
   * 
   */
  export type FAILED = 3

  /**
   * 
   */
  export const FAILED: FAILED = 3

  /**
   * 
   */
  export const ALL: UnidocSourceState[] = [
    INSTANTIATED,
    RUNNING,
    FINISHED,
    FAILED
  ]

  /**
   * 
   */
  export function toString(state: UnidocSourceState): string | undefined {
    switch (state) {
      case INSTANTIATED: return 'INSTANTIATED'
      case RUNNING: return 'RUNNING'
      case FINISHED: return 'FINISHED'
      case FAILED: return 'FAILED'
      default: return undefined
    }
  }

  /**
   * 
   */
  export function toDebugString(state: UnidocSourceState): string {
    return 'UnidocSourceState #' + state + ' (' + (toString(state) || 'undefined') + ')'
  }
}