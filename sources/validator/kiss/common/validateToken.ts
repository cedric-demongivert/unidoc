import { UnidocEvent } from '../../../event/UnidocEvent'

import { UnidocKissValidator } from '../UnidocKissValidator'
import { validateContentThatMatch } from './validateContentThatMatch'

/**
*
*/
export function* validateToken(): UnidocKissValidator {
  let current: UnidocEvent | undefined = yield UnidocKissValidator.output.current()

  while (current && current.isWhitespace()) {
    yield UnidocKissValidator.output.validation(current)
    current = yield UnidocKissValidator.output.next()
  }

  while (current && current.isWord()) {
    yield UnidocKissValidator.output.validation(current)
    current = yield UnidocKissValidator.output.next()
  }

  while (current && current.isWhitespace()) {
    yield UnidocKissValidator.output.validation(current)
    current = yield UnidocKissValidator.output.next()
  }

  return UnidocKissValidator.output.match()
}

/**
 * 
 */
export namespace validateToken {
  /**
   * 
   */
  export function thatMatch(regexp: RegExp): UnidocKissValidator {
    return validateContentThatMatch(validateToken(), regexp)
  }
}