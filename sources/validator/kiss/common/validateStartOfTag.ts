import { UnidocEvent } from '../../../event/UnidocEvent'
import { UnidocBlueprint } from '../../../blueprint/UnidocBlueprint'

import { UnidocKissValidator } from '../UnidocKissValidator'

/**
*
*/
export function* validateStartOfTag(tag: string): UnidocKissValidator {
  const current: UnidocEvent | undefined = yield UnidocKissValidator.output.current()

  yield UnidocKissValidator.output.validation(current)

  if (current && current.isStartOfTag(tag)) {
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
export namespace validateStartOfTag {
  /**
  *
  */
  export function factory(name: string): UnidocKissValidator.Factory {
    return validateStartOfTag.bind(undefined, name)
  }
}
