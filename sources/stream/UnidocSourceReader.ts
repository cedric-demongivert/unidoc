import { UnidocLocation } from '../UnidocLocation'

import { UnidocSymbol } from './UnidocSymbol'

export interface UnidocSourceReader {
  /**
  * @return True if this reader can exctract more symbols from it's underlying source.
  */
  hasNext () : boolean

  /**
  * @return The next readable symbol from this reader's underlying source.
  */
  next () : UnidocSymbol

  /**
  * @return The location of this reader in it's underlying source.
  */
  location () : UnidocLocation
}
