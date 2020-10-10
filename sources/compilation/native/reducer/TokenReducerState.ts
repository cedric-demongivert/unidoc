export type TokenReducerState = number

export namespace TokenReducerState {
  export const BEFORE_CONTENT : TokenReducerState = 0
  export const WITHIN_CONTENT : TokenReducerState = 1
  export const AFTER_CONTENT  : TokenReducerState = 2

  export const DEFAULT : TokenReducerState = BEFORE_CONTENT

  export const ALL : TokenReducerState[] = [
    BEFORE_CONTENT,
    WITHIN_CONTENT,
    AFTER_CONTENT
  ]

  export function toString (value : TokenReducerState) : string | undefined {
    switch (value) {
      case BEFORE_CONTENT : return 'BEFORE_CONTENT'
      case WITHIN_CONTENT : return 'WITHIN_CONTENT'
      case AFTER_CONTENT  : return 'AFTER_CONTENT'
      default             : return undefined
    }
  }
}
