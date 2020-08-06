/** eslint-env jest */

import { Pack } from '@cedric-demongivert/gl-tool-collection'

import { UnidocSymbol } from '../../sources/stream/UnidocSymbol'
import { UnidocStringReader } from '../../sources/stream/UnidocStringReader'
import { UnidocPath } from '../../sources/path/UnidocPath'
import { UnidocLocation } from '../../sources/UnidocLocation'
import { CodePoint } from '../../sources/CodePoint'

describe('UnidocStringReader', function () {
  describe('#constructor', function () {
    it('instantiate an in-memory reader for the given string', function () {
      const reader : UnidocStringReader = new UnidocStringReader('test')

      expect(reader.source).toBe('test')
      expect(reader.location().equals(UnidocLocation.ZERO)).toBeTruthy()
    })
  })

  describe('#hasNext', function () {
    it('return true if more symbols can be extracted from the source', function () {
      const reader : UnidocStringReader = new UnidocStringReader('test')

      for (let index = 0; index < reader.source.length; ++index) {
        expect(reader.hasNext()).toBeTruthy()
        reader.next()
      }
    })

    it('return false if no more symbols can be extracted from the source', function () {
      const reader : UnidocStringReader = new UnidocStringReader('test')

      for (let index = 0; index < reader.source.length; ++index) {
        reader.next()
      }

      expect(reader.hasNext()).toBeFalsy()
    })
  })

  describe('#next', function () {
    it('return the next available symbol', function () {
      const reader : UnidocStringReader = new UnidocStringReader('test')
      const symbols : Pack<UnidocSymbol> = Pack.instance(UnidocSymbol.ALLOCATOR, 'test'.length)

      for (let index = 0; index < reader.source.length; ++index) {
        symbols.push(reader.next())
      }

      expect(symbols.get(0).equals(UnidocSymbol.create(
        CodePoint.t, UnidocPath.memory('string', [0, 0, 0], [0, 1, 1])
      ))).toBeTruthy()
      expect(symbols.get(1).equals(UnidocSymbol.create(
        CodePoint.e, UnidocPath.memory('string', [0, 1, 1], [0, 2, 2])
      ))).toBeTruthy()
      expect(symbols.get(2).equals(UnidocSymbol.create(
        CodePoint.s, UnidocPath.memory('string', [0, 2, 2], [0, 3, 3])
      ))).toBeTruthy()
      expect(symbols.get(3).equals(UnidocSymbol.create(
        CodePoint.t, UnidocPath.memory('string', [0, 3, 3], [0, 4, 4])
      ))).toBeTruthy()
    })

    it('handle newlines', function () {
      const reader : UnidocStringReader = new UnidocStringReader('te\n\ns\nt')
      const symbols : Pack<UnidocSymbol> = Pack.instance(UnidocSymbol.ALLOCATOR, 'test'.length)

      for (let index = 0; index < reader.source.length; ++index) {
        symbols.push(reader.next())
      }

      expect(symbols.get(0).equals(UnidocSymbol.create(
        CodePoint.t, UnidocPath.memory('string', [0, 0, 0], [0, 1, 1])
      ))).toBeTruthy()
      expect(symbols.get(1).equals(UnidocSymbol.create(
        CodePoint.e, UnidocPath.memory('string', [0, 1, 1], [0, 2, 2])
      ))).toBeTruthy()
      expect(symbols.get(2).equals(UnidocSymbol.create(
        CodePoint.NEW_LINE, UnidocPath.memory('string', [0, 2, 2], [1, 0, 3])
      ))).toBeTruthy()
      expect(symbols.get(3).equals(UnidocSymbol.create(
        CodePoint.NEW_LINE, UnidocPath.memory('string', [1, 0, 3], [2, 0, 4])
      ))).toBeTruthy()
      expect(symbols.get(4).equals(UnidocSymbol.create(
        CodePoint.s, UnidocPath.memory('string', [2, 0, 4], [2, 1, 5])
      ))).toBeTruthy()
      expect(symbols.get(5).equals(UnidocSymbol.create(
        CodePoint.NEW_LINE, UnidocPath.memory('string', [2, 1, 5], [3, 0, 6])
      ))).toBeTruthy()
      expect(symbols.get(6).equals(UnidocSymbol.create(
        CodePoint.t, UnidocPath.memory('string', [3, 0, 6], [3, 1, 7])
      ))).toBeTruthy()
    })

    it('handle carriage returns', function () {
      const reader : UnidocStringReader = new UnidocStringReader('te\r\rs\rt')
      const symbols : Pack<UnidocSymbol> = Pack.instance(UnidocSymbol.ALLOCATOR, 'test'.length)

      for (let index = 0; index < reader.source.length; ++index) {
        symbols.push(reader.next())
      }

      expect(symbols.get(0).equals(UnidocSymbol.create(
        CodePoint.t, UnidocPath.memory('string', [0, 0, 0], [0, 1, 1])
      ))).toBeTruthy()
      expect(symbols.get(1).equals(UnidocSymbol.create(
        CodePoint.e, UnidocPath.memory('string', [0, 1, 1], [0, 2, 2])
      ))).toBeTruthy()
      expect(symbols.get(2).equals(UnidocSymbol.create(
        CodePoint.CARRIAGE_RETURN, UnidocPath.memory('string', [0, 2, 2], [1, 0, 3])
      ))).toBeTruthy()
      expect(symbols.get(3).equals(UnidocSymbol.create(
        CodePoint.CARRIAGE_RETURN, UnidocPath.memory('string', [1, 0, 3], [2, 0, 4])
      ))).toBeTruthy()
      expect(symbols.get(4).equals(UnidocSymbol.create(
        CodePoint.s, UnidocPath.memory('string', [2, 0, 4], [2, 1, 5])
      ))).toBeTruthy()
      expect(symbols.get(5).equals(UnidocSymbol.create(
        CodePoint.CARRIAGE_RETURN, UnidocPath.memory('string', [2, 1, 5], [3, 0, 6])
      ))).toBeTruthy()
      expect(symbols.get(6).equals(UnidocSymbol.create(
        CodePoint.t, UnidocPath.memory('string', [3, 0, 6], [3, 1, 7])
      ))).toBeTruthy()
    })

    it('handle carriage returns and newline sequence', function () {
      const reader : UnidocStringReader = new UnidocStringReader('te\r\ns\rt')
      const symbols : Pack<UnidocSymbol> = Pack.instance(UnidocSymbol.ALLOCATOR, 'test'.length)

      for (let index = 0; index < reader.source.length; ++index) {
        symbols.push(reader.next())
      }

      expect(symbols.get(0).equals(UnidocSymbol.create(
        CodePoint.t, UnidocPath.memory('string', [0, 0, 0], [0, 1, 1])
      ))).toBeTruthy()
      expect(symbols.get(1).equals(UnidocSymbol.create(
        CodePoint.e, UnidocPath.memory('string', [0, 1, 1], [0, 2, 2])
      ))).toBeTruthy()
      expect(symbols.get(2).equals(UnidocSymbol.create(
        CodePoint.CARRIAGE_RETURN, UnidocPath.memory('string', [0, 2, 2], [1, 0, 3])
      ))).toBeTruthy()
      expect(symbols.get(3).equals(UnidocSymbol.create(
        CodePoint.NEW_LINE, UnidocPath.memory('string', [1, 0, 3], [1, 0, 4])
      ))).toBeTruthy()
      expect(symbols.get(4).equals(UnidocSymbol.create(
        CodePoint.s, UnidocPath.memory('string', [1, 0, 4], [1, 1, 5])
      ))).toBeTruthy()
      expect(symbols.get(5).equals(UnidocSymbol.create(
        CodePoint.CARRIAGE_RETURN, UnidocPath.memory('string', [1, 1, 5], [2, 0, 6])
      ))).toBeTruthy()
      expect(symbols.get(6).equals(UnidocSymbol.create(
        CodePoint.t, UnidocPath.memory('string', [2, 0, 6], [2, 1, 7])
      ))).toBeTruthy()
    })
  })

  describe('#location', function () {
    it('return the current location into the underlying source', function () {
      const reader : UnidocStringReader = new UnidocStringReader('te\r\ns\rt')
      const locations : Pack<UnidocLocation> = Pack.instance(UnidocLocation.ALLOCATOR, 'test'.length)

      for (let index = 0; index < reader.source.length; ++index) {
        locations.push(reader.location())
        reader.next()
      }

      locations.push(reader.location())

      expect(locations.get(0).equals(new UnidocLocation(0, 0, 0))).toBeTruthy()
      expect(locations.get(1).equals(new UnidocLocation(0, 1, 1))).toBeTruthy()
      expect(locations.get(2).equals(new UnidocLocation(0, 2, 2))).toBeTruthy()
      expect(locations.get(3).equals(new UnidocLocation(1, 0, 3))).toBeTruthy()
      expect(locations.get(4).equals(new UnidocLocation(1, 0, 4))).toBeTruthy()
      expect(locations.get(5).equals(new UnidocLocation(1, 1, 5))).toBeTruthy()
      expect(locations.get(6).equals(new UnidocLocation(2, 0, 6))).toBeTruthy()
      expect(locations.get(7).equals(new UnidocLocation(2, 1, 7))).toBeTruthy()
    })
  })
})
