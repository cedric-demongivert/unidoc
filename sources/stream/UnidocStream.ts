import { Pack } from '@cedric-demongivert/gl-tool-collection'

import { UnidocSymbol } from '../symbol/UnidocSymbol'

import { UnidocSymbolReader } from '../reader/UnidocSymbolReader'

import { ListenableUnidocProducer } from '../producer/ListenableUnidocProducer'

import { UnidocImportationResolver } from './UnidocImportationResolver'
import { UnidocNullResolver } from './UnidocNullResolver'
import { UnidocStreamState } from './UnidocStreamState'

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

  private _state: UnidocStreamState

  public constructor(reader: UnidocSymbolReader, resolver: UnidocImportationResolver = UnidocNullResolver.INSTANCE) {
    super()

    this._readers = Pack.any(16)
    this._identifiers = Pack.any(16)
    this._symbol = new UnidocSymbol()
    this._resolver = resolver
    this._state = UnidocStreamState.CREATED

    this._readers.push(reader)

    while (this._readers.size > 0 && !this._readers.last.hasNext()) {
      this._readers.pop()
    }
  }

  public import(identifier: string): void {
    this._state = UnidocStreamState.IMPORTING

    if (this._identifiers.indexOf(identifier) >= 0) {
      this._state = UnidocStreamState.RUNNING
      throw new Error(
        'Unable to import content ' + identifier +
        ' due to a circular dependency : ' +
        [...this._identifiers].join(' > ') + '.'
      )
    } else {
      this._resolver.resolve(identifier).then((reader: UnidocSymbolReader) => {
        this._readers.push(reader)
        this._identifiers.push(identifier)
        this._resolver.begin(identifier)
        this._state = UnidocStreamState.RUNNING
        this.stream()
      }).catch((error: Error) => {
        console.error(error)
        this.stream()
      })
    }
  }

  public stream(): void {
    if (this._state === UnidocStreamState.CREATED) {
      this.initialize()
      this._state = UnidocStreamState.RUNNING
    }

    while (this.hasNext() && this._state === UnidocStreamState.RUNNING) {
      this.next()
    }

    if (this._state === UnidocStreamState.RUNNING) {
      this.complete()
      this._state = UnidocStreamState.COMPLETED
    }
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
