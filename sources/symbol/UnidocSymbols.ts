import { UnidocTracker } from '../origin/UnidocTracker'
import { UnidocOrigin } from '../origin/UnidocOrigin'
import { UnidocURI } from '../origin/UnidocURI'
import { UnidocAuthority } from '../origin/UnidocAuthority'
import { UnidocRange } from '../origin/UnidocRange'

import { UnidocSymbol } from './UnidocSymbol'
import { UTF16String } from './UTF16String'
import { UTF32String } from './UTF32String'
import { UTF16CodeUnit } from './UTF16CodeUnit'

/**
 * A set of helper functions for manipulating unidoc symbols.
 */
export namespace UnidocSymbols {
  /**
   * A symbol generator that generates nothing.
   */
  export function* fromNothing(): Generator<UnidocSymbol> {

  }

  /**
   * Instantiate a generator that will produce the symbols of a given javascript string.
   * 
   * @param content - A javascript string with the content to produce.
   * @param [source=fromString.URI] - The source description to use for each produced symbol.
   * 
   * @return A generator instance that will produce each symbol of the given javascript string.
   */
  export function* fromString(content: string, source: UnidocURI = fromString.URI): Generator<UnidocSymbol> {
    const tracker: UnidocTracker = new UnidocTracker()
    const symbol: UnidocSymbol = new UnidocSymbol()
    const range: UnidocRange = symbol.origin.range

    symbol.origin.source.copy(source)

    let cursor: number = 0

    while (cursor < content.length) {
      const highSurrogate: number = content.charCodeAt(cursor)

      if (highSurrogate > UTF16CodeUnit.AnySurrogate.LOWER_BOUNDARY && highSurrogate < UTF16CodeUnit.AnySurrogate.UPPER_BOUNDARY) {
        const lowSurrogate: number = content.charCodeAt(cursor + 1)
        symbol.code = (highSurrogate - UTF16CodeUnit.HighSurrogate.MINIMUM << 10) + (lowSurrogate - UTF16CodeUnit.LowSurrogate.MINIMUM) + 0x10000
        cursor += 2
      } else {
        symbol.code = highSurrogate
        cursor += 1
      }

      range.fromLocation(tracker.location)
      tracker.next(symbol.code)
      range.toLocation(tracker.location)

      yield symbol
    }
  }

  /**
   * 
   */
  export namespace fromString {
    /**
     * 
     */
    export const URI: Readonly<UnidocURI> = Object.freeze(UnidocURI.runtime(fromString).setAuthority(UnidocAuthority.LOOPBACK))

    /**
     * 
     */
    export function origin(): UnidocOrigin {
      return UnidocOrigin.create(URI)
    }
  }

  /**
   * Instantiate a generator that will produce the symbols of a given UTF16 string.
   * 
   * @param content - An UTF16 string with the content to produce.
   * @param [source=fromUTF16String.URI] - The source description to use for each produced symbol.
   * 
   * @return A generator instance that will produce each symbol of the given UTF16 string.
   */
  export function* fromUTF16String(content: UTF16String, source: UnidocURI = fromUTF16String.URI): Generator<UnidocSymbol> {
    const tracker: UnidocTracker = new UnidocTracker()
    const symbol: UnidocSymbol = new UnidocSymbol()
    const range: UnidocRange = symbol.origin.range

    symbol.origin.source.copy(source)

    let cursor: number = 0

    while (cursor < content.size) {
      const highSurrogate: number = content.get(cursor)

      if (highSurrogate > UTF16CodeUnit.AnySurrogate.LOWER_BOUNDARY && highSurrogate < UTF16CodeUnit.AnySurrogate.UPPER_BOUNDARY) {
        const lowSurrogate: number = content.get(cursor + 1)
        symbol.code = (highSurrogate - UTF16CodeUnit.HighSurrogate.MINIMUM << 10) + (lowSurrogate - UTF16CodeUnit.LowSurrogate.MINIMUM) + 0x10000
        cursor += 2
      } else {
        symbol.code = highSurrogate
        cursor += 1
      }

      range.fromLocation(tracker.location)
      tracker.next(symbol.code)
      range.toLocation(tracker.location)

      yield symbol
    }
  }

  /**
   * 
   */
  export namespace fromUTF16String {
    /**
     * 
     */
    export const URI: Readonly<UnidocURI> = Object.freeze(UnidocURI.runtime(fromUTF16String).setAuthority(UnidocAuthority.LOOPBACK))

    /**
     * 
     */
    export function origin(): UnidocOrigin {
      return UnidocOrigin.create(URI)
    }
  }

  /**
   * Instantiate a generator that will produce the symbols of a given UTF32 string.
   * 
   * @param content - An UTF32 string with the content to produce.
   * @param [source=fromUTF32String.URI] - The source description to use for each produced symbol.
   * 
   * @return A generator instance that will produce each symbol of the given UTF32 string.
   */
  export function* fromUTF32String(content: UTF32String, source: UnidocURI = fromUTF32String.URI): Generator<UnidocSymbol> {
    const tracker: UnidocTracker = new UnidocTracker()
    const symbol: UnidocSymbol = new UnidocSymbol()
    const range: UnidocRange = symbol.origin.range

    symbol.origin.source.copy(source)

    for (const code of content) {
      range.fromLocation(tracker.location)
      tracker.next(symbol.code = code)
      range.toLocation(tracker.location)

      yield symbol
    }
  }

  /**
   * 
   */
  export namespace fromUTF32String {
    /**
     * 
     */
    export const URI: Readonly<UnidocURI> = Object.freeze(UnidocURI.runtime(fromUTF32String).setAuthority(UnidocAuthority.LOOPBACK))

    /**
     * 
     */
    export function origin(): UnidocOrigin {
      return UnidocOrigin.create(URI)
    }
  }
}