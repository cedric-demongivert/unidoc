import { UnidocPath } from '../origin/UnidocPath'

import { UnidocProducer } from '../stream/UnidocProducer'

import { UnidocSymbol } from '../symbol/UnidocSymbol'

import { UnidocGeneratorSource } from './UnidocGeneratorSource'
import { UnidocSourceState } from './UnidocSourceState'
import { UnidocSymbolGenerator } from './UnidocSymbolGenerator'

/**
 * A process that is able to produce the symbols of a document to parse.
 */
export interface UnidocSource extends UnidocProducer<UnidocSymbol> {
  /**
   * The current state of this source of symbols.
   * 
   * @see UnidocSourceState
   */
  readonly state: UnidocSourceState

  /**
   * Start the production of symbols.
   */
  read(): void
}

/**
 * 
 */
export namespace UnidocSource {
  /**
   * Instantiate a new empy source of symbols.
   * 
   * @return A new empty source of symbols.
   */
  export function fromNothing(): UnidocSource {
    return UnidocGeneratorSource.create(UnidocSymbolGenerator.fromNothing())
  }

  /**
   * Transform a javascript string into a source of symbols.
   * 
   * @param source - The content to produce.
   * @param origin - The origin of the content to produce.
   */
  export function fromString(source: string, origin: UnidocPath = UnidocPath.create().inMemory('string')): UnidocSource {
    return UnidocGeneratorSource.create(UnidocSymbolGenerator.fromString(source, origin))
  }
}
