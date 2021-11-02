/** eslint-env jest */

import { UTF16String } from '../../sources/symbol/UTF16String'
import { UTF32String } from '../../sources/symbol/UTF32String'

describe('UTF16String', function () {
  describe('#equalsToString', function () {
    it('return true if both the value of an UTF16String and the given string are equals', function () {
      const value: string = 'The éö"lõtï jump over 🦰 !'
      const utf16String: UTF16String = UTF16String.allocate(value.length)

      for (let index = 0; index < value.length; ++index) {
        utf16String.push(value.charCodeAt(index))
      }

      expect(utf16String.equalsToString('The éö"lõtï jump over 🦰 !')).toBeTruthy()
    })

    it('return false if the given string has a different length', function () {
      const value: string = 'The éö"lõtï jump over 🦰 !'
      const utf16String: UTF16String = UTF16String.allocate(value.length)

      for (let index = 0; index < value.length; ++index) {
        utf16String.push(value.charCodeAt(index))
      }

      expect(utf16String.equalsToString('The éö"lõtï jump over 🦰 ! ')).toBeFalsy()
    })

    it('return false if both the value of an UTF16String and the given string are different', function () {
      const value: string = 'The éö"lõtï jump over 🦰 !'
      const utf16String: UTF16String = UTF16String.allocate(value.length)

      for (let index = 0; index < value.length; ++index) {
        utf16String.push(value.charCodeAt(index))
      }

      expect(utf16String.equalsToString('The éö"lõtï jumi over 🦰 !')).toBeFalsy()
    })

    it('allows to ignore a part of the string', function () {
      const value: string = 'The éö"lõtï jump over 🦰 !'
      const utf16String: UTF16String = UTF16String.fromString(value)

      expect(utf16String.equalsToString(value.substring(4, 10), 4, 10)).toBeTruthy()
    })

    it('clamp to zero the bounding parameters if necessary', function () {
      const value: string = 'The éö"lõtï jump over 🦰 !'
      const utf16String: UTF16String = UTF16String.fromString(value)

      expect(utf16String.equalsToString(value.substring(0, 10), -10, 10)).toBeTruthy()
    })

    it('clamp to the size the bounding parameters if necessary', function () {
      const value: string = 'The éö"lõtï jump over 🦰 !'
      const utf16String: UTF16String = UTF16String.fromString(value)

      expect(utf16String.equalsToString(value.substring(5), 5, 200)).toBeTruthy()
    })

    it('invert the bounding parameters if necessary', function () {
      const value: string = 'The éö"lõtï jump over 🦰 !'
      const utf16String: UTF16String = UTF16String.fromString(value)

      expect(utf16String.equalsToString(value.substring(4, 10), 10, 4)).toBeTruthy()
    })
  })

  describe('#fromString', function () {
    it('return an UTF16String equivalent to the given string', function () {
      const utf16String: UTF16String = UTF16String.fromString('The éö"lõtï jump over 🦰 !')
      expect(utf16String.equalsToString('The éö"lõtï jump over 🦰 !')).toBeTruthy()
    })
  })

  describe('#setString', function () {
    it('replace the content of the given UTF16String by the content of the given javascript string', function () {
      const previous: string = 'The éö"lõtï jump over 🦰 !'
      const next: string = 'Bÿu<oE🏼 🦲 !'
      const utf16String: UTF16String = UTF16String.fromString(previous)
      expect(utf16String.equalsToString(previous)).toBeTruthy()
      utf16String.setString(next)
      expect(utf16String.equalsToString(next)).toBeTruthy()
    })
  })

  describe('#concatString', function () {
    it('append the content of the given javascript string to the end of the UTF16String instance', function () {
      const value: string = 'The éö"lõtï jump over 🦰 !'
      const utf16String: UTF16String = UTF16String.fromString(value.substring(0, 6))
      expect(utf16String.equalsToString(value.substring(0, 6))).toBeTruthy()
      utf16String.concatString(value.substring(6))
      expect(utf16String.equalsToString(value)).toBeTruthy()
    })
  })

  describe('#fromUTF32String', function () {
    it('return an UTF16String equivalent to the given UTF32String', function () {
      const utf16String: UTF16String = UTF16String.fromUTF32String(UTF32String.fromString('The éö"lõtï jump over 🦰 !'))
      expect(utf16String.equalsToString('The éö"lõtï jump over 🦰 !')).toBeTruthy()
    })
  })

  describe('#setUTF32String', function () {
    it('replace the content of the given UTF16String by the content of the given UTF32String', function () {
      const previous: string = 'The éö"lõtï jump over 🦰 !'
      const next: string = 'Bÿu<oE🏼 🦲 !'
      const utf16String: UTF16String = UTF16String.fromString(previous)
      expect(utf16String.equalsToString(previous)).toBeTruthy()
      utf16String.setUTF32String(UTF32String.fromString(next))
      expect(utf16String.equalsToString(next)).toBeTruthy()
    })
  })

  describe('#substring', function () {
    it('replace the content of the current instance by a substring of it', function () {
      const previous: string = 'The éö"lõtï jump over 🦰 !'
      const utf16String: UTF16String = UTF16String.fromString(previous)
      expect(utf16String.equalsToString(previous)).toBeTruthy()
      utf16String.substring(4, 10)
      expect(utf16String.equalsToString(previous.substring(4, 10))).toBeTruthy()
    })

    it('make negatives indices equals to zero', function () {
      const previous: string = 'The éö"lõtï jump over 🦰 !'
      const utf16String: UTF16String = UTF16String.fromString(previous)
      expect(utf16String.equalsToString(previous)).toBeTruthy()
      utf16String.substring(-4, 5)
      expect(utf16String.equalsToString(previous.substring(0, 5))).toBeTruthy()
    })

    it('make out of bounds indices equals to size', function () {
      const previous: string = 'The éö"lõtï jump over 🦰 !'
      const utf16String: UTF16String = UTF16String.fromString(previous)
      expect(utf16String.equalsToString(previous)).toBeTruthy()
      utf16String.substring(4, 200)
      expect(utf16String.equalsToString(previous.substring(4))).toBeTruthy()
    })

    it('reverse inverted boundaries', function () {
      const previous: string = 'The éö"lõtï jump over 🦰 !'
      const utf16String: UTF16String = UTF16String.fromString(previous)
      expect(utf16String.equalsToString(previous)).toBeTruthy()
      utf16String.substring(15, 4)
      expect(utf16String.equalsToString(previous.substring(4, 15))).toBeTruthy()
    })

    it('return an empty string if start === end', function () {
      const previous: string = 'The éö"lõtï jump over 🦰 !'
      const utf16String: UTF16String = UTF16String.fromString(previous)
      expect(utf16String.equalsToString(previous)).toBeTruthy()
      utf16String.substring(15, 15)
      expect(utf16String.equalsToString('')).toBeTruthy()
    })
  })

  describe('#toString', function () {
    it('return the content of a given UTF16String as a javascript string', function () {
      const content: string = 'The E🏼 éö"l🦲ï jump over 🦰 !'
      const utf16String: UTF16String = UTF16String.fromString(content)
      expect(utf16String.toString()).toBe(content)
    })
  })

  describe('#get UTF32Size', function () {
    it('return the size of a given UTF16String as if it was an utf16String', function () {
      const content: string = 'The E🏼 éö"l🦲ï jump over 🦰 !'
      const utf16String: UTF16String = UTF16String.fromString(content)
      expect(utf16String.UTF32Size).toBe(content.length - 3)
    })
  })
})
