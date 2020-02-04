/** eslint-env jest */

import { Unidoc } from '@library/index'

describe('Unidoc.Location', function () {
  describe('#constructor', function () {
    it('instantiate a zero location', function () {
      const location : Unidoc.Location = new Unidoc.Location()

      expect(location.line).toBe(0)
      expect(location.column).toBe(0)
    })
  })

  describe('#static copy', function () {
    it('instantiate a copy of a given location', function () {
      const source : Unidoc.Location = new Unidoc.Location(8, 9)
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

      location.set(8, 3)

      expect(location.line).toBe(3)
      expect(location.column).toBe(8)
    })
  })

  describe('#copy', function () {
    it('copy another location instance', function () {
      const source : Unidoc.Location = new Unidoc.Location()
      const copy : Unidoc.Location = new Unidoc.Location()

      source.set(8, 3)
      copy.set(5, 9)

      expect(copy.line).not.toBe(source.line)
      expect(copy.column).not.toBe(source.column)

      copy.copy(source)

      expect(copy.line).toBe(source.line)
      expect(copy.column).toBe(source.column)
    })
  })

  describe('#toString', function () {
    it('return a string representation of the location', function () {
      const location : Unidoc.Location = new Unidoc.Location()
      location.set(8, 3)

      expect(location.toString()).toBe('8:3')
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

      second.set(8, 3)

      expect(first.equals(second)).toBeFalsy()
    })

    it('return true if both instance are equals', function () {
      const first : Unidoc.Location = new Unidoc.Location()
      const second : Unidoc.Location = new Unidoc.Location()

      second.set(8, 3)
      first.set(8, 3)

      expect(first.equals(second)).toBeTruthy()
    })
  })
})
