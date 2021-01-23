import { UnidocEvent } from '../../../event/UnidocEvent'
import { UnidocBlueprint } from '../../../blueprint/UnidocBlueprint'
import { UnidocPredicate } from '../../../predicate/UnidocPredicate'

import { UnidocKissValidator } from '../UnidocKissValidator'

/**
*
*/
export function* validateStartOfAnyTag(): UnidocKissValidator {
  const current: UnidocEvent | undefined = yield UnidocKissValidator.output.current()

  yield UnidocKissValidator.output.validation(current)

  if (current && current.isStartOfAnyTag()) {
    yield UnidocKissValidator.output.next()
    return UnidocKissValidator.output.match()
  } else {
    yield UnidocKissValidator.output.message.expectedContent(
      UnidocBlueprint.event(UnidocPredicate.isTagStart())
    )
    return UnidocKissValidator.output.end()
  }
}
