import * as Benchmark from 'benchmark'

import { UnidocSymbol } from '../sources/symbol/UnidocSymbol'
import { UTF16CodeUnit } from '../sources/symbol/UTF16CodeUnit'
import { UnidocLocation } from '../sources/origin/UnidocLocation'
import { UnidocTracker } from '../sources/origin/UnidocTracker'
import { UnidocOrigin } from '../sources/origin/UnidocOrigin'

/**
 * A generator that produce symbols from a given javascript string.
 */
class UnidocStringSymbolGenerator {
  /**
   * The javascript string that hold the symbols to produce.
   */
  public readonly source: string

  /**
   * The location of the next symbol to produce in the underlying javascript string.
   */
  private _cursor: number

  /**
   * A tracker instance used for computing the location of the next symbol.
   */
  private readonly _tracker: UnidocTracker

  /**
   * A symbol instance used for emitting results.
   */
  private readonly _symbol: UnidocSymbol

  /**
   * The origin of the symbol instance.
   */
  private readonly _origin: UnidocOrigin

  /**
   * Name of this generator.
   */
  public readonly name: string

  /**
   * @see UnidocGenerator.running
   */
  public get running(): boolean {
    return this._cursor < this.source.length
  }

  /**
   * @see UnidocGenerator.current
   */
  public get current(): UnidocSymbol | undefined {
    return this._cursor > 0 ? this._symbol : undefined
  }

  /**
   * @see UnidocSymbolGenerator.location
   */
  public get location(): UnidocLocation {
    return this._tracker.location
  }

  /**
   * Instantiate a new symbol generator.
   * 
   * @param source - The javascript string to use as a source.
   * @param [name=UnidocStringSymbolGenerator.DEFAULT_NAME] - The name of this generator for identification purposes.
   */
  public constructor(source: string, name: string = UnidocStringSymbolGenerator.DEFAULT_NAME) {
    this.source = source
    this._cursor = 0
    this._tracker = new UnidocTracker()
    this._symbol = new UnidocSymbol()
    this._symbol.origin.inMemory(name)
    this._origin = this._symbol.origin
    this.name = name
  }

  /**
   * @see UnidocGenerator.skip 
   */
  public skip(elements: number = 1): this {
    for (let index = 0; index < elements; ++index) {
      this.next()
    }

    return this
  }

  /**
   * @see UnidocGenerator.generator 
   */
  public * generator(): Generator<UnidocSymbol, void, unknown> {
    let symbol: UnidocSymbol | undefined = this.next()

    while (symbol) {
      yield symbol
      symbol = this.next()
    }
  }

  /**
   * @see UnidocSymbolReader.next
   */
  public next(): UnidocSymbol | undefined {
    const tracker: UnidocTracker = this._tracker
    const symbol: UnidocSymbol = this._symbol
    const origin: UnidocOrigin = this._origin
    const cursor: number = this._cursor
    const source: string = this.source

    if (cursor < source.length) {
      const highSurrogate: number = source.charCodeAt(cursor)

      if (highSurrogate > UTF16CodeUnit.AnySurrogate.LOWER_BOUNDARY && highSurrogate < UTF16CodeUnit.AnySurrogate.UPPER_BOUNDARY) {
        const lowSurrogate: number = source.charCodeAt(cursor + 1)
        symbol.code = (highSurrogate - UTF16CodeUnit.HighSurrogate.MINIMUM << 10) + (lowSurrogate - UTF16CodeUnit.LowSurrogate.MINIMUM) + 0x10000
        this._cursor += 2
      } else {
        symbol.code = highSurrogate
        this._cursor += 1
      }

      origin.fromLocation(tracker.location)
      tracker.next(symbol.code)
      origin.toLocation(tracker.location)

      return symbol
    } else {
      return undefined
    }
  }
}

/**
 * 
 */
namespace UnidocStringSymbolGenerator {
  /**
   * The default name used for identifying UnidocStringSymbolGenerator as a source
   */
  export const DEFAULT_NAME: string = UnidocStringSymbolGenerator.name

  /**
   * Instantiate a new symbol generator.
   * 
   * @param source - The javascript string to use as a source.
   * @param [name=UnidocStringSymbolGenerator.DEFAULT_NAME] - The name of this generator for identification purposes.
   */
  export function create(source: string, name: string = DEFAULT_NAME): UnidocStringSymbolGenerator {
    return new UnidocStringSymbolGenerator(source, origin)
  }
}

function* generator(source: string): Generator<UnidocSymbol> {
  const tracker: UnidocTracker = new UnidocTracker()
  const symbol: UnidocSymbol = new UnidocSymbol()
  const origin: UnidocOrigin = symbol.origin
  let cursor: number = 0

  while (cursor < source.length) {
    const highSurrogate: number = source.charCodeAt(cursor)

    if (highSurrogate > UTF16CodeUnit.AnySurrogate.LOWER_BOUNDARY && highSurrogate < UTF16CodeUnit.AnySurrogate.UPPER_BOUNDARY) {
      const lowSurrogate: number = source.charCodeAt(cursor + 1)
      symbol.code = (highSurrogate - UTF16CodeUnit.HighSurrogate.MINIMUM << 10) + (lowSurrogate - UTF16CodeUnit.LowSurrogate.MINIMUM) + 0x10000
      cursor += 2
    } else {
      symbol.code = highSurrogate
      cursor += 1
    }

    origin.fromLocation(tracker.location)
    tracker.next(symbol.code)
    origin.toLocation(tracker.location)

    yield symbol
  }
}

const PARTS: string[] = [
  '🤩apf',
  '😀ae;',
  '😉#!e',
  '😂wea',
  '😍 de',
  '😗e w',
  '😚.! '
]

const STRINGS: string[] = []

for (let index = 0; index < 250; ++index) {
  let result: string = ''

  for (let part = 0; part < 10; ++part) {
    result += PARTS[(Math.random() * PARTS.length) << 0]
  }

  STRINGS.push(result)
}

const suite: Benchmark.Suite = new Benchmark.Suite

suite.add('#StringSymbolGenerator', function () {
  const symbols: string = STRINGS[(Math.random() * STRINGS.length) << 0]
  const generator: UnidocStringSymbolGenerator = new UnidocStringSymbolGenerator(symbols)

  while (generator.next()) { }
})

suite.add('#generator', function () {
  const symbols: string = STRINGS[(Math.random() * STRINGS.length) << 0]
  for (const symbol in generator(symbols)) { }
})

suite.on('complete', function (this: Benchmark.Suite) {
  this.forEach(function print(value: Benchmark) {
    console.log(value.name + ' executed ' + Benchmark.formatNumber(value.count) + ' times')
    console.log('  average execution time: ' + Benchmark.formatNumber(value.stats.variance))
    console.log('  variance: ' + Benchmark.formatNumber(value.stats.variance))
    console.log('  deviation: ' + Benchmark.formatNumber(value.stats.variance))
  })

  console.log('Fastest is ' + this.filter('fastest').map('name'))
})

suite.run({ async: false })
