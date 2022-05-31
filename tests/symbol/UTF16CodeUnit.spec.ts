/** eslint-env jest */

import { UTF16CodeUnit } from '../../sources/symbol/UTF16CodeUnit'
import { UTF32CodeUnit } from '../../sources/symbol/UTF32CodeUnit'

/**
 * 
 */
describe('UTF16CodeUnit', function () {
  /**
   * 
   */
  describe('REPLACEMENT_CHARACTER', function () {
    /**
     * 
     */
    it('is the replacement character code point', function () {
      expect(String.fromCodePoint(UTF16CodeUnit.REPLACEMENT_CHARACTER)).toBe('�')
    })
  })

  /**
   * 
   */
  describe('fromUTF32CodeUnit.getLeading', function () {
    /**
     * 
     */
    it('return the replacement character if the given value is not a valid UTF32 code unit', function () {
      expect(UTF16CodeUnit.fromUTF32CodeUnit.getLeading(0x0000D800)).toBe(UTF16CodeUnit.REPLACEMENT_CHARACTER)
    })

    /**
     * 
     */
    it('return the given unit if the unit is renderable as a 16 bit integer', function () {
      expect(UTF16CodeUnit.fromUTF32CodeUnit.getLeading(UTF32CodeUnit.LATIN_SMALL_LETTER_K)).toBe(UTF32CodeUnit.LATIN_SMALL_LETTER_K)
    })

    /**
     * @see https://www.compart.com/fr/unicode/U+1F601
     */
    it('return the high surrogate element if the unit is not renderable as a 16 bit integer', function () {
      expect(UTF16CodeUnit.fromUTF32CodeUnit.getLeading(0x0001F601)).toBe('😁'.charCodeAt(0))
    })
  })

  /**
   * 
   */
  describe('fromUTF32CodeUnit.getTrailing', function () {
    /**
     * 
     */
    it('return undefined if the given value is not a valid UTF32 code unit', function () {
      expect(UTF16CodeUnit.fromUTF32CodeUnit.getTrailing(0x0000D800)).toBeUndefined()
    })

    /**
     * 
     */
    it('return undefined if the unit is renderable as a 16 bit integer', function () {
      expect(UTF16CodeUnit.fromUTF32CodeUnit.getTrailing(UTF32CodeUnit.LATIN_SMALL_LETTER_K)).toBeUndefined()
    })

    /**
     * @see https://www.compart.com/fr/unicode/U+1F601
     */
    it('return the low surrogate element if the unit is not renderable as a 16 bit integer', function () {
      expect(UTF16CodeUnit.fromUTF32CodeUnit.getTrailing(0x0001F601)).toBe('😁'.charCodeAt(1))
    })
  })
})
