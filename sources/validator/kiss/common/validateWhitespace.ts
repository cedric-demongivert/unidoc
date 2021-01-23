import { UnidocEvent } from '../../../event/UnidocEvent'
import { UnidocBlueprint } from '../../../blueprint/UnidocBlueprint'

import { UnidocKissValidator } from '../UnidocKissValidator'

/**
*
*/
export function* validateWhitespace(): UnidocKissValidator {
  const current: UnidocEvent | undefined = yield UnidocKissValidator.output.current()

  yield UnidocKissValidator.output.validation(current)

  if (current && current.isWhitespace()) {
    yield UnidocKissValidator.output.next()
    return UnidocKissValidator.output.match()
  } else {
    yield UnidocKissValidator.output.message.expectedContent(
      UnidocBlueprint.whitespace()
    )
    return UnidocKissValidator.output.end()
  }
}
