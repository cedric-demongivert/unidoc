import { UnidocEvent } from '../../../event/UnidocEvent'
import { UnidocBlueprint } from '../../../blueprint/UnidocBlueprint'

import { UnidocKissValidator } from '../UnidocKissValidator'

import { validateContentThatMatch } from './validateContentThatMatch'

/**
*
*/
export function* requireText(): UnidocKissValidator {
  let current: UnidocEvent | undefined = yield UnidocKissValidator.output.current()

  while (current && current.isWhitespace()) {
    yield UnidocKissValidator.output.validation(current)
    current = yield UnidocKissValidator.output.next()
  }

  if (current == null || !current.isWord()) {
    yield UnidocKissValidator.output.validation(current)
    yield UnidocKissValidator.output.message.expectedContent(UnidocBlueprint.word())
    return UnidocKissValidator.output.end()
  }

  while (current && (current.isWhitespace() || current.isWord())) {
    yield UnidocKissValidator.output.validation(current)
    current = yield UnidocKissValidator.output.next()
  }

  return UnidocKissValidator.output.match()
}

/**
 * 
 */
export namespace requireText {
  /**
   * 
   */
  export function thatMatch(regexp: RegExp): UnidocKissValidator {
    return validateContentThatMatch(requireText(), regexp)
  }
}