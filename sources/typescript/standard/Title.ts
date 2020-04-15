import { UnidocValidator } from '../validator/UnidocValidator'

export namespace Title {
  export const TAG : string = 'title'

  export const VALIDATOR : UnidocValidator = UnidocValidator.any()
}
