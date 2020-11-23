import { UnidocBlueprint } from '../../blueprint/UnidocBlueprint'
import { UnidocBlueprintType } from '../../blueprint/UnidocBlueprintType'

import { UnidocBlueprintValidationState } from './UnidocBlueprintValidationState'
import { UnidocDisjunctionBlueprintValidationState } from './UnidocDisjunctionBlueprintValidationState'
import { UnidocEndBlueprintValidationState } from './UnidocEndBlueprintValidationState'
import { UnidocEventBlueprintValidationState } from './UnidocEventBlueprintValidationState'
import { UnidocLenientSequenceBlueprintValidationState } from './UnidocLenientSequenceBlueprintValidationState'
import { UnidocManyBlueprintValidationState } from './UnidocManyBlueprintValidationState'
import { UnidocSequenceBlueprintValidationState } from './UnidocSequenceBlueprintValidationState'
import { UnidocSetBlueprintValidationState } from './UnidocSetBlueprintValidationState'
import { UnidocTagBlueprintValidationState } from './UnidocTagBlueprintValidationState'

export namespace UnidocBlueprintResolver {
  /**
  *
  */
  export function resolve(blueprint: UnidocBlueprint): UnidocBlueprintValidationState {
    switch (blueprint.type) {
      case UnidocBlueprintType.DISJUNCTION:
        return UnidocDisjunctionBlueprintValidationState.wrap(blueprint as UnidocBlueprint.Disjunction)
      case UnidocBlueprintType.END:
        return UnidocEndBlueprintValidationState.wrap(blueprint as UnidocBlueprint.End)
      case UnidocBlueprintType.EVENT:
        return UnidocEventBlueprintValidationState.wrap(blueprint as UnidocBlueprint.Event)
      case UnidocBlueprintType.LENIENT_SEQUENCE:
        return UnidocLenientSequenceBlueprintValidationState.wrap(blueprint as UnidocBlueprint.LenientSequence)
      case UnidocBlueprintType.MANY:
        return UnidocManyBlueprintValidationState.wrap(blueprint as UnidocBlueprint.Many)
      case UnidocBlueprintType.SEQUENCE:
        return UnidocSequenceBlueprintValidationState.wrap(blueprint as UnidocBlueprint.Sequence)
      case UnidocBlueprintType.SET:
        return UnidocSetBlueprintValidationState.wrap(blueprint as UnidocBlueprint.Set)
      case UnidocBlueprintType.TAG:
        return UnidocTagBlueprintValidationState.wrap(blueprint as UnidocBlueprint.Tag)
      default:
        throw new Error(
          'Unable to build a validation state from a blueprint of type #' +
          blueprint.type + ' (' + UnidocBlueprintType.toString(blueprint.type) +
          ') because no procedure was defined for that.'
        )
    }
  }
}
