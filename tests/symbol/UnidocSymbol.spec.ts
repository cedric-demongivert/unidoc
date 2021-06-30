/** eslint-env jest */

import { UnidocRangeOrigin } from '../../sources/origin/UnidocRangeOrigin'
import { UnidocSymbol } from '../../sources/symbol/UnidocSymbol'
import { CodePoint } from '../../sources/symbol/CodePoint'

describe('UnidocSymbol', function () {
  describe('#constructor', function () {
    it('instantiate an empty symbol by default', function () {
      const symbol: UnidocSymbol = new UnidocSymbol()

      expect(symbol.code).toBe(0)
      expect(symbol.origin.equals(UnidocRangeOrigin.runtime())).toBeTruthy()
    })
  })

  describe('#copy', function () {
    it('copy an existing symbol', function () {
      const source: UnidocSymbol = UnidocSymbol.create(
        CodePoint.b,
        UnidocRangeOrigin.builder()
          .from().text(5, 10, 254).at().runtime()
          .to().text(5, 11, 255).at().runtime()
          .build()
      )

      const copy: UnidocSymbol = UnidocSymbol.create(
        CodePoint.b,
        UnidocRangeOrigin.builder()
          .from().text(5, 10, 254).at().runtime()
          .to().text(5, 11, 255).at().runtime()
          .build()
      )

      const destination: UnidocSymbol = UnidocSymbol.create(
        CodePoint.d,
        UnidocRangeOrigin.builder()
          .from().text(1, 2, 33).at().runtime()
          .to().text(1, 3, 34).at().runtime()
          .build()
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
        CodePoint.b,
        UnidocRangeOrigin.builder()
          .from().text(5, 10, 254).at().runtime()
          .to().text(5, 11, 255).at().runtime()
          .build()
      )

      expect(source.equals(source.clone())).toBeTruthy()
      expect(source === source.clone()).toBeFalsy()
    })
  })

  describe('#clear', function () {
    it('reset a symbol instance', function () {
      const instance: UnidocSymbol = UnidocSymbol.create(
        CodePoint.b,
        UnidocRangeOrigin.builder()
          .from().text(5, 10, 254).at().runtime()
          .to().text(5, 11, 255).at().runtime()
          .build()
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
        CodePoint.b,
        UnidocRangeOrigin.builder()
          .from().text(5, 10, 254).at().runtime()
          .to().text(5, 11, 255).at().runtime()
          .build()
      )

      expect(instance.equals('pwet')).toBeFalsy()
      expect(instance.equals(5)).toBeFalsy()
      expect(instance.equals(Symbol())).toBeFalsy()
    })

    it('return true if compared to itself', function () {
      const instance: UnidocSymbol = UnidocSymbol.create(
        CodePoint.b,
        UnidocRangeOrigin.builder()
          .from().text(5, 10, 254).at().runtime()
          .to().text(5, 11, 255).at().runtime()
          .build()
      )

      expect(instance.equals(instance)).toBeTruthy()
    })

    it('return true if both symbols are equals', function () {
      const instance: UnidocSymbol = UnidocSymbol.create(
        CodePoint.b,
        UnidocRangeOrigin.builder()
          .from().text(5, 10, 254).at().runtime()
          .to().text(5, 11, 255).at().runtime()
          .build()
      )

      const copy: UnidocSymbol = UnidocSymbol.create(
        CodePoint.b,
        UnidocRangeOrigin.builder()
          .from().text(5, 10, 254).at().runtime()
          .to().text(5, 11, 255).at().runtime()
          .build()
      )

      expect(instance.equals(copy)).toBeTruthy()
    })

    it('return false if the symbol change', function () {
      const instance: UnidocSymbol = UnidocSymbol.create(
        CodePoint.b,
        UnidocRangeOrigin.builder()
          .from().text(5, 10, 254).at().runtime()
          .to().text(5, 11, 255).at().runtime()
          .build()
      )

      const other: UnidocSymbol = UnidocSymbol.create(
        CodePoint.d,
        UnidocRangeOrigin.builder()
          .from().text(5, 10, 254).at().runtime()
          .to().text(5, 11, 255).at().runtime()
          .build()
      )

      expect(instance.equals(other)).toBeFalsy()
    })

    it('return false if the location change', function () {
      const instance: UnidocSymbol = UnidocSymbol.create(
        CodePoint.b,
        UnidocRangeOrigin.builder()
          .from().text(5, 10, 254).at().runtime()
          .to().text(5, 11, 255).at().runtime()
          .build()
      )

      const other: UnidocSymbol = UnidocSymbol.create(
        CodePoint.b,
        UnidocRangeOrigin.builder()
          .from().text(5, 10, 3).at().runtime()
          .to().text(5, 11, 4).at().runtime()
          .build()
      )

      expect(instance.equals(other)).toBeFalsy()
    })
  })
})
