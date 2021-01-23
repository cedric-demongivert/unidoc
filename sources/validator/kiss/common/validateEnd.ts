import { UnidocEvent } from '../../../event/UnidocEvent'
import { UnidocBlueprint } from '../../../blueprint/UnidocBlueprint'

import { UnidocKissValidator } from '../UnidocKissValidator'

/**
*
*/
export function* validateEnd(): UnidocKissValidator {
  const current: UnidocEvent | undefined = yield UnidocKissValidator.output.current()

  yield UnidocKissValidator.output.validation(current)

  if (current) {
    yield UnidocKissValidator.output.message.expectedContent(UnidocBlueprint.end())
    return UnidocKissValidator.output.end()
  } else {
    return UnidocKissValidator.output.match()
  }
}
