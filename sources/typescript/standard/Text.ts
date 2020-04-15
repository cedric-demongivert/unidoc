import { UnidocValidator } from '../validator/UnidocValidator'

export namespace Text {
  export const VALIDATOR : UnidocValidator = UnidocValidator.types({
    allowWords: true,
    allowWhitespaces: true
  })
}
