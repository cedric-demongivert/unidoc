import { Element } from './Element'
import { Elements } from './Elements'

export const ROOT : Element = 0
export const PARAGRAPH : Element = 1
export const EMPHASIZE : Element = 2
export const TITLE : Element = 3

export const ALL : Element[] = [
  ROOT,
  PARAGRAPH,
  EMPHASIZE,
  TITLE
]

/**
* @return A set of Unidoc elements with all standard unidoc elements.
*/
export function set () : Elements {
  const result : Elements = new Elements(ALL.length)

  for (const element of ALL) {
    result.declare(element)
  }

  return result
}

/**
* Return a string representation of a unidoc element.
*
* @param element - A Unidoc element to convert into a string.
*
* @return A string representation of the given element or undefined if the
*         given element is not a standard Unidoc element.
*/
export function toString (element : Element) : string {
  switch (element) {
    case ROOT: return 'ROOT'
    case PARAGRAPH: return 'PARAGRAPH'
    case EMPHASIZE: return 'EMPHASIZE'
    case TITLE: return 'TITLE'
    default: return undefined
  }
}

/**
* Return true if the given element is a standard Unidoc element.
*
* @param element - A Unidoc element to check.
*
* @return True if the given element is a standard Unidoc element.
*/
export function isStandardUnidocElement (element : Element) : boolean {
  switch (element) {
    case ROOT:
    case PARAGRAPH:
    case EMPHASIZE:
    case TITLE:
      return true
    default:
      return false
  }
}
