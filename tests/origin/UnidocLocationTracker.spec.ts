import { UnidocLocation } from "../../sources/origin/UnidocLocation"
import { UnidocLocationTracker } from "../../sources/origin/UnidocLocationTracker"
import { UTF32CodeUnit } from "../../sources/symbol/UTF32CodeUnit"

/**
 * @dependsOn UnidocLocation
 */
describe('UnidocLocationTracker', function () {
  describe('#constructor', function () {
    it('return a tracker initialized to the zero location by default', function () {
      const tracker: UnidocLocationTracker = new UnidocLocationTracker()
      expect(tracker.location.equals(UnidocLocation.ZERO)).toBeTruthy()
    })

    it('return a tracker initialized to the given coordinates otherwise', function () {
      const tracker: UnidocLocationTracker = new UnidocLocationTracker(5, 8, 3)
      expect(tracker.location.equals(UnidocLocation.create(5, 8, 3))).toBeTruthy()
    })
  })

  describe('#create', function () {
    it('return a tracker initialized to the zero location by default', function () {
      const tracker: UnidocLocationTracker = UnidocLocationTracker.create()
      expect(tracker.location.equals(UnidocLocation.ZERO)).toBeTruthy()
    })

    it('return a tracker initialized to the given coordinates otherwise', function () {
      const tracker: UnidocLocationTracker = UnidocLocationTracker.create(5, 8, 3)
      expect(tracker.location.equals(UnidocLocation.create(5, 8, 3))).toBeTruthy()
    })
  })

  /**
   * @dependsOn UnidocLocationTracker#constructor
   */
  describe('#nextString', function () {
    it('feed the tracker with the symbols of the given string and update it\'s location', function () {
      const tracker: UnidocLocationTracker = new UnidocLocationTracker()

      tracker.nextString('test 15 string')

      expect(
        tracker.location.equals(
          UnidocLocation.create('test 15 string'.length, 0, 'test 15 string'.length)
        )
      ).toBeTruthy()

      tracker.nextString(' and others')

      expect(
        tracker.location.equals(
          UnidocLocation.create('test 15 string and others'.length, 0, 'test 15 string and others'.length)
        )
      ).toBeTruthy()
    })

    it('allows to track carriage returns', function () {
      const tracker: UnidocLocationTracker = new UnidocLocationTracker(5, 8, 3)

      tracker.location.set(5, 8, 3)
      tracker.nextString('\n')

      expect(tracker.location.equals(UnidocLocation.create(0, 8 + 1, 3 + 1))).toBeTruthy()

      tracker.location.set(5, 8, 3)
      tracker.nextString('\r')

      expect(tracker.location.equals(UnidocLocation.create(0, 8 + 1, 3 + 1))).toBeTruthy()

      tracker.nextString('\r\n')

      expect(tracker.location.equals(UnidocLocation.create(0, 8 + 1, 3 + 2))).toBeTruthy()
    })

    it('supports code points encoded with multiple code units', function () {
      const tracker: UnidocLocationTracker = new UnidocLocationTracker()

      tracker.nextString('test 🦰')

      expect(
        tracker.location.equals(
          UnidocLocation.create('test '.length + 1, 0, 'test '.length + 1)
        )
      ).toBeTruthy()
    })
  })

  /**
   * @dependsOn UnidocLocationTracker#constructor
   */
  describe('#next', function () {
    it('feed the tracker with the given code unit update it\'s location', function () {
      const tracker: UnidocLocationTracker = new UnidocLocationTracker()

      tracker.next(UTF32CodeUnit.LATIN_SMALL_LETTER_K)

      expect(tracker.location.equals(UnidocLocation.create(0, 1, 1))).toBeTruthy()

      tracker.next(UTF32CodeUnit.LATIN_CAPITAL_LETTER_G)

      expect(tracker.location.equals(UnidocLocation.create(0, 2, 2))).toBeTruthy()

      tracker.next(UTF32CodeUnit.SPACE)

      expect(tracker.location.equals(UnidocLocation.create(0, 3, 3))).toBeTruthy()
    })

    it('allows to track carriage returns', function () {
      const tracker: UnidocLocationTracker = new UnidocLocationTracker(5, 8, 3)

      tracker.location.set(5, 8, 3)
      tracker.next(UTF32CodeUnit.NEW_LINE)

      expect(tracker.location.equals(UnidocLocation.create(0, 8 + 1, 3 + 1))).toBeTruthy()

      tracker.location.set(5, 8, 3)
      tracker.next(UTF32CodeUnit.CARRIAGE_RETURN)

      expect(tracker.location.equals(UnidocLocation.create(0, 8 + 1, 3 + 1))).toBeTruthy()

      tracker.next(UTF32CodeUnit.CARRIAGE_RETURN)
      tracker.next(UTF32CodeUnit.NEW_LINE)

      expect(tracker.location.equals(UnidocLocation.create(0, 8 + 1, 3 + 2))).toBeTruthy()
    })
  })

  /**
   * @dependsOn UnidocLocationTracker#constructor
   * @dependsOn UnidocLocationTracker#next
   */
  describe('#equals', function () {
    it('return false if the instance is compared to an undefined value', function () {
      const tracker: UnidocLocationTracker = new UnidocLocationTracker()

      expect(tracker.equals(undefined)).toBeFalsy()
      expect(tracker.equals(null)).toBeFalsy()
    })

    it('return true if the instance is compared with itself', function () {
      const tracker: UnidocLocationTracker = new UnidocLocationTracker()

      expect(tracker.equals(tracker)).toBeTruthy()
    })

    it('return false if the instance is not compared with a tracker', function () {
      const tracker: UnidocLocationTracker = new UnidocLocationTracker()

      expect(tracker.equals('abc')).toBeFalsy()
      expect(tracker.equals(15)).toBeFalsy()
      expect(tracker.equals(new Date())).toBeFalsy()
    })

    it('return false if the instance is compared to a tracker with different coordinates', function () {
      const tracker: UnidocLocationTracker = new UnidocLocationTracker(8, 12, 5)

      expect(tracker.equals(new UnidocLocationTracker(2, 12, 5))).toBeFalsy()
      expect(tracker.equals(new UnidocLocationTracker(8, 2, 5))).toBeFalsy()
      expect(tracker.equals(new UnidocLocationTracker(8, 12, 2))).toBeFalsy()
    })

    it('return false if the instance is compared to a tracker with a different inner state', function () {
      const tracker: UnidocLocationTracker = new UnidocLocationTracker()
      tracker.next(UTF32CodeUnit.CARRIAGE_RETURN)
      tracker.location.set(8, 12, 5)

      expect(tracker.equals(new UnidocLocationTracker(8, 12, 5))).toBeFalsy()
    })

    it('return true if the instance is compared to an equivalent one', function () {
      const tracker: UnidocLocationTracker = new UnidocLocationTracker(8, 12, 5)

      expect(tracker.equals(new UnidocLocationTracker(8, 12, 5))).toBeTruthy()

      tracker.next(UTF32CodeUnit.CARRIAGE_RETURN)
      tracker.location.set(8, 12, 5)

      const copy: UnidocLocationTracker = new UnidocLocationTracker()
      copy.next(UTF32CodeUnit.CARRIAGE_RETURN)
      copy.location.set(8, 12, 5)

      expect(tracker.equals(copy)).toBeTruthy()
    })
  })

  /**
   * @dependsOn UnidocLocationTracker#constructor
   * @dependsOn UnidocLocationTracker#next
   * @dependsOn UnidocLocationTracker#equals
   */
  describe('#clear', function () {
    it('reset the tracker internal state', function () {
      const tracker: UnidocLocationTracker = new UnidocLocationTracker()
      tracker.next(UTF32CodeUnit.CARRIAGE_RETURN)
      tracker.location.set(0, 0, 0)

      expect(tracker.equals(new UnidocLocationTracker())).toBeFalsy()

      tracker.clear()

      expect(tracker.equals(new UnidocLocationTracker())).toBeTruthy()
    })

    it('reset the location of the tracker to zero', function () {
      const tracker: UnidocLocationTracker = new UnidocLocationTracker(8, 5, 2)

      expect(tracker.equals(new UnidocLocationTracker())).toBeFalsy()

      tracker.clear()

      expect(tracker.equals(new UnidocLocationTracker())).toBeTruthy()
    })
  })

  /**
   * @dependsOn UnidocLocationTracker#constructor
   * @dependsOn UnidocLocationTracker#next
   * @dependsOn UnidocLocationTracker#equals
   */
  describe('#copy', function () {
    it('return a copy of the given tracker', function () {
      const tracker: UnidocLocationTracker = new UnidocLocationTracker()
      tracker.next(UTF32CodeUnit.CARRIAGE_RETURN)
      tracker.location.set(8, 2, 3)

      const copy: UnidocLocationTracker = new UnidocLocationTracker()

      expect(tracker.equals(copy)).toBeFalsy()

      copy.copy(tracker)

      expect(tracker.equals(copy)).toBeTruthy()
    })
  })

  /**
   * @dependsOn UnidocLocationTracker#constructor
   * @dependsOn UnidocLocationTracker#next
   * @dependsOn UnidocLocationTracker#equals
   */
  describe('#clone', function () {
    it('return a clone of the given tracker', function () {
      const tracker: UnidocLocationTracker = new UnidocLocationTracker()
      tracker.next(UTF32CodeUnit.CARRIAGE_RETURN)
      tracker.location.set(8, 2, 3)

      const copy: UnidocLocationTracker = tracker.clone()

      expect(tracker.equals(copy)).toBeTruthy()
      expect(tracker).not.toBe(copy)
    })
  })
})