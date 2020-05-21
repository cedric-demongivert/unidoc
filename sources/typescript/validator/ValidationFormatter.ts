import { UnidocValidation } from '../validation/UnidocValidation'
import { UnidocEvent } from '../event/UnidocEvent'

export type ValidationFormatter<Context> = (event : UnidocEvent, validation : UnidocValidation, context : Context) => UnidocValidation

export namespace ValidationFormatter {
  export function empty <Context> () : ValidationFormatter<Context> {
    return function emptyFormatter (event : UnidocEvent, validation : UnidocValidation, context : Context) : UnidocValidation{
      validation.clear()
      validation.asInformation()
      validation.path.copy(event.path)
      validation.type = 0
      validation.data.set('context', context)

      return validation
    }
  }
}
