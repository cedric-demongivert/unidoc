import { UnidocBlueprint } from '../../blueprint/UnidocBlueprint'

import { UnidocState } from './UnidocState'

import { UnidocValidationMessageProducer } from '../../validation/UnidocValidationMessageProducer'

export interface UnidocBlueprintValidationContext {
  /**
  * The blueprint that is currently validated.
  */
  readonly blueprint: UnidocBlueprint

  /**
  * The current state to resolve.
  */
  readonly state: UnidocState

  /**
  * The output message producer.
  */
  readonly output: UnidocValidationMessageProducer

  /**
  * Make the validation process entering into the requested state of the current blueprint.
  *
  * @param state - The state to enter.
  */
  enter(state: UnidocState): void

  /**
  * Make the validation process dive into the requested blueprint.
  *
  * @param state - The state to enter.
  * @param blueprint - The blueprint to dive into.
  */
  dive(state: UnidocState, blueprint: UnidocBlueprint): void

  /**
  * Make the validation process exit the current blueprint validation as a success.
  */
  success(): void

  /**
  * Make the validation process exit the current blueprint validation as a failure.
  */
  failure(): void
}
