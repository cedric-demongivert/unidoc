/**
 * The inner state of a source of unidoc symbols.
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
   * The state of a source of symbols that was just instantiated.
   */
  export type INSTANTIATED = 0

  /**
   * The state of a source of symbols that was just instantiated.
   */
  export const INSTANTIATED: INSTANTIATED = 0

  /**
   * The state of a source of symbols that is producing symbols.
   */
  export type RUNNING = 1

  /**
   * The state of a source of symbols that is producing symbols.
   */
  export const RUNNING: RUNNING = 1

  /**
   * The state of a source of symbols that produced all of it's symbols.
   */
  export type FINISHED = 2

  /**
   * The state of a source of symbols that produced all of it's symbols.
   */
  export const FINISHED: FINISHED = 2

  /**
   * The state of a source of symbols that stopped it's production due to a problem.
   */
  export type FAILED = 3

  /**
   * The state of a source of symbols that stopped it's production due to a problem.
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