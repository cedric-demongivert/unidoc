/** eslint-env jest */

import { UTF16CodeUnit } from '../../sources/symbol/UTF16CodeUnit'
import { UTF16String } from '../../sources/symbol/UTF16String'
import { UTF32CodeUnit } from '../../sources/symbol/UTF32CodeUnit'
import { UTF32String } from '../../sources/symbol/UTF32String'

/**
 * 
 */
describe('UTF32String', function () {
  /**
   * 
   */
  describe('prototype.equalsToString', function () {
    /**
     * 
     */
    it('returns true if both the value of an UTF32String and the given string are equals', function () {
      const value: string = 'The éö"lõtï jump over 🦰 !'
      const utf32String: UTF32String = UTF32String.allocate(value.length)

      for (let index = 0; index < value.length; ++index) {
        if (UTF16CodeUnit.isNonSurrogate(value.charCodeAt(index))) {
          utf32String.push(value.charCodeAt(index))
        } else {
          utf32String.push(UTF32CodeUnit.fromUTF16CodePoint(
            value.charCodeAt(index),
            value.charCodeAt(index + 1)
          ))

          index += 1
        }
      }

      expect(utf32String.equalsToString('The éö"lõtï jump over 🦰 !')).toBeTruthy()
    })

    /**
     * 
     */
    it('returns false if the given string has a different length', function () {
      const value: string = 'The éö"lõtï jump over 🦰 !'
      const utf32String: UTF32String = UTF32String.allocate(value.length)

      for (let index = 0; index < value.length; ++index) {
        if (UTF16CodeUnit.isNonSurrogate(value.charCodeAt(index))) {
          utf32String.push(value.charCodeAt(index))
        } else {
          utf32String.push(UTF32CodeUnit.fromUTF16CodePoint(
            value.charCodeAt(index),
            value.charCodeAt(index + 1)
          ))

          index += 1
        }
      }

      expect(utf32String.equalsToString('The éö"lõtï jump over 🦰 ! ')).toBeFalsy()
    })

    /**
     * 
     */
    it('returns false if both the value of an UTF32String and the given string are different', function () {
      const value: string = 'The éö"lõtï jump over 🦰 !'
      const utf32String: UTF32String = UTF32String.allocate(value.length)

      for (let index = 0; index < value.length; ++index) {
        if (UTF16CodeUnit.isNonSurrogate(value.charCodeAt(index))) {
          utf32String.push(value.charCodeAt(index))
        } else {
          utf32String.push(UTF32CodeUnit.fromUTF16CodePoint(
            value.charCodeAt(index),
            value.charCodeAt(index + 1)
          ))

          index += 1
        }
      }

      expect(utf32String.equalsToString('The éö"lõtï jumi over 🦰 !')).toBeFalsy()
    })

    /**
     * 
     */
    it('allows to ignore a part of the string', function () {
      const value: string = 'The éö"lõtï jump over 🦰 !'
      const utf32String: UTF32String = UTF32String.fromString(value)

      expect(utf32String.equalsToString(value.substring(4, 10), 4, 10)).toBeTruthy()
    })

    /**
     * 
     */
    it('clamp to zero the bounding parameters if necessary', function () {
      const value: string = 'The éö"lõtï jump over 🦰 !'
      const utf32String: UTF32String = UTF32String.fromString(value)

      expect(utf32String.equalsToString(value.substring(0, 10), -10, 10)).toBeTruthy()
    })

    /**
     * 
     */
    it('clamp to the size the bounding parameters if necessary', function () {
      const value: string = 'The éö"lõtï jump over 🦰 !'
      const utf32String: UTF32String = UTF32String.fromString(value)

      expect(utf32String.equalsToString(value.substring(5), 5, 200)).toBeTruthy()
    })

    /**
     * 
     */
    it('inverts the bounding parameters if necessary', function () {
      const value: string = 'The éö"lõtï jump over 🦰 !'
      const utf32String: UTF32String = UTF32String.fromString(value)

      expect(utf32String.equalsToString(value.substring(4, 10), 10, 4)).toBeTruthy()
    })
  })

  /**
   * 
   */
  describe('prototype.fromString', function () {
    /**
     * @see https://www.compart.com/fr/unicode/U+00E9
     */
    it('return an UTF32String equivalent to the given string', function () {
      const utf32String: UTF32String = UTF32String.fromString('The éö"lõtï jump over 🦰 !')
      expect(utf32String.equalsToString('The éö"lõtï jump over 🦰 !')).toBeTruthy()
    })
  })

  /**
   * 
   */
  describe('prototype.setString', function () {
    /**
     * 
     */
    it('replace the content of the given UTF32String by the content of the given javascript string', function () {
      const previous: string = 'The éö"lõtï jump over 🦰 !'
      const next: string = 'Bÿu<oE🏼 🦲 !'
      const utf32String: UTF32String = UTF32String.fromString(previous)
      expect(utf32String.equalsToString(previous)).toBeTruthy()
      utf32String.setString(next)
      expect(utf32String.equalsToString(next)).toBeTruthy()
    })
  })


  /**
   * 
   */
  describe('prototype.fromUTF16String', function () {
    /**
     * 
     */
    it('returns an UTF32String equivalent to the given UTF16 string', function () {
      const utf32String: UTF32String = UTF32String.fromUTF16String(UTF16String.fromString('The éö"lõtï jump over 🦰 !'))
      expect(utf32String.equalsToString('The éö"lõtï jump over 🦰 !')).toBeTruthy()
    })
  })


  /**
   * 
   */
  describe('prototype.setUTF16String', function () {
    /**
     * 
     */
    it('replaces the content of the given UTF32String by the content of the given UTF16String string', function () {
      const previous: string = 'The éö"lõtï jump over 🦰 !'
      const next: string = 'Bÿu<oE🏼 🦲 !'
      const utf32String: UTF32String = UTF32String.fromString(previous)
      expect(utf32String.equalsToString(previous)).toBeTruthy()
      utf32String.setUTF16String(UTF16String.fromString(next))
      expect(utf32String.equalsToString(next)).toBeTruthy()
    })
  })


  /**
   * 
   */
  describe('prototype.concatString', function () {
    /**
     * 
     */
    it('appends the content of the given javascript string to the end of the UTF32String instance', function () {
      const value: string = 'The éö"lõtï jump over 🦰 !'
      const utf32String: UTF32String = UTF32String.fromString(value.substring(0, 6))
      expect(utf32String.equalsToString(value.substring(0, 6))).toBeTruthy()
      utf32String.concatString(value.substring(6))
      expect(utf32String.equalsToString(value)).toBeTruthy()
    })
  })

  /**
   * 
   */
  describe('prototype.substring', function () {
    /**
     * 
     */
    it('replaces the content of the current instance by a substring of it', function () {
      const previous: string = 'The éö"lõtï jump over 🦰 !'
      const utf32String: UTF32String = UTF32String.fromString(previous)
      expect(utf32String.equalsToString(previous)).toBeTruthy()
      utf32String.substring(4, 10)
      expect(utf32String.equalsToString(previous.substring(4, 10))).toBeTruthy()
    })

    /**
     * 
     */
    it('makes negatives indices equals to zero', function () {
      const previous: string = 'The éö"lõtï jump over 🦰 !'
      const utf32String: UTF32String = UTF32String.fromString(previous)
      expect(utf32String.equalsToString(previous)).toBeTruthy()
      utf32String.substring(-4, 5)
      expect(utf32String.equalsToString(previous.substring(0, 5))).toBeTruthy()
    })

    /**
     * 
     */
    it('makes out of bounds indices equals to size', function () {
      const previous: string = 'The éö"lõtï UTF32String over 🦰 !'
      const utf32String: UTF32String = UTF32String.fromString(previous)
      expect(utf32String.equalsToString(previous)).toBeTruthy()
      utf32String.substring(4, 200)
      expect(utf32String.equalsToString(previous.substring(4))).toBeTruthy()
    })

    /**
     * 
     */
    it('reverses inverted boundaries', function () {
      const previous: string = 'The éö"lõtï jump over 🦰 !'
      const utf32String: UTF32String = UTF32String.fromString(previous)
      expect(utf32String.equalsToString(previous)).toBeTruthy()
      utf32String.substring(15, 4)
      expect(utf32String.equalsToString(previous.substring(4, 15))).toBeTruthy()
    })

    /**
     * 
     */
    it('returns an empty string if start === end', function () {
      const previous: string = 'The éö"lõtï jump over 🦰 !'
      const utf32String: UTF32String = UTF32String.fromString(previous)
      expect(utf32String.equalsToString(previous)).toBeTruthy()
      utf32String.substring(15, 15)
      expect(utf32String.equalsToString('')).toBeTruthy()
    })
  })


  /**
   * 
   */
  describe('prototype.toString', function () {
    /**
     * 
     */
    it('returns the content of a given utf32String as a javascript string', function () {
      const content: string = 'The E🏼 éö"l🦲ï jump over 🦰 !'
      const utf32String: UTF32String = UTF32String.fromString(content)
      expect(utf32String.toString()).toBe(content)
    })
  })

  /**
   * 
   */
  describe('prototype.UTF16Size', function () {
    /**
     * 
     */
    it('return the size of a given UTF32String as if it was an utf32String', function () {
      const content: string = 'The E🏼 éö"l🦲ï jump over 🦰 !'
      const utf32String: UTF32String = UTF32String.fromString(content)
      expect(utf32String.UTF16Size).toBe(content.length)
    })
  })
})
