/** eslint-env jest */

import { UnidocOrigin } from '../../sources/origin/UnidocOrigin'
import { UnidocSymbol } from '../../sources/symbol/UnidocSymbol'
import { UTF32CodeUnit } from '../../sources/symbol/UTF32CodeUnit'

import '../matchers'

/**
 * 
 */
describe('UnidocSymbol', function () {
  /**
   * 
   */
  it('instantiate an empty symbol by default', function () {
    expect(new UnidocSymbol()).toBeSymbol(UTF32CodeUnit.NULL)
  })

  /**
   * 
   */
  describe('prototype.copy', function () {
    /**
     * 
     */
    it('copy an instance', function copyAnInstance() {
      const source: UnidocSymbol = new UnidocSymbol(
        UTF32CodeUnit.LATIN_CAPITAL_LETTER_R,
        UnidocOrigin.fromRuntime(copyAnInstance).atCoordinates(0, 5, 145)
      )

      const destination: UnidocSymbol = new UnidocSymbol()

      expect(destination).not.toBeSymbol(source)

      destination.copy(source)

      expect(destination).toBeSymbol(source)
    })
  })

  /**
   * 
   */
  describe('prototype.clone', function () {
    /**
     * 
     */
    it('returns a copy', function returnsACopy() {
      const source: UnidocSymbol = new UnidocSymbol(
        UTF32CodeUnit.LATIN_CAPITAL_LETTER_R,
        UnidocOrigin.fromRuntime(returnsACopy).atCoordinates(0, 5, 145)
      )

      expect(source).toBeSymbol(source.clone())
      expect(source).not.toBe(source.clone())
    })
  })

  /**
   * 
   */
  describe('prototype.clear', function () {
    /**
     * 
     */
    it('reset an instance', function resetsAnInstance() {
      const source: UnidocSymbol = new UnidocSymbol(
        UTF32CodeUnit.LATIN_CAPITAL_LETTER_R,
        UnidocOrigin.fromRuntime(resetsAnInstance).atCoordinates(0, 5, 145)
      )

      expect(source).not.toBeSymbol(UnidocSymbol.DEFAULT)

      source.clear()

      expect(source).toBeSymbol(UnidocSymbol.DEFAULT)
    })
  })

  /**
   * 
   */
  describe('prototype.equals', function () {
    /**
     * 
     */
    it('returns false if compared to value of another type', function returnsFalseIfComparedToValueOfAnotherType() {
      const instance: UnidocSymbol = new UnidocSymbol(
        UTF32CodeUnit.LATIN_CAPITAL_LETTER_R,
        UnidocOrigin.fromRuntime(returnsFalseIfComparedToValueOfAnotherType).atCoordinates(0, 5, 145)
      )

      expect(instance.equals('pwet')).toBeFalsy()
      expect(instance.equals(5)).toBeFalsy()
      expect(instance.equals(Symbol())).toBeFalsy()
    })

    /**
     * 
     */
    it('returns true if compared to itself', function returnsTrueIfComparedToItself() {
      const instance: UnidocSymbol = new UnidocSymbol(
        UTF32CodeUnit.LATIN_CAPITAL_LETTER_R,
        UnidocOrigin.fromRuntime(returnsTrueIfComparedToItself).atCoordinates(0, 5, 145)
      )

      expect(instance.equals(instance)).toBeTruthy()
    })

    /**
     * 
     */
    it('returns true if both symbols are equals', function returnsTrueIfBothSymbolsAreEquals() {
      const instance: UnidocSymbol = new UnidocSymbol(
        UTF32CodeUnit.LATIN_CAPITAL_LETTER_R,
        UnidocOrigin.fromRuntime(returnsTrueIfBothSymbolsAreEquals).atCoordinates(0, 5, 145)
      )

      const copy: UnidocSymbol = new UnidocSymbol(
        UTF32CodeUnit.LATIN_CAPITAL_LETTER_R,
        UnidocOrigin.fromRuntime(returnsTrueIfBothSymbolsAreEquals).atCoordinates(0, 5, 145)
      )

      expect(instance.equals(copy)).toBeTruthy()
    })

    /**
     * 
     */
    it('returns false if the symbol change', function returnsFalseIfTheSymbolChange() {
      const instance: UnidocSymbol = new UnidocSymbol(
        UTF32CodeUnit.LATIN_CAPITAL_LETTER_R,
        UnidocOrigin.fromRuntime(returnsFalseIfTheSymbolChange).atCoordinates(0, 5, 145)
      )

      const other: UnidocSymbol = new UnidocSymbol(
        UTF32CodeUnit.LATIN_CAPITAL_LETTER_R,
        UnidocOrigin.fromRuntime(returnsFalseIfTheSymbolChange).atCoordinates(0, 5, 145)
      )

      other.code += 1

      expect(instance.equals(other)).toBeFalsy()
    })

    /**
     * 
     */
    it('returns false if the location change', function returnsFalseIfTheLocationChange() {
      const instance: UnidocSymbol = new UnidocSymbol(
        UTF32CodeUnit.LATIN_CAPITAL_LETTER_R,
        UnidocOrigin.fromRuntime(returnsFalseIfTheLocationChange).atCoordinates(0, 5, 145)
      )

      const other: UnidocSymbol = new UnidocSymbol(
        UTF32CodeUnit.LATIN_CAPITAL_LETTER_R,
        UnidocOrigin.fromRuntime(returnsFalseIfTheLocationChange).atCoordinates(0, 5, 145)
      )

      other.origin.range.end.next()

      expect(instance.equals(other)).toBeFalsy()
    })
  })
})
