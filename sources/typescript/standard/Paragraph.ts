import { UnidocValidator } from '../validator/UnidocValidator'

import { Title } from './Title'

export namespace Paragraph {
  export const TAG : string = 'paragraph'

  export const VALIDATOR : UnidocValidator = UnidocValidator.all(
    UnidocValidator.composition({
      [Title.TAG]: [0, 1]
    }),
    UnidocValidator.types({
      [Title.TAG]: Title.VALIDATOR,
      allowWords: true,
      allowWhitespaces: true
    })
  )
}
