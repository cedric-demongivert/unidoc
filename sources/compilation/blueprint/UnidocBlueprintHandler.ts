import { UnidocBlueprint } from './UnidocBlueprint'

export interface BlueprintCompiler {
  /**
  *
  */
  onEntering(blueprint: UnidocBlueprint): void

  onEvent(event: UnidocEvent): void

  /**
  *
  */
  onExiting(blueprint: UnidocBlueprint): void
}
