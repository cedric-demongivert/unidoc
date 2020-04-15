import { UnidocValidator } from '../validator/UnidocValidator'

import { Paragraph } from './Paragraph'
import { Title } from './Title'

export namespace Document {
  export const TAG : string = 'document'

  export const VALIDATOR : UnidocValidator = UnidocValidator.all(
    UnidocValidator.composition({
      [Title.TAG]: [0, 1],
      [Paragraph.TAG]: [0, Number.POSITIVE_INFINITY]
    }),
    UnidocValidator.types({
      [Title.TAG]: Title.VALIDATOR,
      [Paragraph.TAG]: Paragraph.VALIDATOR,
      allowWords: false,
      allowWhitespaces: true
    })
  )
}
