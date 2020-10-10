export type StreamReducerState = number

export namespace StreamReducerState {
  export const BEFORE_STREAM  : StreamReducerState = 0
  export const WITHIN_STREAM  : StreamReducerState = 1
  export const AFTER_STREAM   : StreamReducerState = 2
  export const WITHIN_ELEMENT : StreamReducerState = 3

  export const DEFAULT : StreamReducerState = BEFORE_STREAM

  export const ALL : StreamReducerState[] = [
    BEFORE_STREAM,
    WITHIN_STREAM,
    AFTER_STREAM,
    WITHIN_ELEMENT
  ]

  export function toString (value : StreamReducerState) : string | undefined {
    switch (value) {
      case BEFORE_STREAM  : return 'BEFORE_STREAM'
      case WITHIN_STREAM  : return 'WITHIN_STREAM'
      case AFTER_STREAM   : return 'AFTER_STREAM'
      case WITHIN_ELEMENT : return 'WITHIN_ELEMENT'
      default             : return undefined
    }
  }
}
