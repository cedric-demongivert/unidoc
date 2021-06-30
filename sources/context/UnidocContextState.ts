/**
 * 
 */
export type UnidocContextState = number

/**
 * 
 */
export namespace UnidocContextState {

  /**
   * 
   */
  export const CREATED: UnidocContextState = 0

  /**
   * 
   */
  export const RUNNING: UnidocContextState = 1

  /**
   * 
   */
  export const IMPORTING: UnidocContextState = 2

  /**
   * 
   */
  export const COMPLETED: UnidocContextState = 3

  /**
   * 
   */
  export const ALL: UnidocContextState[] = [
    CREATED,
    RUNNING,
    IMPORTING,
    COMPLETED
  ]

  /**
   * 
   */
  export function toString(value: UnidocContextState): string | undefined {
    switch (value) {
      case CREATED: return 'CREATED'
      case RUNNING: return 'RUNNING'
      case IMPORTING: return 'IMPORTING'
      case COMPLETED: return 'COMPLETED'
      default: return undefined
    }
  }
}
