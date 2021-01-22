import { UnidocEvent } from '../../../event/UnidocEvent'
import { UnidocBlueprint } from '../../../blueprint/UnidocBlueprint'
import { UnidocPredicate } from '../../../predicate/UnidocPredicate'

import { UnexpectedContent } from '../../message/UnexpectedContent'
import { RequiredContent } from '../../message/RequiredContent'

import { UnidocKissValidator } from '../UnidocKissValidator'

/**
*
*/
export function* validateStartOfAnyTag(): UnidocKissValidator {
  const current: UnidocEvent | undefined = yield UnidocKissValidator.output.current()

  yield UnidocKissValidator.output.validation(current)

  if (current) {
    if (current.isStartOfAnyTag()) {
      yield UnidocKissValidator.output.next()
      return UnidocKissValidator.output.match()
    } else {
      yield UnidocKissValidator.output.message(
        UnidocKissValidator.output.message.builder()
          .setType(UnexpectedContent.TYPE)
          .setCode(UnexpectedContent.CODE)
          .setData(UnexpectedContent.Data.BLUEPRINT, UnidocBlueprint.event(UnidocPredicate.isTagStart()))
          .get()
      )
      return UnidocKissValidator.output.end()
    }
  } else {
    yield UnidocKissValidator.output.message(
      UnidocKissValidator.output.message.builder()
        .setType(RequiredContent.TYPE)
        .setCode(RequiredContent.CODE)
        .setData(RequiredContent.Data.BLUEPRINT, UnidocBlueprint.event(UnidocPredicate.isTagStart()))
        .get()
    )
    return UnidocKissValidator.output.end()
  }
}
