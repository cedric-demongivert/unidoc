/** eslint-env jest */

import { Pack } from '@cedric-demongivert/gl-tool-collection'

import { UnidocSymbol } from '../../sources/symbol/UnidocSymbol'
import { UTF32CodeUnit } from '../../sources/symbol/UTF32CodeUnit'
import { UTF32String } from '../../sources/symbol/UTF32String'
import { UnidocSymbols } from '../../sources/symbol/UnidocSymbols'
import { UnidocOrigin } from '../../sources/origin/UnidocOrigin'
import { Random } from '../../sources/Random'
import { UnidocLocation } from '../../sources/origin/UnidocLocation'
import { UTF16String } from '../../sources/symbol/UTF16String'

/**
 * 
 */
function givenAnyCombinationOfNonLinebreakingUTF32CodeUnit(): UTF32CodeUnit[] {
  return Random.nextElements(UTF32CodeUnit.LATIN_SMALL_LETTER_A_Z, 5 + Random.nextPositiveInteger(10))
}

/**
 * 
 */
function givenAnyCombinationOfUTF32CodeUnitWithNewlines(): UTF32CodeUnit[] {
  return [
    ...Random.nextElements(UTF32CodeUnit.LATIN_SMALL_LETTER_A_Z, Random.nextPositiveInteger(4)),
    UTF32CodeUnit.NEW_LINE,
    ...Random.nextElements(UTF32CodeUnit.LATIN_SMALL_LETTER_A_Z, 1 + Random.nextPositiveInteger(4)),
    UTF32CodeUnit.NEW_LINE,
    ...Random.nextElements(UTF32CodeUnit.LATIN_SMALL_LETTER_A_Z, Random.nextPositiveInteger(4)),
    UTF32CodeUnit.NEW_LINE,
    UTF32CodeUnit.NEW_LINE,
    ...Random.nextElements(UTF32CodeUnit.LATIN_SMALL_LETTER_A_Z, Random.nextPositiveInteger(4))
  ]
}

/**
 * 
 */
function givenAnyCombinationOfUTF32CodeUnitWithCarriageReturn(): UTF32CodeUnit[] {
  return [
    ...Random.nextElements(UTF32CodeUnit.LATIN_SMALL_LETTER_A_Z, Random.nextPositiveInteger(4)),
    UTF32CodeUnit.CARRIAGE_RETURN,
    ...Random.nextElements(UTF32CodeUnit.LATIN_SMALL_LETTER_A_Z, 1 + Random.nextPositiveInteger(4)),
    UTF32CodeUnit.CARRIAGE_RETURN,
    ...Random.nextElements(UTF32CodeUnit.LATIN_SMALL_LETTER_A_Z, Random.nextPositiveInteger(4)),
    UTF32CodeUnit.CARRIAGE_RETURN,
    UTF32CodeUnit.CARRIAGE_RETURN,
    ...Random.nextElements(UTF32CodeUnit.LATIN_SMALL_LETTER_A_Z, Random.nextPositiveInteger(4))
  ]
}

/**
 * 
 */
function givenAnyCombinationOfUTF32CodeUnitWithNewlinesequence(): UTF32CodeUnit[] {
  return [
    ...Random.nextElements(UTF32CodeUnit.LATIN_SMALL_LETTER_A_Z, Random.nextPositiveInteger(4)),
    UTF32CodeUnit.CARRIAGE_RETURN,
    UTF32CodeUnit.NEW_LINE,
    ...Random.nextElements(UTF32CodeUnit.LATIN_SMALL_LETTER_A_Z, 1 + Random.nextPositiveInteger(4)),
    UTF32CodeUnit.CARRIAGE_RETURN,
    UTF32CodeUnit.NEW_LINE,
    ...Random.nextElements(UTF32CodeUnit.LATIN_SMALL_LETTER_A_Z, Random.nextPositiveInteger(4)),
    UTF32CodeUnit.CARRIAGE_RETURN,
    UTF32CodeUnit.NEW_LINE,
    UTF32CodeUnit.CARRIAGE_RETURN,
    UTF32CodeUnit.NEW_LINE,
    ...Random.nextElements(UTF32CodeUnit.LATIN_SMALL_LETTER_A_Z, Random.nextPositiveInteger(4))
  ]
}


describe('UnidocSymbols', function () {
  describe('#fromString', function () {
    it('emit consecutive non-linebreaking symbols', function () {
      const codes: UTF32CodeUnit[] = givenAnyCombinationOfNonLinebreakingUTF32CodeUnit()
      const text: string = UTF32String.fromCodeUnits(codes, codes.length).toString()
      const result: Pack<UnidocSymbol> = Pack.instance(UnidocSymbol.ALLOCATOR, codes.length)

      for (const symbol of UnidocSymbols.fromString(text)) {
        result.push(symbol)
      }

      expect(result.size).toBe(codes.length)

      const location: UnidocLocation = new UnidocLocation()

      for (let index = 0; index < result.size; ++index) {
        expect(result.get(index).code).toBe(codes[index])

        expect(result.get(index).origin.equals(
          UnidocSymbols.fromString.origin()
            .fromLocation(location)
            .toLocation(location.next())
        )).toBeTruthy()
      }
    })

    it('handle newlines', function () {
      const codes: UTF32CodeUnit[] = givenAnyCombinationOfUTF32CodeUnitWithNewlines()
      const text: string = UTF32String.fromCodeUnits(codes, codes.length).toString()
      const result: Pack<UnidocSymbol> = Pack.instance(UnidocSymbol.ALLOCATOR, codes.length)

      for (const symbol of UnidocSymbols.fromString(text)) {
        result.push(symbol)
      }

      expect(result.size).toBe(codes.length)

      const location: UnidocLocation = new UnidocLocation()

      for (let index = 0; index < result.size; ++index) {
        expect(result.get(index).code).toBe(codes[index])

        const nextOrigin: UnidocOrigin = UnidocSymbols.fromString.origin()
        nextOrigin.fromLocation(location)

        if (codes[index] === UTF32CodeUnit.NEW_LINE) {
          nextOrigin.toLocation(location.break())
        } else {
          nextOrigin.toLocation(location.next())
        }

        expect(result.get(index).origin.equals(nextOrigin)).toBeTruthy()
      }
    })

    it('handle carriage returns', function () {
      const codes: UTF32CodeUnit[] = givenAnyCombinationOfUTF32CodeUnitWithCarriageReturn()
      const text: string = UTF32String.fromCodeUnits(codes, codes.length).toString()
      const result: Pack<UnidocSymbol> = Pack.instance(UnidocSymbol.ALLOCATOR, codes.length)

      for (const symbol of UnidocSymbols.fromString(text)) {
        result.push(symbol)
      }

      expect(result.size).toBe(codes.length)

      const location: UnidocLocation = new UnidocLocation()

      for (let index = 0; index < result.size; ++index) {
        expect(result.get(index).code).toBe(codes[index])

        const nextOrigin: UnidocOrigin = UnidocSymbols.fromString.origin()
        nextOrigin.fromLocation(location)

        if (codes[index] === UTF32CodeUnit.CARRIAGE_RETURN) {
          nextOrigin.toLocation(location.break())
        } else {
          nextOrigin.toLocation(location.next())
        }

        expect(result.get(index).origin.equals(nextOrigin)).toBeTruthy()
      }
    })

    it('handle CL+RF sequence', function () {
      const codes: UTF32CodeUnit[] = givenAnyCombinationOfUTF32CodeUnitWithNewlinesequence()
      const text: string = UTF32String.fromCodeUnits(codes, codes.length).toString()
      const result: Pack<UnidocSymbol> = Pack.instance(UnidocSymbol.ALLOCATOR, codes.length)

      for (const symbol of UnidocSymbols.fromString(text)) {
        result.push(symbol)
      }

      expect(result.size).toBe(codes.length)

      const location: UnidocLocation = new UnidocLocation()

      for (let index = 0; index < result.size; ++index) {
        expect(result.get(index).code).toBe(codes[index])

        const nextOrigin: UnidocOrigin = UnidocSymbols.fromString.origin()
        nextOrigin.fromLocation(location)

        if (codes[index] === UTF32CodeUnit.CARRIAGE_RETURN) {
          nextOrigin.toLocation(location.break())
        } else if (codes[index] === UTF32CodeUnit.NEW_LINE) {
          nextOrigin.toLocation(location.add(0, 0, 1))
        } else {
          nextOrigin.toLocation(location.next())
        }

        expect(result.get(index).origin.equals(nextOrigin)).toBeTruthy()
      }
    })
  })

  describe('#fromUTF32String', function () {
    it('emit consecutive non-linebreaking symbols', function () {
      const codes: UTF32CodeUnit[] = givenAnyCombinationOfNonLinebreakingUTF32CodeUnit()
      const text: UTF32String = UTF32String.fromCodeUnits(codes, codes.length)
      const result: Pack<UnidocSymbol> = Pack.instance(UnidocSymbol.ALLOCATOR, codes.length)

      for (const symbol of UnidocSymbols.fromUTF32String(text)) {
        result.push(symbol)
      }

      expect(result.size).toBe(codes.length)

      const location: UnidocLocation = new UnidocLocation()

      for (let index = 0; index < result.size; ++index) {
        expect(result.get(index).code).toBe(codes[index])
        expect(result.get(index).origin.equals(
          UnidocSymbols.fromUTF32String.origin()
            .fromLocation(location)
            .toLocation(location.next())
        )).toBeTruthy()
      }
    })

    it('handle newlines', function () {
      const codes: UTF32CodeUnit[] = givenAnyCombinationOfUTF32CodeUnitWithNewlines()
      const text: UTF32String = UTF32String.fromCodeUnits(codes, codes.length)
      const result: Pack<UnidocSymbol> = Pack.instance(UnidocSymbol.ALLOCATOR, codes.length)

      for (const symbol of UnidocSymbols.fromUTF32String(text)) {
        result.push(symbol)
      }

      expect(result.size).toBe(codes.length)

      const location: UnidocLocation = new UnidocLocation()

      for (let index = 0; index < result.size; ++index) {
        expect(result.get(index).code).toBe(codes[index])

        const nextOrigin: UnidocOrigin = UnidocSymbols.fromUTF32String.origin()
        nextOrigin.fromLocation(location)

        if (codes[index] === UTF32CodeUnit.NEW_LINE) {
          nextOrigin.toLocation(location.break())
        } else {
          nextOrigin.toLocation(location.next())
        }

        expect(result.get(index).origin.equals(nextOrigin)).toBeTruthy()
      }
    })

    it('handle carriage returns', function () {
      const codes: UTF32CodeUnit[] = givenAnyCombinationOfUTF32CodeUnitWithCarriageReturn()
      const text: UTF32String = UTF32String.fromCodeUnits(codes, codes.length)
      const result: Pack<UnidocSymbol> = Pack.instance(UnidocSymbol.ALLOCATOR, codes.length)

      for (const symbol of UnidocSymbols.fromUTF32String(text)) {
        result.push(symbol)
      }

      expect(result.size).toBe(codes.length)

      const location: UnidocLocation = new UnidocLocation()

      for (let index = 0; index < result.size; ++index) {
        expect(result.get(index).code).toBe(codes[index])

        const nextOrigin: UnidocOrigin = UnidocSymbols.fromUTF32String.origin()
        nextOrigin.fromLocation(location)

        if (codes[index] === UTF32CodeUnit.CARRIAGE_RETURN) {
          nextOrigin.toLocation(location.break())
        } else {
          nextOrigin.toLocation(location.next())
        }

        expect(result.get(index).origin.equals(nextOrigin)).toBeTruthy()
      }
    })

    it('handle CL+RF sequence', function () {
      const codes: UTF32CodeUnit[] = givenAnyCombinationOfUTF32CodeUnitWithNewlinesequence()
      const text: UTF32String = UTF32String.fromCodeUnits(codes, codes.length)
      const result: Pack<UnidocSymbol> = Pack.instance(UnidocSymbol.ALLOCATOR, codes.length)

      for (const symbol of UnidocSymbols.fromUTF32String(text)) {
        result.push(symbol)
      }

      expect(result.size).toBe(codes.length)

      const location: UnidocLocation = new UnidocLocation()

      for (let index = 0; index < result.size; ++index) {
        expect(result.get(index).code).toBe(codes[index])

        const nextOrigin: UnidocOrigin = UnidocSymbols.fromUTF32String.origin()
        nextOrigin.fromLocation(location)

        if (codes[index] === UTF32CodeUnit.CARRIAGE_RETURN) {
          nextOrigin.toLocation(location.break())
        } else if (codes[index] === UTF32CodeUnit.NEW_LINE) {
          nextOrigin.toLocation(location.add(0, 0, 1))
        } else {
          nextOrigin.toLocation(location.next())
        }

        expect(result.get(index).origin.equals(nextOrigin)).toBeTruthy()
      }
    })
  })

  describe('#fromUTF16String', function () {
    it('emit consecutive non-linebreaking symbols', function () {
      const codes: UTF32CodeUnit[] = givenAnyCombinationOfNonLinebreakingUTF32CodeUnit()
      const text: UTF16String = UTF16String.fromUTF32String(UTF32String.fromCodeUnits(codes, codes.length))
      const result: Pack<UnidocSymbol> = Pack.instance(UnidocSymbol.ALLOCATOR, codes.length)

      for (const symbol of UnidocSymbols.fromUTF16String(text)) {
        result.push(symbol)
      }

      expect(result.size).toBe(codes.length)

      const location: UnidocLocation = new UnidocLocation()

      for (let index = 0; index < result.size; ++index) {
        expect(result.get(index).code).toBe(codes[index])
        expect(result.get(index).origin.equals(
          UnidocSymbols.fromUTF16String.origin()
            .fromLocation(location)
            .toLocation(location.next())
        )).toBeTruthy()
      }
    })

    it('handle newlines', function () {
      const codes: UTF32CodeUnit[] = givenAnyCombinationOfUTF32CodeUnitWithNewlines()
      const text: UTF16String = UTF16String.fromUTF32String(UTF32String.fromCodeUnits(codes, codes.length))
      const result: Pack<UnidocSymbol> = Pack.instance(UnidocSymbol.ALLOCATOR, codes.length)

      for (const symbol of UnidocSymbols.fromUTF16String(text)) {
        result.push(symbol)
      }

      expect(result.size).toBe(codes.length)

      const location: UnidocLocation = new UnidocLocation()

      for (let index = 0; index < result.size; ++index) {
        expect(result.get(index).code).toBe(codes[index])

        const nextOrigin: UnidocOrigin = UnidocSymbols.fromUTF16String.origin()
        nextOrigin.fromLocation(location)

        if (codes[index] === UTF32CodeUnit.NEW_LINE) {
          nextOrigin.toLocation(location.break())
        } else {
          nextOrigin.toLocation(location.next())
        }

        expect(result.get(index).origin.equals(nextOrigin)).toBeTruthy()
      }
    })

    it('handle carriage returns', function () {
      const codes: UTF32CodeUnit[] = givenAnyCombinationOfUTF32CodeUnitWithCarriageReturn()
      const text: UTF16String = UTF16String.fromUTF32String(UTF32String.fromCodeUnits(codes, codes.length))
      const result: Pack<UnidocSymbol> = Pack.instance(UnidocSymbol.ALLOCATOR, codes.length)

      for (const symbol of UnidocSymbols.fromUTF16String(text)) {
        result.push(symbol)
      }

      expect(result.size).toBe(codes.length)

      const location: UnidocLocation = new UnidocLocation()

      for (let index = 0; index < result.size; ++index) {
        expect(result.get(index).code).toBe(codes[index])

        const nextOrigin: UnidocOrigin = UnidocSymbols.fromUTF16String.origin()
        nextOrigin.fromLocation(location)

        if (codes[index] === UTF32CodeUnit.CARRIAGE_RETURN) {
          nextOrigin.toLocation(location.break())
        } else {
          nextOrigin.toLocation(location.next())
        }

        expect(result.get(index).origin.equals(nextOrigin)).toBeTruthy()
      }
    })

    it('handle CL+RF sequence', function () {
      const codes: UTF32CodeUnit[] = givenAnyCombinationOfUTF32CodeUnitWithNewlinesequence()
      const text: UTF16String = UTF16String.fromUTF32String(UTF32String.fromCodeUnits(codes, codes.length))
      const result: Pack<UnidocSymbol> = Pack.instance(UnidocSymbol.ALLOCATOR, codes.length)

      for (const symbol of UnidocSymbols.fromUTF16String(text)) {
        result.push(symbol)
      }

      expect(result.size).toBe(codes.length)

      const location: UnidocLocation = new UnidocLocation()

      for (let index = 0; index < result.size; ++index) {
        expect(result.get(index).code).toBe(codes[index])

        const nextOrigin: UnidocOrigin = UnidocSymbols.fromUTF16String.origin()
        nextOrigin.fromLocation(location)

        if (codes[index] === UTF32CodeUnit.CARRIAGE_RETURN) {
          nextOrigin.toLocation(location.break())
        } else if (codes[index] === UTF32CodeUnit.NEW_LINE) {
          nextOrigin.toLocation(location.add(0, 0, 1))
        } else {
          nextOrigin.toLocation(location.next())
        }

        expect(result.get(index).origin.equals(nextOrigin)).toBeTruthy()
      }
    })
  })
})
