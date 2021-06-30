import { UnidocSymbol } from '../symbol/UnidocSymbol'

import { UnidocLocation } from '../location/UnidocLocation'

import { UnidocGenerator } from '../stream/UnidocGenerator'

import { UnidocObject } from '../UnidocObject'

import { UnidocSymbolGenerator } from './UnidocSymbolGenerator'

/**
 * 
 */
export class UnidocNullSymbolGenerator extends UnidocGenerator(UnidocSymbol, UnidocObject) implements UnidocSymbolGenerator {
  /**
   * @see UnidocSymbolGenerator.running
   */
  public get location(): Readonly<UnidocLocation> {
    return UnidocLocation.ZERO
  }
}

/**
 * 
 */
export namespace UnidocNullSymbolGenerator {
  /**
   * 
   */
  export const INSTANCE: UnidocNullSymbolGenerator = new UnidocNullSymbolGenerator()

  /**
   * 
   */
  export function create(): UnidocNullSymbolGenerator {
    return INSTANCE
  }
}
