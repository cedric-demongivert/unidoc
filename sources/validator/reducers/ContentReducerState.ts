export type ContentReducerState = number

export namespace ContentReducerState {
  export const BEFORE_CONTENT : ContentReducerState = 0
  export const WITHIN_CONTENT : ContentReducerState = 1
  export const AFTER_CONTENT  : ContentReducerState = 2

  export const DEFAULT : ContentReducerState = BEFORE_CONTENT

  export const ALL : ContentReducerState[] = [
    BEFORE_CONTENT,
    WITHIN_CONTENT,
    AFTER_CONTENT
  ]

  export function toString (value : ContentReducerState) : string | undefined {
    switch (value) {
      case BEFORE_CONTENT : return 'BEFORE_CONTENT'
      case WITHIN_CONTENT : return 'WITHIN_CONTENT'
      case AFTER_CONTENT  : return 'AFTER_CONTENT'
      default             : return undefined
    }
  }
}
