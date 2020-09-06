export type NumberScalarCompilerState = number

export namespace NumberScalarCompilerState {
  export const BEFORE_CONTENT : NumberScalarCompilerState = 0
  export const WITHIN_CONTENT : NumberScalarCompilerState = 1
  export const AFTER_CONTENT  : NumberScalarCompilerState = 2

  export const DEFAULT : NumberScalarCompilerState = BEFORE_CONTENT

  export const ALL : NumberScalarCompilerState[] = [
    BEFORE_CONTENT,
    WITHIN_CONTENT,
    AFTER_CONTENT
  ]

  export function toString (value : NumberScalarCompilerState) : string | undefined {
    switch (value) {
      case BEFORE_CONTENT : return 'BEFORE_CONTENT'
      case WITHIN_CONTENT : return 'WITHIN_CONTENT'
      case AFTER_CONTENT  : return 'AFTER_CONTENT'
      default             : return undefined
    }
  }
}
