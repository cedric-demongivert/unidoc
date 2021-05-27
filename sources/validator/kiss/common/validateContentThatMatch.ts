import { UnidocEvent } from '../../../event/UnidocEvent'
import { UnidocBlueprint } from '../../../blueprint/UnidocBlueprint'

import { UnidocKissValidator } from '../UnidocKissValidator'

import { captureValidatedText } from './captureValidatedText'

/**
*
*/
export function* validateContentThatMatch(validator: UnidocKissValidator, regexp: RegExp): UnidocKissValidator {
  const content: string | undefined = yield* captureValidatedText(validator)

  if (content === undefined) {
    return UnidocKissValidator.output.end()
  } else if (regexp.test(content)) {
    return UnidocKissValidator.output.match()
  } else {
    yield UnidocKissValidator.output.message.expectedContent(
      UnidocBlueprint.regexp(regexp)
    )
    return UnidocKissValidator.output.end()
  }
}