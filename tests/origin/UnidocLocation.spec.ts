import { UnidocLocation } from "../../sources/origin/UnidocLocation"

/**
 * 
 */
describe('UnidocLocation', function () {
  /**
   * 
   */
  describe('#ZERO', function () {
    /**
     * 
     */
    it('return an instance of unidoc location with all of it\'s member to zero', function () {
      expect(UnidocLocation.ZERO.column).toBe(0)
      expect(UnidocLocation.ZERO.row).toBe(0)
      expect(UnidocLocation.ZERO.symbol).toBe(0)
    })
  })

  /**
   * 
   */
  describe('#constructor', function () {
    /**
     * 
     */
    it('return an instance of unidoc location with all of it\'s member to zero by default', function () {
      const location: UnidocLocation = new UnidocLocation()

      expect(location.column).toBe(0)
      expect(location.row).toBe(0)
      expect(location.symbol).toBe(0)
    })

    /**
     * 
     */
    it('return an instance of unidoc location with the requested members otherwise', function () {
      const first: UnidocLocation = new UnidocLocation(1, 7, 8)
      const second: UnidocLocation = new UnidocLocation(2, 3, 5)

      expect(first.column).toBe(1)
      expect(first.row).toBe(7)
      expect(first.symbol).toBe(8)

      expect(second.column).toBe(2)
      expect(second.row).toBe(3)
      expect(second.symbol).toBe(5)
    })
  })

  /**
   * 
   */
  describe('#create', function () {
    /**
     * 
     */
    it('return a zero location by default', function () {
      const location: UnidocLocation = UnidocLocation.create()

      expect(location.column).toBe(0)
      expect(location.row).toBe(0)
      expect(location.symbol).toBe(0)
    })

    /**
     * 
     */
    it('return a location with the given coordinates otherwise', function () {
      const location: UnidocLocation = UnidocLocation.create(2, 8, 5)

      expect(location.column).toBe(2)
      expect(location.row).toBe(8)
      expect(location.symbol).toBe(5)
    })
  })

  /**
   * @dependsOn UnidocLocation#constructor
   */
  describe('#add', function () {
    /**
     * 
     */
    it('add the given number of columns, rows and indices', function () {
      const location: UnidocLocation = new UnidocLocation(1, 7, 8)

      expect(location.column).toBe(1)
      expect(location.row).toBe(7)
      expect(location.symbol).toBe(8)

      location.add(5, 2, 3)

      expect(location.column).toBe(1 + 5)
      expect(location.row).toBe(7 + 2)
      expect(location.symbol).toBe(8 + 3)

      location.add(3, 4, 5)

      expect(location.column).toBe(1 + 5 + 3)
      expect(location.row).toBe(7 + 2 + 4)
      expect(location.symbol).toBe(8 + 3 + 5)
    })
  })

  /**
   * @dependsOn UnidocLocation#constructor
   */
  describe('#subtract', function () {
    /**
     * 
     */
    it('subtract the given number of columns, rows and indices', function () {
      const location: UnidocLocation = new UnidocLocation(8, 12, 5)

      expect(location.column).toBe(8)
      expect(location.row).toBe(12)
      expect(location.symbol).toBe(5)

      location.subtract(5, 2, 3)

      expect(location.column).toBe(8 - 5)
      expect(location.row).toBe(12 - 2)
      expect(location.symbol).toBe(5 - 3)
    })

    /**
     * 
     */
    it('keep the value positives when the quantity to subtract is to high', function () {
      const location: UnidocLocation = new UnidocLocation(8, 12, 5)

      expect(location.column).toBe(8)
      expect(location.row).toBe(12)
      expect(location.symbol).toBe(5)

      location.subtract(0, 24, 0)

      expect(location.column).toBe(8)
      expect(location.row).toBe(0)
      expect(location.symbol).toBe(5)

      location.subtract(24, 0, 0)

      expect(location.column).toBe(0)
      expect(location.row).toBe(0)
      expect(location.symbol).toBe(5)

      location.subtract(0, 0, 24)

      expect(location.column).toBe(0)
      expect(location.row).toBe(0)
      expect(location.symbol).toBe(0)
    })
  })

  /**
   * @dependsOn UnidocLocation#constructor
   */
  describe('#set', function () {
    /**
     * 
     */
    it('set the location to the given coordinates', function () {
      const location: UnidocLocation = new UnidocLocation(8, 12, 5)

      expect(location.column).toBe(8)
      expect(location.row).toBe(12)
      expect(location.symbol).toBe(5)

      location.set(5, 2, 3)

      expect(location.column).toBe(5)
      expect(location.row).toBe(2)
      expect(location.symbol).toBe(3)
    })
  })

  /**
   * @dependsOn UnidocLocation#constructor
   */
  describe('#equals', function () {
    /**
     * 
     */
    it('return false if the instance is compared to an undefined value', function () {
      const location: UnidocLocation = new UnidocLocation(8, 12, 5)

      expect(location.equals(undefined)).toBeFalsy()
      expect(location.equals(null)).toBeFalsy()
    })

    /**
     * 
     */
    it('return true if the instance is compared with itself', function () {
      const location: UnidocLocation = new UnidocLocation(8, 12, 5)

      expect(location.equals(location)).toBeTruthy()
    })

    /**
     * 
     */
    it('return false if the instance is not compared with a location', function () {
      const location: UnidocLocation = new UnidocLocation(8, 12, 5)

      expect(location.equals('abc')).toBeFalsy()
      expect(location.equals(15)).toBeFalsy()
      expect(location.equals(new Date())).toBeFalsy()
    })

    /**
     * 
     */
    it('return false if the instance is compared to a location with different coordinates', function () {
      const location: UnidocLocation = new UnidocLocation(8, 12, 5)

      expect(location.equals(new UnidocLocation(2, 12, 5))).toBeFalsy()
      expect(location.equals(new UnidocLocation(8, 2, 5))).toBeFalsy()
      expect(location.equals(new UnidocLocation(8, 12, 2))).toBeFalsy()
    })

    /**
     * 
     */
    it('return true if the instance is compared to a location with the same coordinates', function () {
      const location: UnidocLocation = new UnidocLocation(8, 12, 5)
      expect(location.equals(new UnidocLocation(8, 12, 5))).toBeTruthy()
    })
  })

  /**
   * @dependsOn UnidocLocation#constructor
   * @dependsOn UnidocLocation#equals
   */
  describe('#clone', function () {
    /**
     * 
     */
    it('return a clone of the given location', function () {
      const base: UnidocLocation = new UnidocLocation(8, 12, 5)
      const copy: UnidocLocation = base.clone()

      expect(base).not.toBe(copy)
      expect(base.equals(copy)).toBeTruthy()
    })
  })

  /**
   * @dependsOn UnidocLocation#constructor
   * @dependsOn UnidocLocation#equals
   */
  describe('#copy', function () {
    /**
     * 
     */
    it('copy the given location instance', function () {
      const location: UnidocLocation = new UnidocLocation(8, 12, 5)
      const toCopy: UnidocLocation = new UnidocLocation(5, 2, 1)

      expect(location.equals(toCopy)).toBeFalsy()

      location.copy(toCopy)

      expect(location.equals(toCopy)).toBeTruthy()
    })
  })

  /**
   * @dependsOn UnidocLocation#ZERO
   * @dependsOn UnidocLocation#constructor
   * @dependsOn UnidocLocation#equals
   */
  describe('#clear', function () {
    /**
     * 
     */
    it('reset the location to zero', function () {
      const location: UnidocLocation = new UnidocLocation(8, 12, 5)

      expect(location.equals(UnidocLocation.ZERO)).toBeFalsy()

      location.clear()

      expect(location.equals(UnidocLocation.ZERO)).toBeTruthy()
    })
  })

  /**
   * @dependsOn UnidocLocation#constructor
   */
  describe('#toString', function () {
    /**
     * 
     */
    it('return a string representation of the location', function () {
      const location: UnidocLocation = new UnidocLocation(8, 12, 5)

      expect(location.toString()).toBe('8:12[5]')
    })
  })
})