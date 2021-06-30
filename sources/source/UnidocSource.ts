import { UnidocOrigin } from '../origin/UnidocOrigin'

import { UnidocProducer } from '../stream/UnidocProducer'

import { UnidocSymbol } from '../symbol/UnidocSymbol'

import { UnidocGeneratorSource } from './UnidocGeneratorSource'
import { UnidocSourceState } from './UnidocSourceState'
import { UnidocSymbolGenerator } from './UnidocSymbolGenerator'

/**
 * 
 */
export interface UnidocSource extends UnidocProducer<UnidocSymbol> {
  /**
   * 
   */
  readonly state: UnidocSourceState

  /**
   *  
   */
  read(): void
}

/**
 * 
 */
export namespace UnidocSource {
  /**
   * 
   */
  export function fromNothing(): UnidocSource {
    return UnidocGeneratorSource.create(UnidocSymbolGenerator.fromNothing())
  }

  /**
   * 
   */
  export function fromString(source: string, origin: UnidocOrigin = UnidocOrigin.runtime()): UnidocSource {
    return UnidocGeneratorSource.create(UnidocSymbolGenerator.fromString(source, origin))
  }
}
