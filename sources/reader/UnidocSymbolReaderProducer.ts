import { BasicUnidocProducer } from '../producer/BasicUnidocProducer'
import { UnidocSymbol } from '../symbol/UnidocSymbol'

import { UnidocSymbolReader } from './UnidocSymbolReader'

export class UnidocSymbolReaderProducer extends BasicUnidocProducer<UnidocSymbol> {
  private readonly _reader : UnidocSymbolReader

  public constructor (reader : UnidocSymbolReader) {
    super()
    this._reader = reader
  }

  public read () : void {
    while (this._reader.hasNext()) {
      this.produce(this._reader.next())
    }

    this.complete()
  }
}
