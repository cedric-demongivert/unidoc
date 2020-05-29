export type UnidocQueryExecutionResult = number

export namespace UnidocQueryExecutionResult {
  export const DROP : UnidocQueryExecutionResult = 0
  export const NEXT : UnidocQueryExecutionResult = 1
  export const KEEP : UnidocQueryExecutionResult = 2

  export const ALL : UnidocQueryExecutionResult[] = [
    DROP,
    NEXT,
    KEEP
  ]

  export function toString (value : UnidocQueryExecutionResult) : string {
    switch (value) {
      case DROP : return 'DROP'
      case NEXT : return 'NEXT'
      case KEEP : return 'KEEP'
      default   : return undefined
    }
  }
}
