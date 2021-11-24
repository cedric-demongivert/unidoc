/** eslint-env jest */

import { UnidocRange } from '../../sources/origin/UnidocRange'
import { UnidocSymbol } from '../../sources/symbol/UnidocSymbol'
import { UTF32CodeUnit } from '../../sources/symbol/UTF32CodeUnit'
import { Random } from '../../sources/Random'
import { UnidocOrigin } from '../../sources/origin/UnidocOrigin'
import { UnidocURI } from '../../sources/origin/UnidocURI'
import { UnidocLocation } from '../../sources/origin/UnidocLocation'

/**
 * 
 */
function givenAnySymbol(seed: number = Random.getSeed()): UnidocSymbol {
  Random.setSeed(seed)
  const column: number = Random.nextPositiveInteger(50)
  const row: number = Random.nextPositiveInteger(100)

  const location: UnidocLocation = new UnidocLocation(
    column, row, column + row * 2 + Random.nextPositiveInteger(25 * row)
  )

  return UnidocSymbol.create(
    Random.nextElement(UTF32CodeUnit.LATIN_SMALL_LETTER_A_Z),
    UnidocOrigin.create(
      UnidocURI.create('file').pushPath('index.unidoc'),
      UnidocRange.fromLocation(location).toLocation(location.next())
    )
  )
}

/**
 * 
 */
function givenAnySymbolTwice(seed: number = Random.getSeed()): [UnidocSymbol, UnidocSymbol] {
  return [givenAnySymbol(seed), givenAnySymbol(seed)]
}

describe('UnidocSymbol', function () {
  describe('#constructor', function () {
    it('instantiate an empty symbol by default', function () {
      const symbol: UnidocSymbol = new UnidocSymbol()

      expect(symbol.code).toBe(0)
      expect(symbol.origin.equals(new UnidocOrigin())).toBeTruthy()
    })
  })

  describe('#copy', function () {
    it('copy an existing symbol', function () {
      const source: UnidocSymbol = givenAnySymbol()
      const destination: UnidocSymbol = new UnidocSymbol()

      expect(destination.equals(source)).toBeFalsy()

      destination.copy(source)

      expect(destination.equals(source)).toBeTruthy()
    })
  })

  describe('#clone', function () {
    it('return a clone of an existing symbol', function () {
      const source: UnidocSymbol = givenAnySymbol()

      expect(source.equals(source.clone())).toBeTruthy()
      expect(source === source.clone()).toBeFalsy()
    })
  })

  describe('#clear', function () {
    it('reset a symbol instance', function () {
      const instance: UnidocSymbol = givenAnySymbol()
      const origin: UnidocSymbol = new UnidocSymbol()

      expect(instance.equals(origin)).toBeFalsy()

      instance.clear()

      expect(instance.equals(origin)).toBeTruthy()
    })
  })

  describe('#equals', function () {
    it('return false if compared to another type of value', function () {
      const instance: UnidocSymbol = givenAnySymbol()

      expect(instance.equals('pwet')).toBeFalsy()
      expect(instance.equals(5)).toBeFalsy()
      expect(instance.equals(Symbol())).toBeFalsy()
    })

    it('return true if compared to itself', function () {
      const instance: UnidocSymbol = givenAnySymbol()

      expect(instance.equals(instance)).toBeTruthy()
    })

    it('return true if both symbols are equals', function () {
      const [instance, copy] = givenAnySymbolTwice()

      expect(instance.equals(copy)).toBeTruthy()
    })

    it('return false if the symbol change', function () {
      const [instance, other] = givenAnySymbolTwice()
      other.code += 1

      expect(instance.equals(other)).toBeFalsy()
    })

    it('return false if the location change', function () {
      const [instance, other] = givenAnySymbolTwice()
      other.origin.range.end.next()

      expect(instance.equals(other)).toBeFalsy()
    })
  })
})
