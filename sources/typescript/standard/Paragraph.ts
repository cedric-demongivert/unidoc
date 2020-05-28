import { UnidocValidator } from '../validator/UnidocValidator'
import { TreeValidator } from '../validator/TreeValidator'
import { Rule } from '../validator/Rule'

import { Title } from './Title'

export namespace Paragraph {
  export const TAG : Tag = new Tag('paragraph')

  TAG.allowWords()
  TAG.allowText()
  TAG.allowTag(Title.TAG)

  TAG.mayHave(1, Title.TAG)
  TAG.

  export const METADATA : TagMetadata = new TagMetadata(TAG)

  METADATA.allowWords()
  METADATA.allowText()


  export function validator () : UnidocValidator {
    const result : TreeValidator = UnidocValidator.tree()

    result.children.add(
      Rule.builder()
          .mayHave(1, Title.TAG)
          .otherwiseEmit()
          .withContext()
    )


  }

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
