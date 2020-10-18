export type TagReducerState = number

export namespace TagReducerState {
  export const BEFORE_TAG : TagReducerState = 0
  export const WITHIN_TAG : TagReducerState = 1
  export const AFTER_TAG  : TagReducerState = 2

  export const DEFAULT : TagReducerState = BEFORE_TAG

  export const ALL : TagReducerState[] = [
    BEFORE_TAG,
    WITHIN_TAG,
    AFTER_TAG
  ]

  export function toString (value : TagReducerState) : string | undefined {
    switch (value) {
      case BEFORE_TAG : return 'BEFORE_TAG'
      case WITHIN_TAG : return 'WITHIN_TAG'
      case AFTER_TAG  : return 'AFTER_TAG'
      default         : return undefined
    }
  }
}
