import { UnidocEvent } from '../../../event/UnidocEvent'
import { UnidocBlueprint } from '../../../blueprint/UnidocBlueprint'

import { UnidocKissValidator } from '../UnidocKissValidator'

/**
*
*/
export function* validateManyWhitespace(minimum: number = 0, maximum: number = Number.POSITIVE_INFINITY): UnidocKissValidator {
  let current: UnidocEvent | undefined = yield UnidocKissValidator.output.current()
  let count: number = 0

  while (current && current.isWhitespace()) {
    if (count < maximum) {
      yield UnidocKissValidator.output.validation(current)

      count += 1
      current = yield UnidocKissValidator.output.next()
    } else {
      return UnidocKissValidator.output.match()
    }
  }

  if (count < minimum) {
    yield UnidocKissValidator.output.message.expectedContent(
      UnidocBlueprint.many(UnidocBlueprint.whitespace()).atLeast(minimum - count)
    )
    return UnidocKissValidator.output.end()
  } else {
    return UnidocKissValidator.output.match()
  }
}
