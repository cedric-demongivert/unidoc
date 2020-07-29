import { Tag } from './Tag'
import { Set } from './Set'

export type Standard = Tag

export namespace Standard {
  export const DOCUMENT : Standard = 0
  export const SECTION : Standard = 1
  export const PARAGRAPH : Standard = 2
  export const EMPHASIZE : Standard = 3
  export const TITLE : Standard = 4

  export const ALL : Standard[] = [
    DOCUMENT,
    SECTION,
    PARAGRAPH,
    EMPHASIZE,
    TITLE
  ]

  /**
  * @return A set of Unidoc elements with all standard unidoc elements.
  */
  export function set () : Set {
    return Set.fromArray(ALL)
  }

  /**
  * Return a string representation of a standard unidoc tag.
  *
  * @param tag - A standard Unidoc tag to convert into a string.
  *
  * @return A string representation of the given tag or undefined if the
  *         given tag is not a standard Unidoc tag.
  */
  export function toString (tag : Standard) : string | undefined {
    switch (tag) {
      case DOCUMENT: return 'DOCUMENT'
      case SECTION: return 'SECTION'
      case PARAGRAPH: return 'PARAGRAPH'
      case EMPHASIZE: return 'EMPHASIZE'
      case TITLE: return 'TITLE'
      default: return undefined
    }
  }

  /**
  * Return true if the given tag is a standard Unidoc tag.
  *
  * @param tag - A Unidoc tag to check.
  *
  * @return True if the given tag is a standard Unidoc tag.
  */
  export function isStandardUnidocElement (tag : Tag) : boolean {
    switch (tag) {
      case DOCUMENT:
      case SECTION:
      case PARAGRAPH:
      case EMPHASIZE:
      case TITLE:
        return true
      default:
        return false
    }
  }
}
