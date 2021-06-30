import { UnidocSymbol } from '../symbol/UnidocSymbol'
import { UnidocLocation } from '../location/UnidocLocation'
import { UnidocOrigin } from '../origin/UnidocOrigin'

import { UnidocStringSymbolGenerator } from './UnidocStringSymbolGenerator'
import { UnidocNullSymbolGenerator } from './UnidocNullSymbolGenerator'
import { UnidocGenerator } from 'sources/stream'

export interface UnidocSymbolGenerator extends UnidocGenerator<UnidocSymbol> {
  /**
  * @return The current location of this generator.
  */
  readonly location: Readonly<UnidocLocation>
}

export namespace UnidocSymbolGenerator {
  /**
   * 
   */
  export function fromNothing(): UnidocSymbolGenerator {
    return UnidocNullSymbolGenerator.create()
  }

  /**
   * 
   */
  export function fromString(source: string, origin: UnidocOrigin = UnidocOrigin.runtime()): UnidocSymbolGenerator {
    return UnidocStringSymbolGenerator.create(source, origin)
  }
}
