export type UnidocBlueprintVisitingState = number

export namespace UnidocBlueprintVisitingState {
  export const UNVISITED: UnidocBlueprintVisitingState = 0
  export const VISITING: UnidocBlueprintVisitingState = 1
  export const VISITED: UnidocBlueprintVisitingState = 2

  export const ALL: UnidocBlueprintVisitingState[] = [
    UNVISITED,
    VISITING,
    VISITED
  ]

  export function toString(value: UnidocBlueprintVisitingState): string | undefined {
    switch (value) {
      case UNVISITED: return 'UNVISITED'
      case VISITING: return 'VISITING'
      case VISITED: return 'VISITED'
      default: return undefined
    }
  }
}
