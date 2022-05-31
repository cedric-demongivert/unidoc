/** eslint-env jest */

import { UTF32CodeUnit } from '../../sources/symbol/UTF32CodeUnit'

/**
 * 
 */
describe('UTF32CodeUnit', function () {
  /**
   * 
   */
  describe('fromUTF16CodePoint', function () {
    /**
     * @see https://www.compart.com/fr/unicode/U+00E9
     */
    it('returns the given code unit if it is a non-surrogate code unit', function () {
      expect(UTF32CodeUnit.fromUTF16CodePoint(0x00E9)).toBe(0x000000E9)
    })

    /**
     * @see https://www.compart.com/fr/unicode/U+1F9B0
     */
    it('returns the utf32 code unit when a surrogate pair was given', function () {
      expect(UTF32CodeUnit.fromUTF16CodePoint(0xD83E, 0xDDB0)).toBe(0x0001F9B0)
    })
  })

  /**
   * 
   */
  describe('toString', function () {
    /**
     * @see https://www.compart.com/fr/unicode/U+00E9
     */
    it('returns a string representation of non-surrogated characters', function () {
      expect(UTF32CodeUnit.toString(0x000000E9)).toBe('é')
    })

    /**
     * @see https://www.compart.com/fr/unicode/U+1F9B0
     */
    it('returns a string representation of surrogated characters', function () {
      expect(UTF32CodeUnit.toString(0x0001F9B0)).toBe('🦰')
    })
  })

  describe('toDebugString', function () {
    /**
     * @see https://www.compart.com/fr/unicode/U+00E9
     */
    it('returns a string representation of non-surrogated characters', function () {
      expect(UTF32CodeUnit.toDebugString(0x000000E9)).toBe('0x000000e9 "é"')
    })

    /**
     * @see https://www.compart.com/fr/unicode/U+1F9B0
     */
    it('returns a string representation of surrogated characters', function () {
      expect(UTF32CodeUnit.toDebugString(0x0001F9B0)).toBe('0x0001f9b0 "🦰"')
    })
  })
})
