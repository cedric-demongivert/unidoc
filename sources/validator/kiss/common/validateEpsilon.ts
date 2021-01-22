import { UnidocKissValidator } from '../UnidocKissValidator'

/**
*
*/
export function* validateEpsilon(): UnidocKissValidator {
  return UnidocKissValidator.output.match()
}
