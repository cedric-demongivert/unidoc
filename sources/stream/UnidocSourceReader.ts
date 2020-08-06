import { UnidocLocation } from '../UnidocLocation'

import { UnidocSymbol } from './UnidocSymbol'
import { UnidocStringReader } from './UnidocStringReader'
import { UnidocFileReader } from './UnidocFileReader'

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

export namespace UnidocSourceReader {
  export function fromString (source : string, name : string = 'string') : UnidocSourceReader {
    return new UnidocStringReader(source, name)
  }

  export function fromFile (source : string) : UnidocSourceReader {
    return new UnidocFileReader(source)
  }
}
