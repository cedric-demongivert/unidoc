/** eslint-env jest */

import { Unidoc } from '@library/index'

describe('Unidoc.Location', function () {
  describe('#constructor', function () {
    it('instantiate a zero location', function () {
      const location : Unidoc.Location = new Unidoc.Location()

      expect(location.line).toBe(0)
      expect(location.column).toBe(0)
      expect(location.index).toBe(0)
    })
  })

  describe('#static copy', function () {
    it('instantiate a copy of a given location', function () {
      const source : Unidoc.Location = new Unidoc.Location(8, 9, 3)
      const copy : Unidoc.Location = Unidoc.Location.copy(source)

      expect(copy.equals(source)).toBeTruthy()
      expect(copy).not.toBe(source)
    })
  })

  describe('#set', function () {
    it('update the location', function () {
      const location : Unidoc.Location = new Unidoc.Location()

      expect(location.line).toBe(0)
      expect(location.column).toBe(0)

      location.set(8, 3, 7)

      expect(location.line).toBe(8)
      expect(location.column).toBe(3)
      expect(location.index).toBe(7)
    })
  })

  describe('#copy', function () {
    it('copy another location instance', function () {
      const source : Unidoc.Location = new Unidoc.Location()
      const copy : Unidoc.Location = new Unidoc.Location()

      source.set(8, 3, 6)
      copy.set(5, 9, 7)

      expect(copy.line).not.toBe(source.line)
      expect(copy.column).not.toBe(source.column)
      expect(copy.index).not.toBe(source.index)

      copy.copy(source)

      expect(copy.line).toBe(source.line)
      expect(copy.column).toBe(source.column)
      expect(copy.index).toBe(source.index)
    })
  })

  describe('#toString', function () {
    it('return a string representation of the location', function () {
      const location : Unidoc.Location = new Unidoc.Location()
      location.set(8, 3, 7)

      expect(location.toString()).toBe('8:3/7')
    })
  })

  describe('#equals', function () {
    it('return false if the given value is null', function () {
      const location : Unidoc.Location = new Unidoc.Location()

      expect(location.equals(null)).toBeFalsy()
      expect(location.equals(undefined)).toBeFalsy()
    })

    it('return true if the given value is the same instance', function () {
      const location : Unidoc.Location = new Unidoc.Location()

      expect(location.equals(location)).toBeTruthy()
    })

    it('return false if another type is compared', function () {
      const location : Unidoc.Location = new Unidoc.Location()

      expect(location.equals('location')).toBeFalsy()
      expect(location.equals(10)).toBeFalsy()
      expect(location.equals(new Date())).toBeFalsy()
    })

    it('return false if both instance are different', function () {
      const first : Unidoc.Location = new Unidoc.Location()
      const second : Unidoc.Location = new Unidoc.Location()

      second.set(8, 3, 6)

      expect(first.equals(second)).toBeFalsy()
    })

    it('return true if both instance are equals', function () {
      const first : Unidoc.Location = new Unidoc.Location()
      const second : Unidoc.Location = new Unidoc.Location()

      second.set(8, 3, 6)
      first.set(8, 3, 6)

      expect(first.equals(second)).toBeTruthy()
    })
  })
})
