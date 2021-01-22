import { UnidocKissValidator } from '../UnidocKissValidator'
import { UnidocKissValidatorOutput } from '../UnidocKissValidatorOutput'

/**
*
*/
export function* validateSequence(...validators: UnidocKissValidator[]): UnidocKissValidator {
  for (let index = 0, size = validators.length; index < size; ++index) {
    const result: UnidocKissValidatorOutput | undefined = yield* validators[index]

    if (result == null) {
      throw new Error('Illegal behavior, a KISS validator returned nothing at the end of it\'s execution.')
    } else if (result.isEnd()) {
      return result
    } else if (!result.isMatch()) {
      throw new Error('Illegal behavior, a KISS validator returned a result that was neither end nor match at the end of it\'s execution.')
    }
  }

  return UnidocKissValidator.output.match()
}
