import { UnidocEvent } from '../../../event/UnidocEvent'
import { UnidocBlueprint } from '../../../blueprint/UnidocBlueprint'

import { UnidocKissValidator } from '../UnidocKissValidator'
/**
*
*/
export function* validateWord(): UnidocKissValidator {
  const current: UnidocEvent | undefined = yield UnidocKissValidator.output.current()

  yield UnidocKissValidator.output.validation(current)

  if (current && current.isWord()) {
    yield UnidocKissValidator.output.next()
    return UnidocKissValidator.output.match()
  } else {
    yield UnidocKissValidator.output.message.expectedContent(
      UnidocBlueprint.word()
    )
    return UnidocKissValidator.output.end()
  }
}
