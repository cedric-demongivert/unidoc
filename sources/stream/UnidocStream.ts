import { Pack } from '@cedric-demongivert/gl-tool-collection'

import { UnidocSymbol } from '../symbol/UnidocSymbol'

import { UnidocSymbolReader } from '../reader/UnidocSymbolReader'

export class UnidocStream {
  private readonly readers : Pack<UnidocSymbolReader>
  private readonly symbol : UnidocSymbol

  public constructor (reader : UnidocSymbolReader) {
    this.readers = Pack.any(16)
    this.symbol = new UnidocSymbol()

    this.readers.push(reader)

    while (this.readers.size > 0 && !this.readers.last.hasNext()) {
      this.readers.pop()
    }
  }

  public import (reader : UnidocSymbolReader) : void {
    this.readers.push(reader)
  }

  public hasNext () : boolean {
    return this.readers.size > 0
  }

  public next () : UnidocSymbol {
    const next : UnidocSymbol = this.readers.last.next()

    this.symbol.symbol = next.symbol

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
