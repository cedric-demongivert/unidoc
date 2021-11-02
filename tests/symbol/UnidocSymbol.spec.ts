/** eslint-env jest */

import { UnidocPath } from '../../sources/origin/UnidocPath'
import { UnidocRange } from '../../sources/origin/UnidocRange'
import { UnidocSymbol } from '../../sources/symbol/UnidocSymbol'
import { UTF32CodeUnit } from '../../sources/symbol/UTF32CodeUnit'

describe('UnidocSymbol', function () {
  describe('#constructor', function () {
    it('instantiate an empty symbol by default', function () {
      const symbol: UnidocSymbol = new UnidocSymbol()

      expect(symbol.code).toBe(0)
      expect(symbol.origin.equals(new UnidocPath())).toBeTruthy()
    })
  })

  describe('#copy', function () {
    it('copy an existing symbol', function () {
      const source: UnidocSymbol = UnidocSymbol.create(
        UTF32CodeUnit.LATIN_SMALL_LETTER_B,
        UnidocPath.create()
          .inFile('index.unidoc', UnidocRange.betweenCoordinates(5, 10, 254, 5, 11, 255))
      )

      const copy: UnidocSymbol = UnidocSymbol.create(
        UTF32CodeUnit.LATIN_SMALL_LETTER_B,
        UnidocPath.create()
          .inFile('index.unidoc', UnidocRange.betweenCoordinates(5, 10, 254, 5, 11, 255))
      )

      const destination: UnidocSymbol = UnidocSymbol.create(
        UTF32CodeUnit.LATIN_SMALL_LETTER_D,
        UnidocPath.create()
          .inFile('index.unidoc', UnidocRange.betweenCoordinates(5, 10, 254, 5, 11, 255))
      )

      expect(source.equals(destination)).toBeFalsy()
      expect(source.equals(copy)).toBeTruthy()

      destination.copy(source)

      expect(source.equals(destination)).toBeTruthy()
      expect(source.equals(copy)).toBeTruthy()
    })
  })

  describe('#clone', function () {
    it('return a clone of an existing symbol', function () {
      const source: UnidocSymbol = UnidocSymbol.create(
        UTF32CodeUnit.LATIN_SMALL_LETTER_B,
        UnidocPath.create()
          .inFile('index.unidoc', UnidocRange.betweenCoordinates(5, 10, 254, 5, 11, 255))
      )

      expect(source.equals(source.clone())).toBeTruthy()
      expect(source === source.clone()).toBeFalsy()
    })
  })

  describe('#clear', function () {
    it('reset a symbol instance', function () {
      const instance: UnidocSymbol = UnidocSymbol.create(
        UTF32CodeUnit.LATIN_SMALL_LETTER_B,
        UnidocPath.create()
          .inFile('index.unidoc', UnidocRange.betweenCoordinates(5, 10, 254, 5, 11, 255))
      )

      const origin: UnidocSymbol = new UnidocSymbol()

      expect(instance.equals(origin)).toBeFalsy()

      instance.clear()

      expect(instance.equals(origin)).toBeTruthy()
    })
  })

  describe('#equals', function () {
    it('return false if compared to another type of value', function () {
      const instance: UnidocSymbol = UnidocSymbol.create(
        UTF32CodeUnit.LATIN_SMALL_LETTER_B,
        UnidocPath.create()
          .inFile('index.unidoc', UnidocRange.betweenCoordinates(5, 10, 254, 5, 11, 255))
      )

      expect(instance.equals('pwet')).toBeFalsy()
      expect(instance.equals(5)).toBeFalsy()
      expect(instance.equals(Symbol())).toBeFalsy()
    })

    it('return true if compared to itself', function () {
      const instance: UnidocSymbol = UnidocSymbol.create(
        UTF32CodeUnit.LATIN_SMALL_LETTER_B,
        UnidocPath.create()
          .inFile('index.unidoc', UnidocRange.betweenCoordinates(5, 10, 254, 5, 11, 255))
      )

      expect(instance.equals(instance)).toBeTruthy()
    })

    it('return true if both symbols are equals', function () {
      const instance: UnidocSymbol = UnidocSymbol.create(
        UTF32CodeUnit.LATIN_SMALL_LETTER_B,
        UnidocPath.create()
          .inFile('index.unidoc', UnidocRange.betweenCoordinates(5, 10, 254, 5, 11, 255))
      )

      const copy: UnidocSymbol = UnidocSymbol.create(
        UTF32CodeUnit.LATIN_SMALL_LETTER_B,
        UnidocPath.create()
          .inFile('index.unidoc', UnidocRange.betweenCoordinates(5, 10, 254, 5, 11, 255))
      )

      expect(instance.equals(copy)).toBeTruthy()
    })

    it('return false if the symbol change', function () {
      const instance: UnidocSymbol = UnidocSymbol.create(
        UTF32CodeUnit.LATIN_SMALL_LETTER_B,
        UnidocPath.create()
          .inFile('index.unidoc', UnidocRange.betweenCoordinates(5, 10, 254, 5, 11, 255))
      )

      const other: UnidocSymbol = UnidocSymbol.create(
        UTF32CodeUnit.LATIN_SMALL_LETTER_D,
        UnidocPath.create()
          .inFile('index.unidoc', UnidocRange.betweenCoordinates(5, 10, 254, 5, 11, 255))
      )

      expect(instance.equals(other)).toBeFalsy()
    })

    it('return false if the location change', function () {
      const instance: UnidocSymbol = UnidocSymbol.create(
        UTF32CodeUnit.LATIN_SMALL_LETTER_B,
        UnidocPath.create()
          .inFile('index.unidoc', UnidocRange.betweenCoordinates(5, 10, 254, 5, 11, 255))
      )

      const other: UnidocSymbol = UnidocSymbol.create(
        UTF32CodeUnit.LATIN_SMALL_LETTER_B,
        UnidocPath.create()
          .inFile('index.unidoc', UnidocRange.betweenCoordinates(5, 10, 254, 5, 11, 255))
      )

      expect(instance.equals(other)).toBeFalsy()
    })
  })
})
