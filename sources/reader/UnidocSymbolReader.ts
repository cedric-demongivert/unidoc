import { UnidocSymbol } from '../symbol/UnidocSymbol'
import { UnidocLocation } from '../location/UnidocLocation'

import { UnidocStringReader } from './UnidocStringReader'
import { UnidocFileReader } from './UnidocFileReader'
import { UnidocSymbolReaderProducer } from './UnidocSymbolReaderProducer'

export interface UnidocSymbolReader {
  /**
  * @return True if this reader can exctract more symbols from it's underlying source.
  */
  hasNext(): boolean

  /**
  * @return The next readable symbol from this reader's underlying source.
  */
  next(): UnidocSymbol

  /**
  * @return The current readable symbol from this reader's underlying source.
  */
  current(): UnidocSymbol

  /**
  * Skip a number of symbols.
  *
  * @param count - A number of symbol to skip.
  *
  * @return This reader instance for chaining purposes.
  */
  skip(count: number): UnidocSymbolReader

  /**
  * @return The location of this reader in it's underlying source.
  */
  location(): UnidocLocation

  /**
  * @see Symbol.iterator
  */
  [Symbol.iterator](): Iterator<UnidocSymbol>
}

export namespace UnidocSymbolReader {
  export function fromString(source: string): UnidocSymbolReader {
    return new UnidocStringReader(source)
  }

  export function fromFile(source: string): UnidocSymbolReader {
    return new UnidocFileReader(source)
  }

  export function produceString(source: string): UnidocSymbolReaderProducer {
    return new UnidocSymbolReaderProducer(new UnidocStringReader(source))
  }

  export function asProducer(source: UnidocSymbolReader): UnidocSymbolReaderProducer {
    return new UnidocSymbolReaderProducer(source)
  }
}
