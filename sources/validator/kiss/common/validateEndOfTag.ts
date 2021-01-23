import { UnidocEvent } from '../../../event/UnidocEvent'
import { UnidocBlueprint } from '../../../blueprint/UnidocBlueprint'

import { UnidocKissValidator } from '../UnidocKissValidator'

/**
*
*/
export function* validateEndOfTag(tag: string): UnidocKissValidator {
  const current: UnidocEvent | undefined = yield UnidocKissValidator.output.current()

  yield UnidocKissValidator.output.validation(current)

  if (current && current.isEndOfTag(tag)) {
    yield UnidocKissValidator.output.next()
    return UnidocKissValidator.output.match()
  } else {
    yield UnidocKissValidator.output.message.expectedContent(
      UnidocBlueprint.tagStart(tag)
    )
    return UnidocKissValidator.output.end()
  }
}

/**
*
*/
export namespace validateEndOfTag {
  /**
  *
  */
  export function factory(name: string): UnidocKissValidator.Factory {
    return validateEndOfTag.bind(undefined, name)
  }
}
