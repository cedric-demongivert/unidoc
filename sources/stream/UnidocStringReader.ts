import { CodePoint } from '../CodePoint'
import { UnidocLocation } from '../UnidocLocation'

import { UnidocSymbol } from './UnidocSymbol'
import { UnidocSourceReader } from './UnidocSourceReader'
import { UnidocSourceReaderState } from './UnidocSourceReaderState'

export class UnidocStringReader  implements UnidocSourceReader {
  /**
   * The content to read.
   */
  public readonly source : string

  /**
   * A symbol instance for symbol emission.
   */
  private readonly _symbol : UnidocSymbol

  /**
   * Location into this reader's source.
   */
  private readonly _location : UnidocLocation

  /**
   * Current location into the content to read.
   */
  private _state : UnidocSourceReaderState

  public constructor (source : string) {
    this.source = source
    this._location = new UnidocLocation()
    this._symbol = new UnidocSymbol()
    this._symbol.location.pushMemory(this._location)
    this._state = UnidocSourceReaderState.DEFAULT
  }

  /**
  * @see UnidocSourceReader.hasNext
  */
  public hasNext() : boolean {
    return this._location.index < this.source.length
  }

  /**
  * @see UnidocSourceReader.next
  */
  public next() : UnidocSymbol {
    const nextCodePoint : number | undefined = (
      this.source.codePointAt(this._location.index)
    )

    if (nextCodePoint == null) {
      throw new Error (
        'Unable to read the next available code point at ' +
        this._location.toString() + ' from the underlying source : "' +
        this.source + '" in memory.'
      )
    } else {
      this._symbol.symbol = nextCodePoint
      this._symbol.location.first.asMemory(this._location)

      this.computeNextLocation(nextCodePoint)

      return this._symbol
    }
  }

  /**
  * Resolve the location of the next symbol into this stream of symbol.
  *
  * @param symbol - The next symbol.
  */
  private computeNextLocation (symbol : CodePoint) : void {
    switch (symbol) {
      case CodePoint.CARRIAGE_RETURN:
        this._location.add(1, 0, 1)
        this._location.column = 0
        this._state = UnidocSourceReaderState.RETURN
        break
      case CodePoint.NEW_LINE:
        if (this._state === UnidocSourceReaderState.RETURN) {
          this._location.add(0, 0, 1)
          this._state = UnidocSourceReaderState.SYMBOL
        } else {
          this._location.add(1, 0, 1)
        }
        this._location.column = 0
        break
      default:
        this._location.add(0, 1, 1)
        this._state = UnidocSourceReaderState.SYMBOL
        break
    }
  }

  /**
  * @see UnidocSourceReader.location
  */
  public location () : UnidocLocation {
    return this._location
  }
}
