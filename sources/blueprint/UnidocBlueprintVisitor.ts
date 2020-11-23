import { UnidocBlueprint } from './UnidocBlueprint'

import { UnidocBlueprintVisitingState } from './UnidocBlueprintVisitingState'

export class UnidocBlueprintVisitor {
  private readonly _states: Map<UnidocBlueprint, UnidocBlueprintVisitingState>

  public constructor() {
    this._states = new Map()
  }

  public visiting(blueprint: UnidocBlueprint): void {
    this._states.set(blueprint, UnidocBlueprintVisitingState.VISITING)
  }

  public visited(blueprint: UnidocBlueprint): void {
    this._states.set(blueprint, UnidocBlueprintVisitingState.VISITED)
  }

  public state(blueprint: UnidocBlueprint): UnidocBlueprintVisitor.State {
    return this._states.get(blueprint) || UnidocBlueprintVisitingState.UNVISITED
  }

  public isVisiting(blueprint: UnidocBlueprint): boolean {
    return this._states.get(blueprint) === UnidocBlueprintVisitingState.VISITING
  }

  public wasVisited(blueprint: UnidocBlueprint): boolean {
    return this._states.get(blueprint) === UnidocBlueprintVisitingState.VISITED
  }

  public isUnvisited(blueprint: UnidocBlueprint): boolean {
    return (
      this._states.get(blueprint) == null ||
      this._states.get(blueprint) === UnidocBlueprintVisitingState.UNVISITED
    )
  }

  public clear(): void {
    this._states.clear()
  }
}

export namespace UnidocBlueprintVisitor {
  export type State = UnidocBlueprintVisitingState
  export const State = UnidocBlueprintVisitingState

  export function create(): UnidocBlueprintVisitor {
    return new UnidocBlueprintVisitor()
  }
}
