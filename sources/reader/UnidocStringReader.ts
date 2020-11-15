import { UnidocSymbol } from '../symbol/UnidocSymbol'

import { UnidocOrigin } from '../origin/UnidocOrigin'
import { UnidocLocation } from '../location/UnidocLocation'
import { UnidocLocationTracker } from '../location/UnidocLocationTracker'

import { UnidocSymbolReader } from './UnidocSymbolReader'

export class UnidocStringReader implements UnidocSymbolReader {
  /**
   * The content to read.
   */
  public readonly source: string

  public readonly origin: UnidocOrigin

  /**
   * A symbol instance for symbol emission.
   */
  private readonly _symbol: UnidocSymbol

  /**
   * Location into this reader's source.
   */
  private readonly _location: UnidocLocationTracker

  public constructor(source: string, origin: UnidocOrigin = UnidocOrigin.runtime()) {
    this.source = source
    this.origin = new UnidocOrigin()
    this.origin.copy(origin)
    this._location = new UnidocLocationTracker()
    this._symbol = new UnidocSymbol()
  }

  /**
  * @see UnidocSymbolReader.hasNext
  */
  public hasNext(): boolean {
    return this._location.location.index < this.source.length
  }

  /**
  * @see UnidocSymbolReader.skip
  */
  public skip(count: number): UnidocStringReader {
    while (this.hasNext() && count > 0) {
      this.next()
      count -= 1
    }

    return this
  }

  /**
  * @see UnidocSymbolReader.current
  */
  public current(): UnidocSymbol {
    if (this._location.location.index === 0) {
      throw new Error('No current symbol.')
    }

    return this._symbol
  }

  /**
  * @see UnidocSymbolReader.next
  */
  public next(): UnidocSymbol {
    const nextCodePoint: number | undefined = (
      this.source.codePointAt(this._location.location.index)
    )

    if (nextCodePoint == null) {
      throw new Error(
        'Unable to read the next available code point at ' +
        this._location.toString() + ' from the underlying source : "' +
        this.source + '" in memory.'
      )
    } else {
      this._symbol.symbol = nextCodePoint
      this._symbol.origin.clear()
      this._symbol.origin.from.text(this._location.location).concat(this.origin)

      this._location.next(nextCodePoint)

      this._symbol.origin.to.text(this._location.location).concat(this.origin)

      return this._symbol
    }
  }

  /**
  * @see UnidocSymbolReader.location
  */
  public location(): UnidocLocation {
    return this._location.location
  }

  /**
  * @see Symbol.iterator
  */
  public *[Symbol.iterator](): Iterator<UnidocSymbol> {
    while (this.hasNext()) {
      yield this.next()
    }
  }
}
