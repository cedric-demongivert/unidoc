import { UTF32CodeUnit } from './UTF32CodeUnit'

/**
 * An UTF-16 element of a code point representation.
 * 
 * @see https://www.unicode.org/versions/Unicode14.0.0/ch02.pdf Page 33
 */
export type UTF16CodeUnit = (
  UTF16CodeUnit.HighSurrogate |
  UTF16CodeUnit.LowSurrogate |
  UTF16CodeUnit.NonSurrogate
)

export namespace UTF16CodeUnit {
  /**
   * @see https://www.unicode.org/versions/Unicode14.0.0/ch23.pdf Section 23.6
   * 
   * The first code unit of an UTF-16 surrogate pair.
   */
  export type HighSurrogate = number

  export namespace HighSurrogate {
    /**
     * High surrogate valid value range lower boundary.
     * 
     * @see https://www.unicode.org/versions/Unicode14.0.0/ch23.pdf Page 923
     */
    export const LOWER_BOUNDARY: UTF16CodeUnit = 0xD7FF

    /**
     * Minimum value allowed for a first code unit of an UTF-16 surrogate pair.
     * 
     * @see https://www.unicode.org/versions/Unicode14.0.0/ch23.pdf Page 923
     */
    export const MINIMUM: HighSurrogate = 0xD800

    /**
     * Maximum value allowed for a first code unit of an UTF-16 surrogate pair.
     * 
     * @see https://www.unicode.org/versions/Unicode14.0.0/ch23.pdf Page 923
     */
    export const MAXIMUM: HighSurrogate = 0xDBFF

    /**
     * High surrogate valid value range upper boundary.
     * 
     * @see https://www.unicode.org/versions/Unicode14.0.0/ch23.pdf Page 923
     */
    export const UPPER_BOUNDARY: UTF16CodeUnit = 0xDC00
  }

  /**
   * @see https://www.unicode.org/versions/Unicode14.0.0/ch23.pdf Section 23.6
   * 
   * The second code unit of an UTF-16 surrogate pair.
   */
  export type LowSurrogate = number

  export namespace LowSurrogate {
    /**
     * Low surrogate valid value range lower boundary.
     * 
     * @see https://www.unicode.org/versions/Unicode14.0.0/ch23.pdf Page 923
     */
    export const LOWER_BOUNDARY: UTF16CodeUnit = 0xDBFF

    /**
     * Minimum value allowed for a second code unit of an UTF-16 surrogate pair.
     * 
     * @see https://www.unicode.org/versions/Unicode14.0.0/ch23.pdf Page 923
     */
    export const MINIMUM: HighSurrogate = 0xDC00

    /**
     * Maximum value allowed for a second code unit of an UTF-16 surrogate pair.
     * 
     * @see https://www.unicode.org/versions/Unicode14.0.0/ch23.pdf Page 923
     */
    export const MAXIMUM: HighSurrogate = 0xDFFF

    /**
     * Low surrogate valid value range upper boundary.
     * 
     * @see https://www.unicode.org/versions/Unicode14.0.0/ch23.pdf Page 923
     */
    export const UPPER_BOUNDARY: UTF16CodeUnit = 0xE000
  }

  /** 
   * Any code unit of an UTF-16 surrogate pair.
   */
  export type AnySurrogate = HighSurrogate | LowSurrogate

  export namespace AnySurrogate {
    /**
     * Any surrogate valid value range lower boundary.
     * 
     * @see https://www.unicode.org/versions/Unicode14.0.0/ch23.pdf Page 923
     */
    export const LOWER_BOUNDARY: UTF16CodeUnit = HighSurrogate.LOWER_BOUNDARY

    /**
     * Minimum value allowed for a code unit of an UTF-16 surrogate pair.
     * 
     * @see https://www.unicode.org/versions/Unicode14.0.0/ch23.pdf Page 923
     */
    export const MINIMUM: HighSurrogate = HighSurrogate.MINIMUM

    /**
     * Maximum value allowed for a code unit of an UTF-16 surrogate pair.
     * 
     * @see https://www.unicode.org/versions/Unicode14.0.0/ch23.pdf Page 923
     */
    export const MAXIMUM: HighSurrogate = LowSurrogate.MAXIMUM

    /**
     * Any surrogate valid value range upper boundary.
     * 
     * @see https://www.unicode.org/versions/Unicode14.0.0/ch23.pdf Page 923
     */
    export const UPPER_BOUNDARY: UTF16CodeUnit = LowSurrogate.UPPER_BOUNDARY
  }

  /**
   * @see https://www.unicode.org/versions/Unicode14.0.0/ch02.pdf Page 36
   * 
   * A code unit that is not a surrogate pair.
   */
  export type NonSurrogate = number

  /**
   * 
   */
  export const REPLACEMENT_CHARACTER: NonSurrogate = 0xFFFD

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const SEMICOLON: NonSurrogate = 0x003B

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const HORIZONTAL_TABULATION: NonSurrogate = 0x0009

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const NEW_LINE: NonSurrogate = 0x000A

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const CARRIAGE_RETURN: NonSurrogate = 0x000D

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const FORM_FEED: NonSurrogate = 0x000C

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const SPACE: NonSurrogate = 0x0020

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const COLON: NonSurrogate = 0x003A


  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_SMALL_LETTER_A: NonSurrogate = 0x0061

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_SMALL_LETTER_B: NonSurrogate = 0x0062

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_SMALL_LETTER_C: NonSurrogate = 0x0063

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_SMALL_LETTER_D: NonSurrogate = 0x0064

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_SMALL_LETTER_E: NonSurrogate = 0x0065

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_SMALL_LETTER_F: NonSurrogate = 0x0066

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_SMALL_LETTER_G: NonSurrogate = 0x0067

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_SMALL_LETTER_H: NonSurrogate = 0x0068

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_SMALL_LETTER_I: NonSurrogate = 0x0069

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_SMALL_LETTER_J: NonSurrogate = 0x006A

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_SMALL_LETTER_K: NonSurrogate = 0x006B

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_SMALL_LETTER_L: NonSurrogate = 0x006C

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_SMALL_LETTER_M: NonSurrogate = 0x006D

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_SMALL_LETTER_N: NonSurrogate = 0x006E

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_SMALL_LETTER_O: NonSurrogate = 0x006F

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_SMALL_LETTER_P: NonSurrogate = 0x0070

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_SMALL_LETTER_Q: NonSurrogate = 0x0071

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_SMALL_LETTER_R: NonSurrogate = 0x0072

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_SMALL_LETTER_S: NonSurrogate = 0x0073

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_SMALL_LETTER_T: NonSurrogate = 0x0074

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_SMALL_LETTER_U: NonSurrogate = 0x0075

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_SMALL_LETTER_V: NonSurrogate = 0x0076

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_SMALL_LETTER_W: NonSurrogate = 0x0077

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_SMALL_LETTER_X: NonSurrogate = 0x0078

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_SMALL_LETTER_Y: NonSurrogate = 0x0079

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_SMALL_LETTER_Z: NonSurrogate = 0x007A

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_CAPITAL_LETTER_A: NonSurrogate = 0x0041

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_CAPITAL_LETTER_B: NonSurrogate = 0x0042

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_CAPITAL_LETTER_C: NonSurrogate = 0x0043

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_CAPITAL_LETTER_D: NonSurrogate = 0x0044

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_CAPITAL_LETTER_E: NonSurrogate = 0x0045

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_CAPITAL_LETTER_F: NonSurrogate = 0x0046

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_CAPITAL_LETTER_G: NonSurrogate = 0x0047

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_CAPITAL_LETTER_H: NonSurrogate = 0x0048

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_CAPITAL_LETTER_I: NonSurrogate = 0x0049

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_CAPITAL_LETTER_J: NonSurrogate = 0x004A

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_CAPITAL_LETTER_K: NonSurrogate = 0x004B

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_CAPITAL_LETTER_L: NonSurrogate = 0x004C

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_CAPITAL_LETTER_M: NonSurrogate = 0x004D

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_CAPITAL_LETTER_N: NonSurrogate = 0x004E

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_CAPITAL_LETTER_O: NonSurrogate = 0x004F

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_CAPITAL_LETTER_P: NonSurrogate = 0x0050

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_CAPITAL_LETTER_Q: NonSurrogate = 0x0051

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_CAPITAL_LETTER_R: NonSurrogate = 0x0052

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_CAPITAL_LETTER_S: NonSurrogate = 0x0053

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_CAPITAL_LETTER_T: NonSurrogate = 0x0054

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_CAPITAL_LETTER_U: NonSurrogate = 0x0055

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_CAPITAL_LETTER_V: NonSurrogate = 0x0056

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_CAPITAL_LETTER_W: NonSurrogate = 0x0057

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_CAPITAL_LETTER_X: NonSurrogate = 0x0058

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_CAPITAL_LETTER_Y: NonSurrogate = 0x0059

  /**
   * @see https://www.unicode.org/charts/PDF/U0000.pdf
   */
  export const LATIN_CAPITAL_LETTER_Z: NonSurrogate = 0x005A

  /**
   * 
   */
  export function offset(unit: UTF16CodeUnit): number {
    return unit > HighSurrogate.LOWER_BOUNDARY && unit < HighSurrogate.UPPER_BOUNDARY ? 2 : 1
  }

  /**
   * 
   */
  export function next(value: string, current: number): number {
    const code: UTF16CodeUnit = value.charCodeAt(current)
    return code > HighSurrogate.LOWER_BOUNDARY && code < HighSurrogate.UPPER_BOUNDARY ? current + 2 : current + 1
  }

  /**
   * Return true if the given UTF-16 code unit is the first element of an UTF-16 surrogate pair.
   * 
   * @param unit - An UTF-16 code unit.
   * 
   * @return True if the given code unit is the first element of an UTF-16 surrogate pair.
   * 
   * @see https://www.unicode.org/versions/Unicode14.0.0/ch05.pdf Page 203
   */
  export function isHighSurrogate(unit: UTF16CodeUnit): unit is UTF16CodeUnit.HighSurrogate {
    return unit > HighSurrogate.LOWER_BOUNDARY && unit < HighSurrogate.UPPER_BOUNDARY
  }

  /**
   * Return true if the given UTF-16 code unit is the second element of an UTF-16 surrogate pair.
   * 
   * @param unit - An UTF-16 code unit.
   * 
   * @return True if the given code unit is the second element of an UTF-16 surrogate pair.
   * 
   * @see https://www.unicode.org/versions/Unicode14.0.0/ch05.pdf Page 203
   */
  export function isLowSurrogate(unit: UTF16CodeUnit): unit is UTF16CodeUnit.LowSurrogate {
    return unit > LowSurrogate.LOWER_BOUNDARY && unit < LowSurrogate.UPPER_BOUNDARY
  }

  /**
   * Return true if the given UTF-16 code unit is an element of an UTF-16 surrogate pair.
   * 
   * @param unit - An UTF-16 code unit.
   * 
   * @return True if the given code unit is an element of an UTF-16 surrogate pair.
   * 
   * @see https://www.unicode.org/versions/Unicode14.0.0/ch05.pdf Page 203
   */
  export function isSurrogate(unit: UTF16CodeUnit): unit is UTF16CodeUnit.AnySurrogate {
    return unit > AnySurrogate.LOWER_BOUNDARY && unit < AnySurrogate.UPPER_BOUNDARY
  }

  /**
   * Return true if the given UTF-16 code unit is not an element of an UTF-16 surrogate pair.
   * 
   * @param unit - An UTF-16 code unit.
   * 
   * @return True if the given code unit is not an element of an UTF-16 surrogate pair.
   * 
   * @see https://www.unicode.org/versions/Unicode14.0.0/ch05.pdf Page 203
   */
  export function isNonSurrogate(unit: UTF16CodeUnit): unit is UTF16CodeUnit.NonSurrogate {
    return unit < AnySurrogate.MINIMUM || unit > AnySurrogate.MAXIMUM
  }

  export namespace fromUTF32CodeUnit {
    /**
     * 
     */
    export function getLeading(unit: UTF32CodeUnit): UTF16CodeUnit {
      if (unit > 0xFFFF) {
        return HighSurrogate.MINIMUM + ((unit - 0x10000) >>> 10)
      } else if (unit < AnySurrogate.MINIMUM || unit > AnySurrogate.MAXIMUM) {
        return unit
      } else {
        return REPLACEMENT_CHARACTER // ERROR @see https://www.unicode.org/versions/Unicode14.0.0/ch05.pdf Page 255
      }
    }

    /**
     * 
     */
    export function getTrailing(unit: UTF32CodeUnit): UTF16CodeUnit | undefined {
      return unit > 0xFFFF ? LowSurrogate.MINIMUM + (unit & 0x3FF) : undefined
    }

    /**
     * 
     */
    export function getSize(unit: UTF32CodeUnit): number {
      return unit > 0xFFFF ? 2 : 1
    }
  }
}
