import { Pack } from '@cedric-demongivert/gl-tool-collection'

import { UnidocBlueprint } from '../../../blueprint/UnidocBlueprint'
import { UnidocBlueprintType } from '../../../blueprint/UnidocBlueprintType'

import { UnidocBlueprintValidationHandler } from './UnidocBlueprintValidationHandler'
import { UnidocDisjunctionValidationHandler } from './UnidocDisjunctionValidationHandler'
import { UnidocEndValidationHandler } from './UnidocEndValidationHandler'
import { UnidocEventValidationHandler } from './UnidocEventValidationHandler'
import { UnidocLenientSequenceValidationHandler } from './UnidocLenientSequenceValidationHandler'
import { UnidocManyValidationHandler } from './UnidocManyValidationHandler'
import { UnidocSequenceValidationHandler } from './UnidocSequenceValidationHandler'
import { UnidocSetValidationHandler } from './UnidocSetValidationHandler'
import { UnidocTagValidationHandler } from './UnidocTagValidationHandler'

export namespace UnidocBlueprintValidationHandlers {
  export const HANDLERS: Pack<UnidocBlueprintValidationHandler | null> = Pack.any(UnidocBlueprintType.ALL.length)

  HANDLERS.set(UnidocBlueprintType.DISJUNCTION, UnidocDisjunctionValidationHandler.INSTANCE)
  HANDLERS.set(UnidocBlueprintType.END, UnidocEndValidationHandler.INSTANCE)
  HANDLERS.set(UnidocBlueprintType.EVENT, UnidocEventValidationHandler.INSTANCE)
  HANDLERS.set(UnidocBlueprintType.LENIENT_SEQUENCE, UnidocLenientSequenceValidationHandler.INSTANCE)
  HANDLERS.set(UnidocBlueprintType.MANY, UnidocManyValidationHandler.INSTANCE)
  HANDLERS.set(UnidocBlueprintType.SEQUENCE, UnidocSequenceValidationHandler.INSTANCE)
  HANDLERS.set(UnidocBlueprintType.SET, UnidocSetValidationHandler.INSTANCE)
  HANDLERS.set(UnidocBlueprintType.TAG, UnidocTagValidationHandler.INSTANCE)

  /**
  *
  */
  export function get(blueprint: UnidocBlueprint): UnidocBlueprintValidationHandler {
    const result: UnidocBlueprintValidationHandler | null = HANDLERS.get(blueprint.type)

    if (result == null) {
      throw new Error(
        'Unable to get a validation handler for a blueprint of type #' +
        blueprint.type + ' (' + UnidocBlueprintType.toString(blueprint.type) +
        ') because no handler was registered for that.'
      )
    } else {
      return result
    }
  }
}
