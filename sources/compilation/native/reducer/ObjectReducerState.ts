export type ObjectReducerState = number

export namespace ObjectReducerState {
  export const BEFORE_OBJECT  : ObjectReducerState = 0
  export const WITHIN_OBJECT  : ObjectReducerState = 1
  export const AFTER_OBJECT   : ObjectReducerState = 2
  export const WITHIN_ELEMENT : ObjectReducerState = 3

  export const DEFAULT : ObjectReducerState = BEFORE_OBJECT

  export const ALL : ObjectReducerState[] = [
    BEFORE_OBJECT,
    WITHIN_OBJECT,
    AFTER_OBJECT,
    WITHIN_ELEMENT
  ]

  export function toString (value : ObjectReducerState) : string | undefined {
    switch (value) {
      case BEFORE_OBJECT  : return 'BEFORE_OBJECT'
      case WITHIN_OBJECT  : return 'WITHIN_OBJECT'
      case AFTER_OBJECT   : return 'AFTER_OBJECT'
      case WITHIN_ELEMENT : return 'WITHIN_ELEMENT'
      default             : return undefined
    }
  }
}
