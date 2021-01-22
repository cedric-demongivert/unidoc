import { UnidocEvent } from '../../../event/UnidocEvent'
import { UnidocBlueprint } from '../../../blueprint/UnidocBlueprint'

import { UnexpectedContent } from '../../message/UnexpectedContent'

import { UnidocKissValidator } from '../UnidocKissValidator'

/**
*
*/
export function* validateEnd(): UnidocKissValidator {
  const current: UnidocEvent | undefined = yield UnidocKissValidator.output.current()

  yield UnidocKissValidator.output.validation(current)

  if (current) {
    yield UnidocKissValidator.output.message(
      UnidocKissValidator.output.message.builder()
        .setType(UnexpectedContent.TYPE)
        .setCode(UnexpectedContent.CODE)
        .setData(UnexpectedContent.Data.BLUEPRINT, UnidocBlueprint.end())
        .get()
    )

    return UnidocKissValidator.output.end()
  } else {
    return UnidocKissValidator.output.match()
  }
}
