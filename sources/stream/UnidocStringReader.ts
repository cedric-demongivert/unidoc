import { UnidocLocation } from '../UnidocLocation'

import { UnidocSymbol } from './UnidocSymbol'
import { UnidocSourceReader } from './UnidocSourceReader'
import { UnidocLocationTracker } from './UnidocLocationTracker'

export class UnidocStringReader  implements UnidocSourceReader {
  /**
   * The content to read.
   */
  public readonly source : string

  /**
   * Name of this source.
   */
  public readonly name : string

  /**
   * A symbol instance for symbol emission.
   */
  private readonly _symbol : UnidocSymbol

  /**
   * Location into this reader's source.
   */
  private readonly _location : UnidocLocationTracker

  public constructor (source : string, name : string = 'string') {
    this.source = source
    this.name = name
    this._location = new UnidocLocationTracker()
    this._symbol = new UnidocSymbol()
    this._symbol.origin.clear()
  }

  /**
  * @see UnidocSourceReader.hasNext
  */
  public hasNext() : boolean {
    return this._location.location.index < this.source.length
  }

  /**
  * @see UnidocSourceReader.skip
  */
  public skip (count : number) : UnidocStringReader {
    while (this.hasNext() && count > 0) {
      this.next()
      count -= 1
    }

    return this
  }

  /**
  * @see UnidocSourceReader.current
  */
  public current () : UnidocSymbol {
    if (this._location.location.index === 0) {
      throw new Error('No current symbol.')
    }

    return this._symbol
  }

  /**
  * @see UnidocSourceReader.next
  */
  public next() : UnidocSymbol {
    const nextCodePoint : number | undefined = (
      this.source.codePointAt(this._location.location.index)
    )

    if (nextCodePoint == null) {
      throw new Error (
        'Unable to read the next available code point at ' +
        this._location.toString() + ' from the underlying source : "' +
        this.source + '" in memory.'
      )
    } else {
      this._symbol.symbol = nextCodePoint
      this._symbol.origin.clear()
      this._symbol.origin.from.runtime().text(this._location.location)

      this._location.next(nextCodePoint)

      this._symbol.origin.to.runtime().text(this._location.location)

      return this._symbol
    }
  }

  /**
  * @see UnidocSourceReader.location
  */
  public location () : UnidocLocation {
    return this._location.location
  }

  public * [Symbol.iterator] () : Iterator<UnidocSymbol> {
    while (this.hasNext()) {
      yield this.next()
    }
  }
}
