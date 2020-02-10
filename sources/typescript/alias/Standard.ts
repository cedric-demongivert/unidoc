import { Mapping } from './Mapping'

import { Tag } from '@library/tag'

export namespace Standard {
  export const PARAGRAPH : string = 'paragraph'
  export const TITLE : string = 'title'
  export const EMPHASIZE : string = 'emphasize'

  export const ALL : string[] = [
    PARAGRAPH,
    TITLE,
    EMPHASIZE
  ]

  /**
  * @return A mapping of standard aliases to standard tags.
  */
  export function get (
    result : Mapping<Tag.Standard> = new Mapping<Tag.Standard>(256)
  ) : Mapping<Tag.Standard> {
    result.declare('paragraph', Tag.Standard.PARAGRAPH)
    result.declare('title', Tag.Standard.TITLE)
    result.declare('emphasize', Tag.Standard.EMPHASIZE)

    return result
  }
}
