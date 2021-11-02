import { DataObject } from '../sources/DataObject'
import { Random } from '../sources/Random'

import { describeCopy } from './Copiable.spec'

/**
 * Validate the copy method of a given element.
 */
export function describeDataObject<Target extends DataObject>(Class: DataObject.Constructor<Target>, factory: Random.Factory<Target>) {
  describeCopy(factory)

  describe('#constructor', function () {
    it('must be default constructible', function () {
      expect(() => new Class()).not.toThrow()

      const defaultInstance: Target = new Class()

      expect(defaultInstance).toBeDefined()
    })
  })

  describe('#clear', function () {
    it('reset the current instance to it\'s default state', function () {
      const defaultInstance: Target = new Class()

      for (let index = 0; index < 10; ++index) {
        const instance: Target = factory()

        if (instance.equals(defaultInstance) != true) {
          expect(instance).not.toBe(defaultInstance)
          expect(instance.equals(defaultInstance)).toBeFalsy()
          const output: Target = instance.clear()
          expect(output).toBe(defaultInstance)
          expect(instance.equals(defaultInstance)).toBeTruthy()
        }
      }
    })
  })

  describe('#clone', function () {
    it('return a copy of the current instance', function () {
      for (let index = 0; index < 10; ++index) {
        const instance: Target = factory()
        const clone: Target = instance.clone()

        expect(instance).not.toBe(clone)
        expect(instance.equals(clone)).toBeTruthy()
      }
    })
  })

  describe('#equals', function () {
    it('return false if the instance is compared to a null value', function () {
      const instance: Target = factory()

      expect(instance.equals(null)).toBeFalsy()
      expect(instance.equals(undefined)).toBeFalsy()
    })

    it('return true if the instance is compared to itself', function () {
      const instance: Target = factory()

      expect(instance.equals(instance)).toBeTruthy()
    })

    it('return false if the instance is compared to a value of another type', function () {
      const location: Target = factory()

      expect(location.equals('location')).toBeFalsy()
      expect(location.equals(10)).toBeFalsy()
      expect(location.equals(new Date())).toBeFalsy()
    })

    it('return false if both instance are different', function () {
      const first: Target = factory(Random.singleton(0))

      expect(first.equals(factory(Random.singleton(1)))).toBeFalsy()
      expect(first.equals(factory(Random.singleton(2)))).toBeFalsy()
      expect(first.equals(factory(Random.singleton(3)))).toBeFalsy()
      expect(first.equals(factory(Random.singleton(4)))).toBeFalsy()
      expect(first.equals(factory(Random.singleton(5)))).toBeFalsy()
    })

    it('return true if both instance are equals', function () {
      const first: Target = factory(Random.singleton(0))
      const second: Target = factory(Random.singleton(0))

      expect(first.equals(second)).toBeTruthy()
    })
  })
}
