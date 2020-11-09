export type UnidocBlueprintType = number

export namespace UnidocBlueprintType {
  /**
  * A blueprint that describe the opening of a tag.
  */
  export const TAG_START: UnidocBlueprintType = 0

  /**
  * A blueprint that describe the termination of a tag.
  */
  export const TAG_END: UnidocBlueprintType = 1

  /**
  * A blueprint that describe any kind of word.
  */
  export const WORD: UnidocBlueprintType = 2

  /**
  * A blueprint that describe any kind of whitespace.
  */
  export const WHITESPACE: UnidocBlueprintType = 3

  /**
  * A blueprint that describe any kind of content.
  */
  export const ANY: UnidocBlueprintType = 4

  /**
  * A blueprint that describe a content that may be repeated.
  */
  export const MANY: UnidocBlueprintType = 5

  /**
  * A blueprint that describe the termination of the document, or a termination
  * of the current blueprint fragment.
  */
  export const END: UnidocBlueprintType = 9

  /**
  * Default blueprint type
  */
  export const DEFAULT: UnidocBlueprintType = TAG_START

  /**
  * All existing blueprint types.
  */
  export const ALL: UnidocBlueprintType[] = [
    TAG_START,
    TAG_END,
    WORD,
    WHITESPACE,
    ANY,
    MANY,
    END
  ]

  export function toString(value: UnidocBlueprintType): string | undefined {
    switch (value) {
      case TAG_START: return 'TAG_START'
      case TAG_END: return 'TAG_END'
      case WORD: return 'WORD'
      case WHITESPACE: return 'WHITESPACE'
      case ANY: return 'ANY'
      case MANY: return 'MANY'
      case END: return 'END'
      default: return undefined
    }
  }
}
