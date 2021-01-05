import { UnidocBlueprint } from '../../blueprint/UnidocBlueprint'
import { UnidocEvent } from '../../event/UnidocEvent'

export interface BlueprintCompiler {
  /**
  *
  */
  onStart(blueprint: UnidocBlueprint): void

  /**
  *
  */
  onEntering(blueprint: UnidocBlueprint): void

  /**
  *
  */
  onEvent(event: UnidocEvent, blueprint: UnidocBlueprint): void

  /**
  *
  */
  onCompilation(blueprint: UnidocBlueprint, value: any): void

  /**
  *
  */
  onExiting(blueprint: UnidocBlueprint): void

  /**
  *
  */
  onTerminate(blueprint: UnidocBlueprint): void
}
