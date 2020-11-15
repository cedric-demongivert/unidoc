export type UnidocStreamState = number

export namespace UnidocStreamState {
  export const CREATED: UnidocStreamState = 0
  export const RUNNING: UnidocStreamState = 1
  export const IMPORTING: UnidocStreamState = 2
  export const COMPLETED: UnidocStreamState = 3

  export const ALL: UnidocStreamState[] = [
    CREATED,
    RUNNING,
    IMPORTING,
    COMPLETED
  ]

  export function toString(value: UnidocStreamState): string | undefined {
    switch (value) {
      case CREATED: return 'CREATED'
      case RUNNING: return 'RUNNING'
      case IMPORTING: return 'IMPORTING'
      case COMPLETED: return 'COMPLETED'
      default: return undefined
    }
  }
}
