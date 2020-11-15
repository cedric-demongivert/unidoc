import { UnidocSymbol } from '../symbol/UnidocSymbol'

import { UnidocLocation } from '../location/UnidocLocation'

import { UnidocSymbolReader } from './UnidocSymbolReader'

export class UnidocNullReader implements UnidocSymbolReader {
  private readonly _location: UnidocLocation

  public constructor() {
    this._location = new UnidocLocation(0, 0, 0)
  }

  /**
  * @see UnidocSymbolReader.hasNext
  */
  public hasNext(): boolean {
    return false
  }

  /**
  * @see UnidocSymbolReader.skip
  */
  public skip(count: number): UnidocNullReader {
    return this
  }

  /**
  * @see UnidocSymbolReader.current
  */
  public current(): UnidocSymbol {
    throw new Error('No current symbol.')
  }

  /**
  * @see UnidocSymbolReader.next
  */
  public next(): UnidocSymbol {
    throw new Error('There is no code point to read in a null reader.')
  }

  /**
  * @see UnidocSymbolReader.location
  */
  public location(): UnidocLocation {
    return this._location
  }

  /**
  * @see Symbol.iterator
  */
  public *[Symbol.iterator](): Iterator<UnidocSymbol> {

  }
}

export namespace UnidocNullReader {
  export const INSTANCE: UnidocNullReader = new UnidocNullReader()
}
