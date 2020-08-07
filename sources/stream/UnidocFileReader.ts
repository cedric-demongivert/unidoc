import { ReadStream } from 'fs'
import { createReadStream } from 'fs'

import { UnidocLocation } from '../UnidocLocation'

import { UnidocSymbol } from './UnidocSymbol'
import { UnidocSourceReader } from './UnidocSourceReader'
import { UnidocLocationTracker } from './UnidocLocationTracker'

export class UnidocFileReader  implements UnidocSourceReader {
  /**
   * The content to read.
   */
  public readonly source : string

  /**
   * The underlying stream.
   */
  public readonly stream : ReadStream

  /**
   * A symbol instance for symbol emission.
   */
  private readonly _symbol : UnidocSymbol

  /**
   * Location into this reader's source.
   */
  private readonly _location : UnidocLocationTracker

  public constructor (source : string) {
    this.source = source
    this.stream = createReadStream(source, {
      flags: 'r',
      encoding: 'utf32',
      autoClose: true,
      emitClose: false,
      mode: 0o666,
      start: 0,
      end: Number.POSITIVE_INFINITY,
      highWaterMark: 64 * 1024
    })

    this._location = new UnidocLocationTracker()
    this._symbol = new UnidocSymbol()
    this._symbol.location.pushFile(source, UnidocLocation.ZERO)
  }

  /**
  * @see UnidocSourceReader.hasNext
  */
  public hasNext() : boolean {
    return this.stream.readable
  }

  /**
  * @see UnidocSourceReader.skip
  */
  public skip (count : number) : UnidocFileReader {
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
    const nextCodePoint : number | undefined = this.stream.read(1)

    if (nextCodePoint == null) {
      throw new Error (
        'Unable to read the next available code point at ' +
        this._location.toString() + ' from the underlying source : "' +
        this.source + '" in memory.'
      )
    } else {
      this._symbol.symbol = nextCodePoint
      this._symbol.location.first.asFile(this.source, this._location.location)

      this._location.next(nextCodePoint)

      this._symbol.location.first.to.copy(this._location.location)

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
