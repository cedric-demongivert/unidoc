import { UnidocEvent } from '../../../event/UnidocEvent'
import { UnidocBlueprint } from '../../../blueprint/UnidocBlueprint'
import { UnidocPredicate } from '../../../predicate/UnidocPredicate'

import { UnidocKissValidator } from '../UnidocKissValidator'
import { UnidocKissValidatorOutput } from '../UnidocKissValidatorOutput'

/**
*
*/
export function* validateEndOfAnyTag(): UnidocKissValidator {
  const current: UnidocEvent | undefined = yield UnidocKissValidatorOutput.CURRENT

  yield UnidocKissValidator.output.validation(current)

  if (current && current.isEndOfAnyTag()) {
    yield UnidocKissValidator.output.next()
    return UnidocKissValidator.output.match()
  } else {
    yield UnidocKissValidator.output.message.expectedContent(
      UnidocBlueprint.event(UnidocPredicate.isTagEnd())
    )
    return UnidocKissValidator.output.end()
  }
}
