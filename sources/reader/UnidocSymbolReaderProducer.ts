import { ListenableUnidocProducer } from '../producer/ListenableUnidocProducer'
import { UnidocSymbol } from '../symbol/UnidocSymbol'

import { UnidocSymbolReader } from './UnidocSymbolReader'

export class UnidocSymbolReaderProducer extends ListenableUnidocProducer<UnidocSymbol> {
  private readonly _reader: UnidocSymbolReader

  public constructor(reader: UnidocSymbolReader) {
    super()
    this._reader = reader
  }

  public read(from?: number): void {
    if (from == null) {
      while (this._reader.hasNext()) {
        this.produce(this._reader.next())
      }

      this.complete()
    } else {
      while (this._reader.hasNext() && from > 0) {
        this.produce(this._reader.next())
        from -= 1
      }

      if (!this._reader.hasNext()) {
        this.complete()
      }
    }
  }

  public readWithoutCompletion(from?: number): void {
    if (from == null) {
      while (this._reader.hasNext()) {
        this.produce(this._reader.next())
      }
    } else {
      while (this._reader.hasNext() && from > 0) {
        this.produce(this._reader.next())
        from -= 1
      }
    }
  }
}
