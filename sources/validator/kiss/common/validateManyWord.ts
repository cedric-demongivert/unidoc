import { UnidocEvent } from '../../../event/UnidocEvent'
import { UnidocBlueprint } from '../../../blueprint/UnidocBlueprint'

import { UnidocKissValidator } from '../UnidocKissValidator'

/**
*
*/
export function* validateManyWord(minimum: number = 0, maximum: number = Number.POSITIVE_INFINITY): UnidocKissValidator {
  let current: UnidocEvent | undefined = yield UnidocKissValidator.output.current()
  let count: number = 0

  while (current && current.isWord()) {
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
      UnidocBlueprint.many(UnidocBlueprint.word()).atLeast(minimum - count)
    )
    return UnidocKissValidator.output.end()
  } else {
    return UnidocKissValidator.output.match()
  }
}
