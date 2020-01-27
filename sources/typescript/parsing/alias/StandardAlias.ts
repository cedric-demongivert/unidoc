import { Aliases } from './Aliases'
import { Element } from '../element/Element'
import * as StandardElement from '../element/StandardElement'

export function get () : Aliases<Element> {
  const result : Aliases = new Aliases<Element>(256)

  result.declare('paragraph', StandardElement.PARAGRAPH)
  result.declare('title', StandardElement.TITLE)
  result.declare('emphazise', StandardElement.EMPHASIZE)

  return result
}
