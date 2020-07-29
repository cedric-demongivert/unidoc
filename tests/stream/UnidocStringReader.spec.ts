/** eslint-env jest */

import { Pack } from '@cedric-demongivert/gl-tool-collection'

import { UnidocSymbol } from '../../sources/stream/UnidocSymbol'
import { UnidocStringReader } from '../../sources/stream/UnidocStringReader'
import { UnidocLocation } from '../../sources/UnidocLocation'

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

      expect(symbols.get(0).equals(UnidocSymbol.fromMemory('t (0, 0, 0)'))).toBeTruthy()
      expect(symbols.get(1).equals(UnidocSymbol.fromMemory('e (0, 1, 1)'))).toBeTruthy()
      expect(symbols.get(2).equals(UnidocSymbol.fromMemory('s (0, 2, 2)'))).toBeTruthy()
      expect(symbols.get(3).equals(UnidocSymbol.fromMemory('t (0, 3, 3)'))).toBeTruthy()
    })

    it('handle newlines', function () {
      const reader : UnidocStringReader = new UnidocStringReader('te\n\ns\nt')
      const symbols : Pack<UnidocSymbol> = Pack.instance(UnidocSymbol.ALLOCATOR, 'test'.length)

      for (let index = 0; index < reader.source.length; ++index) {
        symbols.push(reader.next())
      }

      expect(symbols.get(0).equals(UnidocSymbol.fromMemory('t (0, 0, 0)'))).toBeTruthy()
      expect(symbols.get(1).equals(UnidocSymbol.fromMemory('e (0, 1, 1)'))).toBeTruthy()
      expect(symbols.get(2).equals(UnidocSymbol.fromMemory('\n (0, 2, 2)'))).toBeTruthy()
      expect(symbols.get(3).equals(UnidocSymbol.fromMemory('\n (1, 0, 3)'))).toBeTruthy()
      expect(symbols.get(4).equals(UnidocSymbol.fromMemory('s (2, 0, 4)'))).toBeTruthy()
      expect(symbols.get(5).equals(UnidocSymbol.fromMemory('\n (2, 1, 5)'))).toBeTruthy()
      expect(symbols.get(6).equals(UnidocSymbol.fromMemory('t (3, 0, 6)'))).toBeTruthy()
    })

    it('handle carriage returns', function () {
      const reader : UnidocStringReader = new UnidocStringReader('te\r\rs\rt')
      const symbols : Pack<UnidocSymbol> = Pack.instance(UnidocSymbol.ALLOCATOR, 'test'.length)

      for (let index = 0; index < reader.source.length; ++index) {
        symbols.push(reader.next())
      }

      expect(symbols.get(0).equals(UnidocSymbol.fromMemory('t (0, 0, 0)'))).toBeTruthy()
      expect(symbols.get(1).equals(UnidocSymbol.fromMemory('e (0, 1, 1)'))).toBeTruthy()
      expect(symbols.get(2).equals(UnidocSymbol.fromMemory('\r (0, 2, 2)'))).toBeTruthy()
      expect(symbols.get(3).equals(UnidocSymbol.fromMemory('\r (1, 0, 3)'))).toBeTruthy()
      expect(symbols.get(4).equals(UnidocSymbol.fromMemory('s (2, 0, 4)'))).toBeTruthy()
      expect(symbols.get(5).equals(UnidocSymbol.fromMemory('\r (2, 1, 5)'))).toBeTruthy()
      expect(symbols.get(6).equals(UnidocSymbol.fromMemory('t (3, 0, 6)'))).toBeTruthy()
    })

    it('handle carriage returns and newline sequence', function () {
      const reader : UnidocStringReader = new UnidocStringReader('te\r\ns\rt')
      const symbols : Pack<UnidocSymbol> = Pack.instance(UnidocSymbol.ALLOCATOR, 'test'.length)

      for (let index = 0; index < reader.source.length; ++index) {
        symbols.push(reader.next())
      }

      expect(symbols.get(0).equals(UnidocSymbol.fromMemory('t (0, 0, 0)'))).toBeTruthy()
      expect(symbols.get(1).equals(UnidocSymbol.fromMemory('e (0, 1, 1)'))).toBeTruthy()
      expect(symbols.get(2).equals(UnidocSymbol.fromMemory('\r (0, 2, 2)'))).toBeTruthy()
      expect(symbols.get(3).equals(UnidocSymbol.fromMemory('\n (1, 0, 3)'))).toBeTruthy()
      expect(symbols.get(4).equals(UnidocSymbol.fromMemory('s (1, 0, 4)'))).toBeTruthy()
      expect(symbols.get(5).equals(UnidocSymbol.fromMemory('\r (1, 1, 5)'))).toBeTruthy()
      expect(symbols.get(6).equals(UnidocSymbol.fromMemory('t (2, 0, 6)'))).toBeTruthy()
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