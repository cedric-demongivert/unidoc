import { Pack } from '@cedric-demongivert/gl-tool-collection'

import { UnidocSymbol } from '../symbol/UnidocSymbol'

import { UnidocSymbolReader } from '../reader/UnidocSymbolReader'

import { UnidocImportationResolver } from './UnidocImportationResolver'
import { UnidocNullResolver } from './UnidocNullResolver'

import { ListenableUnidocProducer } from '../producer/ListenableUnidocProducer'

export class UnidocStream extends ListenableUnidocProducer<UnidocSymbol> {
  /**
  *
  */
  private readonly _readers: Pack<UnidocSymbolReader>

  /**
  *
  */
  private readonly _identifiers: Pack<string>

  /**
  *
  */
  private readonly _symbol: UnidocSymbol

  /**
  *
  */
  private readonly _resolver: UnidocImportationResolver

  public constructor(reader: UnidocSymbolReader, resolver: UnidocImportationResolver = UnidocNullResolver.INSTANCE) {
    super()

    this._readers = Pack.any(16)
    this._identifiers = Pack.any(16)
    this._symbol = new UnidocSymbol()
    this._resolver = resolver

    this._readers.push(reader)

    while (this._readers.size > 0 && !this._readers.last.hasNext()) {
      this._readers.pop()
    }
  }

  public import(identifier: string): void {
    if (this._identifiers.indexOf(identifier) >= 0) {
      throw new Error(
        'Unable to import content ' + identifier +
        ' due to a circular dependency : ' +
        [...this._identifiers].join(' > ') + '.'
      )
    } else {
      this._readers.push(this._resolver.resolve(identifier))
      this._identifiers.push(identifier)
      this._resolver.begin(identifier)
    }
  }

  public stream(): void {
    this.initialize()

    while (this.hasNext()) {
      this.next()
    }

    this.complete()
  }

  private hasNext(): boolean {
    return this._readers.size > 0
  }

  private next(): void {
    const next: UnidocSymbol = this._readers.last.next()
    this._symbol.symbol = next.symbol

    while (this._readers.size > 0 && !this._readers.last.hasNext()) {
      this._readers.pop()

      if (this._readers.size > 0) {
        this._resolver.end(this._identifiers.pop())
      }
    }

    this.produce(next)
  }
}
