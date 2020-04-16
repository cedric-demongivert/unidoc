import { TagValidator } from '../validator/TagValidator'
import { TagMetadata } from '../validator/TagMetadata'
import { UnidocAssertion } from '../assertion/UnidocAssertion'

import { Paragraph } from './Paragraph'
import { Title } from './Title'

export namespace Document {
  export const TAG : string = 'document'

  export const VALIDATOR : TagValidator = new TagValidator()

  const document : TagMetadata = VALIDATOR.metadata

  document.mayHaveOne(Title.TAG)
  document.mayHaveMany(Paragraph.TAG)

  document.validateAllTag(Title.TAG).with(Title.VALIDATOR)
  document.validateAllTag(Paragraph.TAG).with(Paragraph.VALIDATOR)

  document.doesNotAllowWords()
  document.doesAllowWhitespaces()

  /*document.ifTagIsNotFirst(Title.TAG).then(StandardWarningFactory.buildPreferTitleFirstWarning)*/
}
