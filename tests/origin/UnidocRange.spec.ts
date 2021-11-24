import { UnidocLocation } from "../../sources/origin/UnidocLocation"
import { UnidocRange } from "../../sources/origin/UnidocRange"

/**
 * @dependsOn UnidocLocation
 */
describe('UnidocRange', function () {
  describe('#ZERO', function () {
    it('return an instance of unidoc range with all of it\'s member to zero', function () {
      expect(UnidocRange.ZERO.start.equals(UnidocLocation.ZERO)).toBeTruthy()
      expect(UnidocRange.ZERO.end.equals(UnidocLocation.ZERO)).toBeTruthy()
    })
  })

  describe('#constructor', function () {
    it('return an instance of unidoc range with all of it\'s member to zero by default', function () {
      const range: UnidocRange = new UnidocRange()

      expect(range.start.equals(UnidocLocation.ZERO)).toBeTruthy()
      expect(range.end.equals(UnidocLocation.ZERO)).toBeTruthy()
    })

    it('return an instance of unidoc range at the given coordinates if only one parameter is passed', function () {
      const location: UnidocLocation = new UnidocLocation(5, 2, 4)
      const range: UnidocRange = new UnidocRange(location)

      expect(range.start.equals(location)).toBeTruthy()
      expect(range.end.equals(location)).toBeTruthy()
      expect(range.start).not.toBe(location)
      expect(range.end).not.toBe(location)
    })

    it('return an instance of unidoc range between the given boundaries if both paramter are passed', function () {
      const start: UnidocLocation = new UnidocLocation(5, 2, 4)
      const end: UnidocLocation = new UnidocLocation(3, 6, 25)
      const range: UnidocRange = new UnidocRange(start, end)

      expect(range.start.equals(start)).toBeTruthy()
      expect(range.end.equals(end)).toBeTruthy()
      expect(range.start).not.toBe(start)
      expect(range.end).not.toBe(end)
    })
  })

  describe('#create', function () {
    it('return an instance of unidoc range with all of it\'s member to zero by default', function () {
      const range: UnidocRange = UnidocRange.create()

      expect(range.start.equals(UnidocLocation.ZERO)).toBeTruthy()
      expect(range.end.equals(UnidocLocation.ZERO)).toBeTruthy()
    })

    it('return an instance of unidoc range at the given coordinates if only one parameter is passed', function () {
      const location: UnidocLocation = new UnidocLocation(5, 2, 4)
      const range: UnidocRange = UnidocRange.create(location)

      expect(range.start.equals(location)).toBeTruthy()
      expect(range.end.equals(location)).toBeTruthy()
      expect(range.start).not.toBe(location)
      expect(range.end).not.toBe(location)
    })

    it('return an instance of unidoc range between the given boundaries if both parameter are passed', function () {
      const start: UnidocLocation = new UnidocLocation(5, 2, 4)
      const end: UnidocLocation = new UnidocLocation(3, 6, 25)
      const range: UnidocRange = UnidocRange.create(start, end)

      expect(range.start.equals(start)).toBeTruthy()
      expect(range.end.equals(end)).toBeTruthy()
      expect(range.start).not.toBe(start)
      expect(range.end).not.toBe(end)
    })
  })

  describe('#atCoordinates', function () {
    it('return an instance of unidoc range at the given coordinates', function () {
      const location: UnidocLocation = new UnidocLocation(5, 2, 4)
      const range: UnidocRange = UnidocRange.atCoordinates(5, 2, 4)

      expect(range.start.equals(location)).toBeTruthy()
      expect(range.end.equals(location)).toBeTruthy()
    })
  })

  describe('#betweenCoordinates', function () {
    it('return an instance of unidoc range between the given boundaries', function () {
      const start: UnidocLocation = new UnidocLocation(5, 2, 4)
      const end: UnidocLocation = new UnidocLocation(3, 6, 25)
      const range: UnidocRange = UnidocRange.fromCoordinates(5, 2, 4).toCoordinates(3, 6, 25)

      expect(range.start.equals(start)).toBeTruthy()
      expect(range.end.equals(end)).toBeTruthy()
    })
  })

  /**
   * @dependsOn UnidocRange.constructor
   */
  describe('#atLocation', function () {
    it('set the range to the given coordinates', function () {
      const location: UnidocLocation = new UnidocLocation(5, 2, 4)
      const range: UnidocRange = new UnidocRange()

      range.atLocation(location)

      expect(range.start.equals(location)).toBeTruthy()
      expect(range.end.equals(location)).toBeTruthy()
      expect(range.start).not.toBe(location)
      expect(range.end).not.toBe(location)
    })
  })

  /**
   * @dependsOn UnidocRange.constructor
   */
  describe('#atCoordinates', function () {
    it('set the range to the given coordinates', function () {
      const location: UnidocLocation = new UnidocLocation(5, 2, 4)
      const range: UnidocRange = new UnidocRange()

      range.atCoordinates(5, 2, 4)

      expect(range.start.equals(location)).toBeTruthy()
      expect(range.end.equals(location)).toBeTruthy()
    })
  })

  /**
   * @dependsOn UnidocRange.constructor
   */
  describe('#fromLocation', function () {
    it('start the range at the given coordinates', function () {
      const location: UnidocLocation = new UnidocLocation(5, 2, 4)
      const range: UnidocRange = new UnidocRange()

      range.fromLocation(location)

      expect(range.start.equals(location)).toBeTruthy()
      expect(range.start).not.toBe(location)
    })
  })

  /**
   * @dependsOn UnidocRange.constructor
   */
  describe('#toLocation', function () {
    it('end the range at the given coordinates', function () {
      const location: UnidocLocation = new UnidocLocation(5, 2, 4)
      const range: UnidocRange = new UnidocRange()

      range.toLocation(location)

      expect(range.end.equals(location)).toBeTruthy()
      expect(range.end).not.toBe(location)
    })
  })

  /**
   * @dependsOn UnidocRange.constructor
   */
  describe('#fromCoordinates', function () {
    it('start the range at the given coordinates', function () {
      const location: UnidocLocation = new UnidocLocation(5, 2, 4)
      const range: UnidocRange = new UnidocRange()

      range.fromCoordinates(5, 2, 4)

      expect(range.start.equals(location)).toBeTruthy()
    })
  })

  /**
   * @dependsOn UnidocRange.constructor
   */
  describe('#toCoordinates', function () {
    it('end the range at the given coordinates', function () {
      const location: UnidocLocation = new UnidocLocation(5, 2, 4)
      const range: UnidocRange = new UnidocRange()

      range.toCoordinates(5, 2, 4)

      expect(range.end.equals(location)).toBeTruthy()
    })
  })

  /**
   * @dependsOn UnidocRange.constructor
   * @dependsOn UnidocRange.betweenCoordinates
   */
  describe('#equals', function () {
    it('return false if the instance is compared to an undefined value', function () {
      const range: UnidocRange = new UnidocRange()

      expect(range.equals(undefined)).toBeFalsy()
      expect(range.equals(null)).toBeFalsy()
    })

    it('return true if the instance is compared with itself', function () {
      const range: UnidocRange = new UnidocRange()

      expect(range.equals(range)).toBeTruthy()
    })

    it('return false if the instance is not compared with a range', function () {
      const range: UnidocRange = new UnidocRange()

      expect(range.equals('abc')).toBeFalsy()
      expect(range.equals(15)).toBeFalsy()
      expect(range.equals(new Date())).toBeFalsy()
    })

    it('return false if the instance is compared to a location with different coordinates', function () {
      const range: UnidocRange = UnidocRange.fromCoordinates(5, 8, 2).toCoordinates(2, 9, 9)

      expect(range.equals(UnidocRange.fromCoordinates(5, 8, 3).toCoordinates(2, 9, 9))).toBeFalsy()
      expect(range.equals(UnidocRange.fromCoordinates(5, 8, 2).toCoordinates(2, 3, 9))).toBeFalsy()
      expect(range.equals(UnidocRange.fromCoordinates(3, 8, 2).toCoordinates(2, 9, 9))).toBeFalsy()
      expect(range.equals(UnidocRange.fromCoordinates(5, 8, 2).toCoordinates(2, 9, 3))).toBeFalsy()
    })

    it('return true if the instance is compared to a location with the same coordinates', function () {
      const range: UnidocRange = UnidocRange.fromCoordinates(5, 8, 2).toCoordinates(2, 9, 9)

      expect(range.equals(UnidocRange.fromCoordinates(5, 8, 2).toCoordinates(2, 9, 9))).toBeTruthy()
    })
  })

  /**
   * @dependsOn UnidocRange.constructor
   * @dependsOn UnidocRange.betweenCoordinates
   * @dependsOn UnidocRange.equals
   */
  describe('#copy', function () {
    it('copy an existing range instance', function () {
      const range: UnidocRange = new UnidocRange()
      const toCopy: UnidocRange = UnidocRange.fromCoordinates(5, 8, 2).toCoordinates(2, 9, 9)

      expect(range.equals(toCopy)).toBeFalsy()

      range.copy(toCopy)

      expect(range.equals(toCopy)).toBeTruthy()
      expect(range).not.toBe(toCopy)
    })
  })

  /**
   * @dependsOn UnidocRange.betweenCoordinates
   * @dependsOn UnidocRange.constructor
   * @dependsOn UnidocRange.equals
   */
  describe('#clone', function () {
    it('return a clone of the range instance', function () {
      const range: UnidocRange = UnidocRange.fromCoordinates(5, 8, 2).toCoordinates(2, 9, 9)
      const clone: UnidocRange = range.clone()

      expect(range.equals(clone)).toBeTruthy()
      expect(range).not.toBe(clone)
    })
  })

  /**
   * @dependsOn UnidocRange.betweenCoordinates
   * @dependsOn UnidocRange.constructor
   * @dependsOn UnidocRange.equals
   * @dependsOn UnidocRange.ZERO
   */
  describe('#clear', function () {
    it('reset the range to zero', function () {
      const range: UnidocRange = UnidocRange.fromCoordinates(5, 8, 2).toCoordinates(2, 9, 9)

      range.clear()

      expect(range.equals(UnidocRange.ZERO)).toBeTruthy()
      expect(range).not.toBe(UnidocRange.ZERO)
    })
  })
})