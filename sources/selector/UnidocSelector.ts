import { UnidocEvent } from '../event/UnidocEvent'

import { UnidocTagNameSelector } from './UnidocTagNameSelector'
import { UnidocContentSelector } from './UnidocContentSelector'

/**
*
*/
export interface UnidocSelector<Input, Output> {
  /**
  *
  */
  select(value: Input): Output

  /**
  * @see Object.equals
  */
  equals(other: any): boolean

  /**
  * @see Object.toString
  */
  toString(): string
}

export namespace UnidocSelector {
  /**
  *
  */
  export function tagName(): UnidocSelector<UnidocEvent, string> {
    return UnidocTagNameSelector.INSTANCE
  }

  /**
  *
  */
  export function content(): UnidocSelector<UnidocEvent, string> {
    return UnidocContentSelector.INSTANCE
  }
}
