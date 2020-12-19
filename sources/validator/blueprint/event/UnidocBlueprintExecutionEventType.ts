export type UnidocBlueprintExecutionEventType = number

export namespace UnidocBlueprintExecutionEventType {
  /**
  * An event that represent the activation of a given state.
  */
  export const ENTER: UnidocBlueprintExecutionEventType = 0

  /**
  * An event that represent the success of a diving attempt.
  */
  export const SUCCESS: UnidocBlueprintExecutionEventType = 1

  /**
  * An event that represent the success of a diving attempt.
  */
  export const SKIP: UnidocBlueprintExecutionEventType = 2

  /**
  * An event that represent the failure of a diving attempt.
  */
  export const FAILURE: UnidocBlueprintExecutionEventType = 3

  /**
  * An event that represent a diving attempt.
  */
  export const DIVE: UnidocBlueprintExecutionEventType = 4

  /**
  * An event that represent the initialization of a given graph.
  */
  export const START: UnidocBlueprintExecutionEventType = 5

  /**
  * An event that represent the waiting for the next available piece of content.
  */
  export const EVENT: UnidocBlueprintExecutionEventType = 6

  /**
  *
  */
  export const ACCEPT_EVERYTHING: UnidocBlueprintExecutionEventType = 7

  /**
  *
  */
  export const KILL: UnidocBlueprintExecutionEventType = 8

  /**
  *
  */
  export const DEFAULT: UnidocBlueprintExecutionEventType = ENTER

  /**
  *
  */
  export const ALL: UnidocBlueprintExecutionEventType[] = [
    ENTER,
    SUCCESS,
    SKIP,
    FAILURE,
    DIVE,
    START,
    EVENT,
    ACCEPT_EVERYTHING,
    KILL
  ]

  /**
  *
  */
  export function toString(value: UnidocBlueprintExecutionEventType): string | undefined {
    switch (value) {
      case ENTER: return 'ENTER'
      case SUCCESS: return 'SUCCESS'
      case SKIP: return 'SKIP'
      case FAILURE: return 'FAILURE'
      case DIVE: return 'DIVE'
      case START: return 'START'
      case EVENT: return 'EVENT'
      case ACCEPT_EVERYTHING: return 'ACCEPT_EVERYTHING'
      case KILL: return 'KILL'
      default: return undefined
    }
  }
}
