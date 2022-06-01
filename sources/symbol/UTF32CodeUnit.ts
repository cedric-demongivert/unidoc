import { UTF16CodeUnit } from "./UTF16CodeUnit"

/**
 * An UTF-32 character representation.
 * 
 * @see https://www.unicode.org/versions/Unicode14.0.0/ch02.pdf Page 29
 */
export type UTF32CodeUnit = number

/**
 *
 */
export namespace UTF32CodeUnit {
  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const NULL: UTF32CodeUnit = 0x00000000

  /**
   * @see https://www.unicode.org/versions/Unicode14.0.0/ch06.pdf Page 268
   */
  export const MINUS: UTF32CodeUnit = 0x00002212

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const PLUS: UTF32CodeUnit = 0x0000002B

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const NUMBER_SIGN: UTF32CodeUnit = 0x00000023

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const FULL_STOP: UTF32CodeUnit = 0x0000002E

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const COLON: UTF32CodeUnit = 0x0000003A

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const SOLIDUS: UTF32CodeUnit = 0x0000002F

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const REVERSE_SOLIDUS: UTF32CodeUnit = 0x0000005C

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LEFT_CURLY_BRACKET: UTF32CodeUnit = 0x0000007B

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const VERTICAL_LINE: UTF32CodeUnit = 0x0000007C

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const RIGHT_CURLY_BRACKET: UTF32CodeUnit = 0x0000007D

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const ZERO: UTF32CodeUnit = 0x00000030

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const ONE: UTF32CodeUnit = 0x00000031

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const TWO: UTF32CodeUnit = 0x00000032

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const THREE: UTF32CodeUnit = 0x00000033

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const FOUR: UTF32CodeUnit = 0x00000034

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const FIVE: UTF32CodeUnit = 0x00000035

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const SIX: UTF32CodeUnit = 0x00000036

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const SEVEN: UTF32CodeUnit = 0x00000037

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const EIGHT: UTF32CodeUnit = 0x00000038

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const NINE: UTF32CodeUnit = 0x00000039

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const HORIZONTAL_TABULATION: UTF32CodeUnit = 0x00000009

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const NO_BREAK_SPACE: UTF32CodeUnit = 0x000000A0

  /**
   * 
   */
  export const EN_QUAD: UTF32CodeUnit = 0x00002000

  /**
   * 
   */
  export const EM_QUAD: UTF32CodeUnit = 0x00002001

  /**
   * 
   */
  export const EN_SPACE: UTF32CodeUnit = 0x00002002

  /**
   * 
   */
  export const EM_SPACE: UTF32CodeUnit = 0x00002003

  /**
   * 
   */
  export const THREE_PER_EM_SPACE: UTF32CodeUnit = 0x00002004

  /**
   * 
   */
  export const FOUR_PER_EM_SPACE: UTF32CodeUnit = 0x00002005

  /**
   * 
   */
  export const SIX_PER_EM_SPACE: UTF32CodeUnit = 0x00002006

  /**
   * 
   */
  export const FIGURE_SPACE: UTF32CodeUnit = 0x00002007

  /**
   * 
   */
  export const PUNCTUATION_SPACE: UTF32CodeUnit = 0x00002008

  /**
   * 
   */
  export const THIN_SPACE: UTF32CodeUnit = 0x00002009

  /**
   * 
   */
  export const HAIR_SPACE: UTF32CodeUnit = 0x0000200A

  /**
   * 
   */
  export const OGHAM_SPACE_MARK: UTF32CodeUnit = 0x00001680

  /**
   * 
   */
  export const MEDIUM_MATHEMATICAL_SPACE: UTF32CodeUnit = 0x0000205F

  /**
   * 
   */
  export const IDEOGRAPHIC_SPACE: UTF32CodeUnit = 0x00003000

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const NEW_LINE: UTF32CodeUnit = 0x0000000A

  /**
   * @see https://www.unicode.org/reports/tr14/#BK
   */
  export const LINE_SEPARATOR: UTF32CodeUnit = 0x00002028

  /**
   * @see https://www.unicode.org/reports/tr14/#BK
   */
  export const PARAGRAPH_SEPARATOR: UTF32CodeUnit = 0x00002029

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const VERTICAL_TABULATION: UTF32CodeUnit = 0x0000000B

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const FORM_FEED: UTF32CodeUnit = 0x0000000C

  /**
   * @see https://www.unicode.org/reports/tr14/#NL
   */
  export const NEXT_LINE: UTF32CodeUnit = 0x00000085

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const CARRIAGE_RETURN: UTF32CodeUnit = 0x0000000D


  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const SPACE: UTF32CodeUnit = 0x00000020

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const QUOTATION_MARK: UTF32CodeUnit = 0x00000022

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const SEMICOLON: UTF32CodeUnit = 0x0000003B

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_SMALL_LETTER_A: UTF32CodeUnit = 0x00000061

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_SMALL_LETTER_B: UTF32CodeUnit = 0x00000062

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_SMALL_LETTER_C: UTF32CodeUnit = 0x00000063

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_SMALL_LETTER_D: UTF32CodeUnit = 0x00000064

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_SMALL_LETTER_E: UTF32CodeUnit = 0x00000065

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_SMALL_LETTER_F: UTF32CodeUnit = 0x00000066

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_SMALL_LETTER_G: UTF32CodeUnit = 0x00000067

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_SMALL_LETTER_H: UTF32CodeUnit = 0x00000068

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_SMALL_LETTER_I: UTF32CodeUnit = 0x00000069

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_SMALL_LETTER_J: UTF32CodeUnit = 0x0000006A

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_SMALL_LETTER_K: UTF32CodeUnit = 0x0000006B

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_SMALL_LETTER_L: UTF32CodeUnit = 0x0000006C

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_SMALL_LETTER_M: UTF32CodeUnit = 0x0000006D

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_SMALL_LETTER_N: UTF32CodeUnit = 0x0000006E

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_SMALL_LETTER_O: UTF32CodeUnit = 0x0000006F

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_SMALL_LETTER_P: UTF32CodeUnit = 0x00000070

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_SMALL_LETTER_Q: UTF32CodeUnit = 0x00000071

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_SMALL_LETTER_R: UTF32CodeUnit = 0x00000072

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_SMALL_LETTER_S: UTF32CodeUnit = 0x00000073

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_SMALL_LETTER_T: UTF32CodeUnit = 0x00000074

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_SMALL_LETTER_U: UTF32CodeUnit = 0x00000075

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_SMALL_LETTER_V: UTF32CodeUnit = 0x00000076

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_SMALL_LETTER_W: UTF32CodeUnit = 0x00000077

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_SMALL_LETTER_X: UTF32CodeUnit = 0x00000078

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_SMALL_LETTER_Y: UTF32CodeUnit = 0x00000079

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_SMALL_LETTER_Z: UTF32CodeUnit = 0x0000007A

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_CAPITAL_LETTER_A: UTF32CodeUnit = 0x00000041

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_CAPITAL_LETTER_B: UTF32CodeUnit = 0x00000042

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_CAPITAL_LETTER_C: UTF32CodeUnit = 0x00000043

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_CAPITAL_LETTER_D: UTF32CodeUnit = 0x00000044

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_CAPITAL_LETTER_E: UTF32CodeUnit = 0x00000045

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_CAPITAL_LETTER_F: UTF32CodeUnit = 0x00000046

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_CAPITAL_LETTER_G: UTF32CodeUnit = 0x00000047

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_CAPITAL_LETTER_H: UTF32CodeUnit = 0x00000048

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_CAPITAL_LETTER_I: UTF32CodeUnit = 0x00000049

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_CAPITAL_LETTER_J: UTF32CodeUnit = 0x0000004A

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_CAPITAL_LETTER_K: UTF32CodeUnit = 0x0000004B

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_CAPITAL_LETTER_L: UTF32CodeUnit = 0x0000004C

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_CAPITAL_LETTER_M: UTF32CodeUnit = 0x0000004D

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_CAPITAL_LETTER_N: UTF32CodeUnit = 0x0000004E

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_CAPITAL_LETTER_O: UTF32CodeUnit = 0x0000004F

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_CAPITAL_LETTER_P: UTF32CodeUnit = 0x00000050

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_CAPITAL_LETTER_Q: UTF32CodeUnit = 0x00000051

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_CAPITAL_LETTER_R: UTF32CodeUnit = 0x00000052

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_CAPITAL_LETTER_S: UTF32CodeUnit = 0x00000053

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_CAPITAL_LETTER_T: UTF32CodeUnit = 0x00000054

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_CAPITAL_LETTER_U: UTF32CodeUnit = 0x00000055

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_CAPITAL_LETTER_V: UTF32CodeUnit = 0x00000056

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_CAPITAL_LETTER_W: UTF32CodeUnit = 0x00000057

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_CAPITAL_LETTER_X: UTF32CodeUnit = 0x00000058

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_CAPITAL_LETTER_Y: UTF32CodeUnit = 0x00000059

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_CAPITAL_LETTER_Z: UTF32CodeUnit = 0x0000005A

  /**
   * 
   */
  export const LATIN_SMALL_LETTER_A_Z: UTF32CodeUnit[] = [
    LATIN_SMALL_LETTER_A, LATIN_SMALL_LETTER_B,
    LATIN_SMALL_LETTER_C, LATIN_SMALL_LETTER_D,
    LATIN_SMALL_LETTER_E, LATIN_SMALL_LETTER_F,
    LATIN_SMALL_LETTER_G, LATIN_SMALL_LETTER_H,
    LATIN_SMALL_LETTER_I, LATIN_SMALL_LETTER_J,
    LATIN_SMALL_LETTER_K, LATIN_SMALL_LETTER_L,
    LATIN_SMALL_LETTER_M, LATIN_SMALL_LETTER_N,
    LATIN_SMALL_LETTER_O, LATIN_SMALL_LETTER_P,
    LATIN_SMALL_LETTER_Q, LATIN_SMALL_LETTER_R,
    LATIN_SMALL_LETTER_S, LATIN_SMALL_LETTER_T,
    LATIN_SMALL_LETTER_U, LATIN_SMALL_LETTER_V,
    LATIN_SMALL_LETTER_W, LATIN_SMALL_LETTER_X,
    LATIN_SMALL_LETTER_Y, LATIN_SMALL_LETTER_Z
  ]

  /**
   * 
   */
  export const LATIN_CAPITAL_LETTER_A_Z: UTF32CodeUnit[] = [
    LATIN_CAPITAL_LETTER_A, LATIN_CAPITAL_LETTER_B,
    LATIN_CAPITAL_LETTER_C, LATIN_CAPITAL_LETTER_D,
    LATIN_CAPITAL_LETTER_E, LATIN_CAPITAL_LETTER_F,
    LATIN_CAPITAL_LETTER_G, LATIN_CAPITAL_LETTER_H,
    LATIN_CAPITAL_LETTER_I, LATIN_CAPITAL_LETTER_J,
    LATIN_CAPITAL_LETTER_K, LATIN_CAPITAL_LETTER_L,
    LATIN_CAPITAL_LETTER_M, LATIN_CAPITAL_LETTER_N,
    LATIN_CAPITAL_LETTER_O, LATIN_CAPITAL_LETTER_P,
    LATIN_CAPITAL_LETTER_Q, LATIN_CAPITAL_LETTER_R,
    LATIN_CAPITAL_LETTER_S, LATIN_CAPITAL_LETTER_T,
    LATIN_CAPITAL_LETTER_U, LATIN_CAPITAL_LETTER_V,
    LATIN_CAPITAL_LETTER_W, LATIN_CAPITAL_LETTER_X,
    LATIN_CAPITAL_LETTER_Y, LATIN_CAPITAL_LETTER_Z
  ]

  /**
   *
   */
  export function isDecimalDigit(symbol: UTF32CodeUnit): boolean {
    return symbol >= ZERO && symbol <= NINE
  }

  /**
   *
   */
  export function isBinaryDigit(symbol: UTF32CodeUnit): boolean {
    return symbol === ZERO || symbol === ONE
  }

  /**
   *
   */
  export function isHexadecimalDigit(symbol: UTF32CodeUnit): boolean {
    return (
      symbol >= ZERO && symbol <= NINE ||
      symbol >= LATIN_CAPITAL_LETTER_A && symbol <= LATIN_CAPITAL_LETTER_F ||
      symbol >= LATIN_SMALL_LETTER_A && symbol <= LATIN_SMALL_LETTER_F
    )
  }

  /**
   *
   */
  export function isWhitespace(symbol: UTF32CodeUnit): boolean {
    return (
      symbol === CARRIAGE_RETURN ||
      symbol === NEW_LINE ||
      symbol === FORM_FEED ||
      symbol === HORIZONTAL_TABULATION ||
      symbol === SPACE
    )
  }

  /**
   * 
   */
  export function get(value: string, index: number): UTF32CodeUnit {
    let offset: number = 0

    for (let cursor = 0; cursor < index && offset < value.length; ++cursor) {
      const highSurrogate: number = value.charCodeAt(offset)

      if (highSurrogate > UTF16CodeUnit.AnySurrogate.LOWER_BOUNDARY && highSurrogate < UTF16CodeUnit.AnySurrogate.UPPER_BOUNDARY) {
        offset += 2
      } else {
        offset += 1
      }
    }

    if (offset >= value.length) {
      return UTF32CodeUnit.NULL
    }

    const highSurrogate: number = value.charCodeAt(offset)

    if (highSurrogate > UTF16CodeUnit.AnySurrogate.LOWER_BOUNDARY && highSurrogate < UTF16CodeUnit.AnySurrogate.UPPER_BOUNDARY) {
      const lowSurrogate: number = value.charCodeAt(offset + 1)
      return (highSurrogate - UTF16CodeUnit.HighSurrogate.MINIMUM << 10) + (lowSurrogate - UTF16CodeUnit.LowSurrogate.MINIMUM) + 0x10000
    } else {
      return highSurrogate
    }
  }

  /**
   * 
   */
  export function getAt(value: string, offset: number): UTF32CodeUnit {
    const highSurrogate: number = value.charCodeAt(offset)

    if (highSurrogate > UTF16CodeUnit.AnySurrogate.LOWER_BOUNDARY && highSurrogate < UTF16CodeUnit.AnySurrogate.UPPER_BOUNDARY) {
      const lowSurrogate: number = value.charCodeAt(offset + 1)
      return (highSurrogate - UTF16CodeUnit.HighSurrogate.MINIMUM << 10) + (lowSurrogate - UTF16CodeUnit.LowSurrogate.MINIMUM) + 0x10000
    } else {
      return highSurrogate
    }
  }

  /**
   * 
   */
  export function* fromString(value: string): Generator<UTF32CodeUnit> {
    const size: number = value.length

    let offset: number = 0

    for (let index = 0; index < size; ++index) {
      const highSurrogate: number = value.charCodeAt(index)

      if (highSurrogate > UTF16CodeUnit.AnySurrogate.LOWER_BOUNDARY && highSurrogate < UTF16CodeUnit.AnySurrogate.UPPER_BOUNDARY) {
        index += 1
        offset += 1
        const lowSurrogate: number = value.charCodeAt(index)
        yield (highSurrogate - UTF16CodeUnit.HighSurrogate.MINIMUM << 10) + (lowSurrogate - UTF16CodeUnit.LowSurrogate.MINIMUM) + 0x10000
      } else {
        yield highSurrogate
      }
    }
  }

  /**
   * Return the UTF32 code unit equivalent to the given surrogated pair.
   * 
   * @param high - The leading UTF-16 surrogated pair element.
   * @param low - The trailing UTF-16 surrogated pair element.
   * 
   * @return The UTF32 code unit equivalent to the given surrogated pair.
   */
  export function fromUTF16CodePoint(high: UTF16CodeUnit.HighSurrogate, low: UTF16CodeUnit.LowSurrogate): UTF32CodeUnit
  /**
   * Return the UTF32 code unit equivalent to the given non-surrogated unit.
   * 
   * @param unit - The UTF-16 unit to convert.
   * 
   * @return The UTF32 code unit equivalent to the given unit.
   */
  export function fromUTF16CodePoint(unit: UTF16CodeUnit.NonSurrogate): UTF32CodeUnit
  // Implementation
  export function fromUTF16CodePoint(leading: UTF16CodeUnit, trailing?: UTF16CodeUnit.LowSurrogate): UTF32CodeUnit {
    return trailing == undefined ? leading : (leading - UTF16CodeUnit.HighSurrogate.MINIMUM << 10) + (trailing - UTF16CodeUnit.LowSurrogate.MINIMUM) + 0x10000
  }

  /**
   * Return a string representation of the given UTF-32 code unit.
   * 
   * @param unit - The UTF-32 code unit to stringify.
   * 
   * @return A string representation of the given UTF-32 code unit.
   */
  export function toString(unit: UTF32CodeUnit): string {
    if (unit > 0xFFFF) {
      return String.fromCharCode(
        UTF16CodeUnit.HighSurrogate.MINIMUM + ((unit - 0x10000) >>> 10),
        UTF16CodeUnit.LowSurrogate.MINIMUM + (unit & 0x3FF)
      )
    } else if (unit < UTF16CodeUnit.AnySurrogate.MINIMUM || unit > UTF16CodeUnit.AnySurrogate.MAXIMUM) {
      return String.fromCharCode(unit)
    } else {
      return String.fromCharCode(UTF16CodeUnit.REPLACEMENT_CHARACTER) // ERROR @see https://www.unicode.org/versions/Unicode14.0.0/ch05.pdf Page 255
    }
  }

  /**
   * Return a more precise string representation of the given UTF-32 code unit for debugging purposes.
   * 
   * @param unit - The UTF-32 code unit to stringify.
   * 
   * @return A more precise string representation of the given UTF-32 code unit for debugging purposes.
   */
  export function toDebugString(symbol: UTF32CodeUnit): string {
    switch (symbol) {
      case UTF32CodeUnit.CARRIAGE_RETURN: return '0x' + symbol.toString(16).padStart(8, '0') + ' CARRIAGE_RETURN'
      case UTF32CodeUnit.NEW_LINE: return '0x' + symbol.toString(16).padStart(8, '0') + ' NEW_LINE'
      case UTF32CodeUnit.FORM_FEED: return '0x' + symbol.toString(16).padStart(8, '0') + ' FORM_FEED'
      case UTF32CodeUnit.HORIZONTAL_TABULATION: return '0x' + symbol.toString(16).padStart(8, '0') + ' HORIZONTAL_TABULATION'
      case UTF32CodeUnit.SPACE: return '0x' + symbol.toString(16).padStart(8, '0') + ' SPACE'
      default: return '0x' + symbol.toString(16).padStart(8, '0') + ' "' + toString(symbol) + '"'
    }
  }
}
