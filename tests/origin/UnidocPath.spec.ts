/** eslint-env jest */

import { UnidocPath } from '../../sources/origin/UnidocPath'
import { UnidocOrigin } from '../../sources/origin/UnidocOrigin'
import { UnidocLocation } from '../../sources/origin/UnidocLocation'
import { UnidocRange } from '../../sources/origin/UnidocRange'

/**
 * @dependsOn UnidocOrigin
 */
describe('UnidocPath', function () {
  describe('#constructor', function () {
    it('instantiate an empty path', function () {
      const path: UnidocPath = new UnidocPath()
      expect(path.size).toBe(0)
    })
  })

  /**
   * @dependsOn UnidocPath.constructor
   */
  describe('#push', function () {
    it('append elements to the path', function () {
      const path: UnidocPath = new UnidocPath()
      const s1: UnidocOrigin = new UnidocOrigin()
      const s2: UnidocOrigin = new UnidocOrigin()
      const s3: UnidocOrigin = new UnidocOrigin()

      s1.inFile('file_1').at(UnidocRange.betweenCoordinates(5, 2, 12, 3, 9, 45))
      s2.inURI('ftp://127.0.0.1').at(UnidocRange.betweenCoordinates(6, 3, 13, 9, 5, 32))
      s3.inMemory('runtime').at(UnidocRange.betweenCoordinates(2, 6, 17, 2, 8, 29))

      expect(path.size).toBe(0)

      path.push(s1)
      path.push(s2)
      path.push(s3)

      expect(path.get(0).equals(s1)).toBeTruthy()
      expect(path.get(1).equals(s2)).toBeTruthy()
      expect(path.get(2).equals(s3)).toBeTruthy()
      expect(path.get(0)).not.toBe(s1)
      expect(path.get(1)).not.toBe(s2)
      expect(path.get(2)).not.toBe(s3)
      expect(path.size).toBe(3)
    })
  })

  /**
   * @dependsOn UnidocPath.constructor
   */
  describe('#set', function () {
    it('replace an element of the path', function () {
      const path: UnidocPath = new UnidocPath()

      const s1: UnidocOrigin = new UnidocOrigin()
      const s21: UnidocOrigin = new UnidocOrigin()
      const s22: UnidocOrigin = new UnidocOrigin()
      const s3: UnidocOrigin = new UnidocOrigin()

      s1.inFile('file_1').at(UnidocRange.betweenCoordinates(5, 2, 12, 3, 9, 45))
      s21.inURI('ftp://127.0.0.1').at(UnidocRange.betweenCoordinates(6, 3, 13, 9, 5, 32))
      s22.inURI('http://127.0.0.1').at(UnidocRange.betweenCoordinates(6, 3, 13, 9, 5, 32))
      s3.inMemory('runtime').at(UnidocRange.betweenCoordinates(2, 6, 17, 2, 8, 29))

      path.push(s1)
      path.push(s21)
      path.push(s3)

      expect(path.get(0).equals(s1)).toBeTruthy()
      expect(path.get(1).equals(s21)).toBeTruthy()
      expect(path.get(1).equals(s22)).toBeFalsy()
      expect(path.get(2).equals(s3)).toBeFalsy()
      expect(path.get(0)).not.toBe(s1)
      expect(path.get(1)).not.toBe(s21)
      expect(path.get(1)).not.toBe(s22)
      expect(path.get(2)).not.toBe(s3)
      expect(path.size).toBe(3)

      path.set(1, s22)

      expect(path.get(0).equals(s1)).toBeTruthy()
      expect(path.get(1).equals(s21)).toBeFalsy()
      expect(path.get(1).equals(s22)).toBeTruthy()
      expect(path.get(2).equals(s3)).toBeFalsy()
      expect(path.get(0)).not.toBe(s1)
      expect(path.get(1)).not.toBe(s21)
      expect(path.get(1)).not.toBe(s22)
      expect(path.get(2)).not.toBe(s3)
      expect(path.size).toBe(3)
    })
  })

  /**
   * @dependsOn UnidocPath.constructor
   * @dependsOn UnidocPath.push
   */
  describe('#concat', function () {
    it('add the elements of the given path to the current path', function () {
      const first: UnidocPath = new UnidocPath()
      const second: UnidocPath = new UnidocPath()

      const s11: UnidocOrigin = new UnidocOrigin()
      const s12: UnidocOrigin = new UnidocOrigin()
      const s21: UnidocOrigin = new UnidocOrigin()
      const s22: UnidocOrigin = new UnidocOrigin()

      s11.inFile('file_1').at(UnidocRange.betweenCoordinates(5, 2, 12, 3, 9, 45))
      s12.inURI('ftp://127.0.0.1').at(UnidocRange.betweenCoordinates(6, 3, 13, 9, 5, 32))
      s21.inURI('http://127.0.0.1/test').at(UnidocRange.betweenCoordinates(9, 10, 80, 1, 15, 122))
      s22.inMemory('runtime').at(UnidocRange.betweenCoordinates(2, 6, 17, 2, 8, 29))

      first.push(s11)
      first.push(s12)
      second.push(s21)
      second.push(s22)

      first.concat(second)

      expect(first.get(0).equals(s11)).toBeTruthy()
      expect(first.get(1).equals(s12)).toBeTruthy()
      expect(first.get(2).equals(s21)).toBeTruthy()
      expect(first.get(3).equals(s22)).toBeTruthy()
      expect(first.get(0)).not.toBe(s11)
      expect(first.get(1)).not.toBe(s12)
      expect(first.get(2)).not.toBe(s21)
      expect(first.get(3)).not.toBe(s22)
      expect(first.size).toBe(4)

      expect(second.get(0)).toEqual(s21)
      expect(second.get(1)).toEqual(s22)
      expect(second.size).toBe(2)
    })
  })

  /**
   * @dependsOn UnidocPath.constructor
   * @dependsOn UnidocPath.push
   */
  describe('#delete', function () {
    it('delete an element of the path', function () {
      const path: UnidocPath = new UnidocPath()

      const s1: UnidocOrigin = new UnidocOrigin()
      const s2: UnidocOrigin = new UnidocOrigin()
      const s3: UnidocOrigin = new UnidocOrigin()
      const s4: UnidocOrigin = new UnidocOrigin()

      s1.inFile('file_1').at(UnidocRange.betweenCoordinates(5, 2, 12, 3, 9, 45))
      s2.inURI('ftp://127.0.0.1').at(UnidocRange.betweenCoordinates(6, 3, 13, 9, 5, 32))
      s3.inURI('http://127.0.0.1/test').at(UnidocRange.betweenCoordinates(9, 10, 80, 1, 15, 122))
      s4.inMemory('runtime').at(UnidocRange.betweenCoordinates(2, 6, 17, 2, 8, 29))

      path.push(s1)
      path.push(s2)
      path.push(s3)
      path.push(s4)

      expect(path.get(0).equals(s1)).toBeTruthy()
      expect(path.get(1).equals(s2)).toBeTruthy()
      expect(path.get(2).equals(s3)).toBeTruthy()
      expect(path.get(3).equals(s4)).toBeTruthy()
      expect(path.size).toBe(4)

      path.delete(1)

      expect(path.get(0).equals(s1)).toBeTruthy()
      expect(path.get(1).equals(s2)).toBeTruthy()
      expect(path.get(2).equals(s4)).toBeTruthy()
      expect(path.size).toBe(3)
    })
  })

  /**
   * @dependsOn UnidocPath.constructor
   * @dependsOn UnidocPath.push
   */
  describe('#keep', function () {
    it('keep only a part of the path', function () {
      const path: UnidocPath = new UnidocPath()

      const s1: UnidocOrigin = new UnidocOrigin()
      const s2: UnidocOrigin = new UnidocOrigin()
      const s3: UnidocOrigin = new UnidocOrigin()
      const s4: UnidocOrigin = new UnidocOrigin()

      s1.inFile('file_1').at(UnidocRange.betweenCoordinates(5, 2, 12, 3, 9, 45))
      s2.inURI('ftp://127.0.0.1').at(UnidocRange.betweenCoordinates(6, 3, 13, 9, 5, 32))
      s3.inURI('http://127.0.0.1/test').at(UnidocRange.betweenCoordinates(9, 10, 80, 1, 15, 122))
      s4.inMemory('runtime').at(UnidocRange.betweenCoordinates(2, 6, 17, 2, 8, 29))

      path.push(s1)
      path.push(s2)
      path.push(s3)
      path.push(s4)

      expect(path.get(0).equals(s1)).toBeTruthy()
      expect(path.get(1).equals(s2)).toBeTruthy()
      expect(path.get(2).equals(s3)).toBeTruthy()
      expect(path.get(3).equals(s4)).toBeTruthy()
      expect(path.size).toBe(4)

      path.keep(1, 2)

      expect(path.get(0).equals(s2)).toBeTruthy()
      expect(path.get(1).equals(s3)).toBeTruthy()
      expect(path.size).toBe(2)
    })
  })

  /**
   * @dependsOn UnidocPath.constructor
   * @dependsOn UnidocPath.push
   * @dependsOn UnidocPath.equals
   */
  describe('#copy', function () {
    it('copy another path', function () {
      const source: UnidocPath = new UnidocPath()
      const destination: UnidocPath = new UnidocPath()

      const s1: UnidocOrigin = new UnidocOrigin()
      const s2: UnidocOrigin = new UnidocOrigin()
      const s3: UnidocOrigin = new UnidocOrigin()
      const s4: UnidocOrigin = new UnidocOrigin()

      s1.inFile('file_1').at(UnidocRange.betweenCoordinates(5, 2, 12, 3, 9, 45))
      s2.inURI('ftp://127.0.0.1').at(UnidocRange.betweenCoordinates(6, 3, 13, 9, 5, 32))
      s3.inURI('http://127.0.0.1/test').at(UnidocRange.betweenCoordinates(9, 10, 80, 1, 15, 122))
      s4.inMemory('runtime').at(UnidocRange.betweenCoordinates(2, 6, 17, 2, 8, 29))

      source.push(s1)
      source.push(s2)
      source.push(s3)
      source.push(s4)

      destination.push(new UnidocOrigin())
      destination.push(new UnidocOrigin())

      expect(source.equals(destination)).toBeFalsy()

      destination.copy(source)

      expect(source.equals(destination)).toBeTruthy()

      for (let index = 0; index < source.size; ++index) {
        expect(destination.get(index)).not.toBe(source.get(index))
      }
    })
  })

  /**
   * @dependsOn UnidocPath.constructor
   * @dependsOn UnidocPath.push
   */
  describe('#clear', function () {
    it('empty a path', function () {
      const path: UnidocPath = new UnidocPath()

      const s1: UnidocOrigin = new UnidocOrigin()
      const s2: UnidocOrigin = new UnidocOrigin()
      const s3: UnidocOrigin = new UnidocOrigin()
      const s4: UnidocOrigin = new UnidocOrigin()

      s1.inFile('file_1').at(UnidocRange.betweenCoordinates(5, 2, 12, 3, 9, 45))
      s2.inURI('ftp://127.0.0.1').at(UnidocRange.betweenCoordinates(6, 3, 13, 9, 5, 32))
      s3.inURI('http://127.0.0.1/test').at(UnidocRange.betweenCoordinates(9, 10, 80, 1, 15, 122))
      s4.inMemory('runtime').at(UnidocRange.betweenCoordinates(2, 6, 17, 2, 8, 29))

      path.push(s1)
      path.push(s2)
      path.push(s3)
      path.push(s4)

      path.clear()

      expect(path.size).toBe(0)
    })
  })

  /**
   * @dependsOn UnidocPath.constructor
   * @dependsOn UnidocPath.push
   */
  describe('#toString', function () {
    it('return a string representation of a path', function () {
      const path: UnidocPath = new UnidocPath()

      const s1: UnidocOrigin = new UnidocOrigin()
      const s2: UnidocOrigin = new UnidocOrigin()
      const s3: UnidocOrigin = new UnidocOrigin()
      const s4: UnidocOrigin = new UnidocOrigin()

      s1.inFile('file_1').at(UnidocRange.betweenCoordinates(5, 2, 12, 3, 9, 45))
      s2.inURI('ftp://127.0.0.1').at(UnidocRange.betweenCoordinates(6, 3, 13, 9, 5, 32))
      s3.inURI('http://127.0.0.1/test').at(UnidocRange.betweenCoordinates(9, 10, 80, 1, 15, 122))
      s4.inMemory('runtime').at(UnidocRange.betweenCoordinates(2, 6, 17, 2, 8, 29))

      path.push(s1)
      path.push(s2)
      path.push(s3)
      path.push(s4)

      expect(path.toString()).toBe([
        s1.toString(), ' > ',
        s2.toString(), ' > ',
        s3.toString(), ' > ',
        s4.toString()
      ].join(''))
    })
  })

  /**
   * @dependsOn UnidocPath.constructor
   * @dependsOn UnidocPath.push
   */
  describe('#equals', function () {
    it('return false if the given value is null', function () {
      const path: UnidocPath = new UnidocPath()

      expect(path.equals(null)).toBeFalsy()
      expect(path.equals(undefined)).toBeFalsy()
    })

    it('return true if the given value is the same instance', function () {
      const path: UnidocPath = new UnidocPath()

      expect(path.equals(path)).toBeTruthy()
    })

    it('return false if another type is compared', function () {
      const path: UnidocPath = new UnidocPath()

      expect(path.equals('location')).toBeFalsy()
      expect(path.equals(10)).toBeFalsy()
      expect(path.equals(new Date())).toBeFalsy()
    })

    it('return false if both instance are different', function () {
      const first: UnidocPath = new UnidocPath()
      const second: UnidocPath = new UnidocPath()

      const s11: UnidocOrigin = new UnidocOrigin()
      const s12: UnidocOrigin = new UnidocOrigin()
      const s21: UnidocOrigin = new UnidocOrigin()
      const s22: UnidocOrigin = new UnidocOrigin()

      s11.inFile('file_1').at(UnidocRange.betweenCoordinates(5, 2, 12, 3, 9, 45))
      s12.inURI('ftp://127.0.0.1').at(UnidocRange.betweenCoordinates(6, 3, 13, 9, 5, 32))
      s21.inURI('http://127.0.0.1/test').at(UnidocRange.betweenCoordinates(9, 10, 80, 1, 15, 122))
      s22.inMemory('runtime').at(UnidocRange.betweenCoordinates(2, 6, 17, 2, 8, 29))

      first.push(s11)
      first.push(s12)

      second.push(s21)
      second.push(s22)

      expect(first.equals(second)).toBeFalsy()
    })

    it('return true if both instance are equals', function () {
      const first: UnidocPath = new UnidocPath()
      const second: UnidocPath = new UnidocPath()

      const s1: UnidocOrigin = new UnidocOrigin()
      const s2: UnidocOrigin = new UnidocOrigin()
      const s3: UnidocOrigin = new UnidocOrigin()
      const s4: UnidocOrigin = new UnidocOrigin()

      s1.inFile('file_1').at(UnidocRange.betweenCoordinates(5, 2, 12, 3, 9, 45))
      s2.inURI('ftp://127.0.0.1').at(UnidocRange.betweenCoordinates(6, 3, 13, 9, 5, 32))
      s3.inURI('http://127.0.0.1/test').at(UnidocRange.betweenCoordinates(9, 10, 80, 1, 15, 122))
      s4.inMemory('runtime').at(UnidocRange.betweenCoordinates(2, 6, 17, 2, 8, 29))

      first.push(s1)
      first.push(s2)
      first.push(s3)
      first.push(s4)

      second.push(s1)
      second.push(s2)
      second.push(s3)
      second.push(s4)

      expect(first.equals(second)).toBeTruthy()
    })
  })
})
