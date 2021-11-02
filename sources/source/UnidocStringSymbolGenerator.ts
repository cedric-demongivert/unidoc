import { UnidocSymbol } from '../symbol/UnidocSymbol'

import { UnidocPath } from '../origin/UnidocPath'

import { UnidocLocation } from '../origin/UnidocLocation'
import { UnidocLocationTracker } from '../origin/UnidocLocationTracker'

import { UnidocGenerator } from '../stream/UnidocGenerator'

import { UnidocObject } from '../UnidocObject'

import { UnidocSymbolGenerator } from './UnidocSymbolGenerator'

/**
 * 
 */
export class UnidocStringSymbolGenerator extends UnidocGenerator(UnidocSymbol, UnidocObject) implements UnidocSymbolGenerator {
  /**
   * The content to read.
   */
  public readonly source: string

  /**
   *
   */
  public readonly origin: UnidocPath

  /**
   * A symbol instance for symbol emission.
   */
  private readonly _symbol: UnidocSymbol

  /**
   * Location into this reader's source.
   */
  private readonly _tracker: UnidocLocationTracker

  /**
   * @see UnidocGenerator.running
   */
  public get running(): boolean {
    return this._tracker.location.index < this.source.length
  }

  /**
   * @see UnidocGenerator.current
   */
  public get current(): UnidocSymbol | undefined {
    const index: number = this._tracker.location.index
    return index > 0 && index < this.source.length ? this._symbol : undefined
  }

  /**
   * @see UnidocSymbolReader.location
   */
  public get location(): UnidocLocation {
    return this._tracker.location
  }

  /**
   * 
   */
  public constructor(source: string, origin: UnidocOrigin = UnidocOrigin.runtime()) {
    super()
    this.source = source
    this.origin = new UnidocOrigin()
    this.origin.copy(origin)
    this._tracker = new UnidocLocationTracker()
    this._symbol = new UnidocSymbol()
  }

  /**
   * @see UnidocSymbolReader.next
   */
  public next(): UnidocSymbol {
    const tracker: UnidocLocationTracker = this._tracker
    const symbol: UnidocSymbol = this._symbol

    const nextCodePoint: number | undefined = this.source.codePointAt(tracker.location.index)

    if (nextCodePoint == null) {
      throw new Error(
        'Unable to read the next available code point at ' +
        tracker.toString() + ' from the underlying source : "' +
        this.source + '" in memory.'
      )
    } else {
      symbol.code = nextCodePoint
      symbol.origin.clear()
      symbol.origin.from.text(tracker.location).concat(this.origin)

      tracker.next(nextCodePoint)

      symbol.origin.to.text(tracker.location).concat(this.origin)

      return symbol
    }
  }
}

/**
 * 
 */
export namespace UnidocStringSymbolGenerator {
  /**
   * 
   */
  export function create(source: string, origin: UnidocOrigin = UnidocOrigin.runtime()): UnidocStringSymbolGenerator {
    return new UnidocStringSymbolGenerator(source, origin)
  }
}
