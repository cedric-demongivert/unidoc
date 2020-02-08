import { Tag } from './Tag'
import { Set } from './Set'

export type Standard = Tag

export namespace Standard {
  export const DOCUMENT : Standard = 0
  export const PARAGRAPH : Standard = 1
  export const EMPHASIZE : Standard = 2
  export const TITLE : Standard = 3

  export const ALL : Standard[] = [
    DOCUMENT,
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
  export function toString (tag : Standard) : string {
    switch (tag) {
      case DOCUMENT: return 'DOCUMENT'
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
      case PARAGRAPH:
      case EMPHASIZE:
      case TITLE:
        return true
      default:
        return false
    }
  }
}
