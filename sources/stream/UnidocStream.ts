import { Pack } from '@cedric-demongivert/gl-tool-collection'

import { UnidocSourceReader } from './UnidocSourceReader'
import { UnidocSymbol } from './UnidocSymbol'
import { UnidocLocationTracker } from './UnidocLocationTracker'

export class UnidocStream {
  private readonly readers : Pack<UnidocSourceReader>
  private readonly tracker : UnidocLocationTracker
  private readonly symbol : UnidocSymbol

  public constructor (reader : UnidocSourceReader) {
    this.readers = Pack.any(16)
    this.tracker = new UnidocLocationTracker()
    this.symbol = new UnidocSymbol()

    this.readers.push(reader)

    while (this.readers.size > 0 && !this.readers.last.hasNext()) {
      this.readers.pop()
    }
  }

  public import (reader : UnidocSourceReader) : void {
    this.readers.push(reader)
  }

  public hasNext () : boolean {
    return this.readers.size > 0
  }

  public next () : UnidocSymbol {
    const next : UnidocSymbol = this.readers.last.next()

    this.symbol.symbol = next.symbol
    this.symbol.location.clear()
    this.symbol.location.pushStream(this.tracker.location)

    this.tracker.next(next.symbol)

    this.symbol.location.last.to.copy(this.tracker.location)
    this.symbol.location.concat(next.location)

    while (this.readers.size > 0 && !this.readers.last.hasNext()) {
      this.readers.pop()
    }

    return this.symbol
  }

  public * [Symbol.iterator] () : Iterator<UnidocSymbol> {
    while (this.hasNext()) {
      yield this.next()
    }
  }
}
