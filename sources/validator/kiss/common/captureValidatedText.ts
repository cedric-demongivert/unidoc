import { UnidocEvent } from '../../../event/UnidocEvent'

import { UnidocKissValidator } from '../UnidocKissValidator'
import { UnidocKissValidatorOutput } from '../UnidocKissValidatorOutput'

/**
*
*/
export function* captureValidatedText(validator: UnidocKissValidator): Generator<UnidocKissValidatorOutput, string | undefined, UnidocEvent | undefined> {
  let text: string = ''
  let whitespace: boolean = false

  for (const output of UnidocKissValidator.match(validator)) {
    if (output.isEmit() && output.event.isValidation()) {
      if (output.event.event.isWord()) {
        if (whitespace && text.length > 0) {
          text += ' '
          whitespace = false
        }

        text += output.event.event.text
      } else if (output.event.event.isWhitespace()) {
        whitespace = true
      }

      yield output
    } else {
      if (output.isEnd()) {
        return undefined
      } else if (output.isMatch()) {
        return text
      } else {
        yield output
      }
    }
  }

  return text
}
