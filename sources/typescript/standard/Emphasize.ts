import { UnidocValidator } from '../validator/UnidocValidator'

export namespace Emphasize {
  export const TAG : string = 'emphasize'

  export const VALIDATOR : UnidocValidator = UnidocValidator.any()
}
