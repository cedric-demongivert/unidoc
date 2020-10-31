/** eslint-env jest */

import { UnidocPath } from '../sources/path/UnidocPath'
import { UnidocPathElement } from '../sources/path/UnidocPathElement'
import { UnidocLocation } from '../sources/location/UnidocLocation'

describe('UnidocPath', function () {
  describe('#constructor', function () {
    it('instantiate an empty path', function () {
      const path : UnidocPath = new UnidocPath()

      expect(path.size).toBe(0)
    })
  })

  describe('#push', function () {
    it('append elements to the path', function () {
      const path : UnidocPath = new UnidocPath()
      const s1 : UnidocPathElement = new UnidocPathElement()
      const s2 : UnidocPathElement = new UnidocPathElement()
      const s3 : UnidocPathElement = new UnidocPathElement()

      s1.asSymbol(new UnidocLocation(0, 0, 1))
      s2.asSymbol(new UnidocLocation(0, 0, 2))
      s3.asSymbol(new UnidocLocation(0, 0, 3))

      expect(path.size).toBe(0)

      path.push(s1)
      path.push(s2)
      path.push(s3)

      expect(path.elements.get(0)).toEqual(s1)
      expect(path.elements.get(1)).toEqual(s2)
      expect(path.elements.get(2)).toEqual(s3)
      expect(path.size).toBe(3)
    })
  })

  describe('#set', function () {
    it('replace an element of the path', function () {
      const path : UnidocPath = new UnidocPath()

      const s1 : UnidocPathElement = new UnidocPathElement()
      const s21 : UnidocPathElement = new UnidocPathElement()
      const s22 : UnidocPathElement = new UnidocPathElement()
      const s3 : UnidocPathElement = new UnidocPathElement()

      s1.asSymbol(new UnidocLocation(0, 0, 1))
      s21.asSymbol(new UnidocLocation(0, 0, 2))
      s22.asSymbol(new UnidocLocation(0, 0, 3))
      s3.asSymbol(new UnidocLocation(0, 0, 4))

      path.push(s1)
      path.push(s21)
      path.push(s3)

      expect(path.elements.get(0)).toEqual(s1)
      expect(path.elements.get(1)).toEqual(s21)
      expect(path.elements.get(1)).not.toEqual(s22)
      expect(path.elements.get(2)).toEqual(s3)
      expect(path.size).toBe(3)

      path.set(1, s22)

      expect(path.elements.get(0)).toEqual(s1)
      expect(path.elements.get(1)).not.toEqual(s21)
      expect(path.elements.get(1)).toEqual(s22)
      expect(path.elements.get(2)).toEqual(s3)
      expect(path.size).toBe(3)
    })
  })

  describe('#concat', function () {
    it('add the elements of the given path to the current path', function () {
      const first : UnidocPath = new UnidocPath()
      const second : UnidocPath = new UnidocPath()

      const s11 : UnidocPathElement = new UnidocPathElement()
      const s12 : UnidocPathElement = new UnidocPathElement()
      const s21 : UnidocPathElement = new UnidocPathElement()
      const s22 : UnidocPathElement = new UnidocPathElement()

      s11.asSymbol(new UnidocLocation(0, 0, 1))
      s12.asSymbol(new UnidocLocation(0, 0, 2))
      s21.asSymbol(new UnidocLocation(0, 0, 3))
      s22.asSymbol(new UnidocLocation(0, 0, 4))

      first.push(s11)
      first.push(s12)
      second.push(s21)
      second.push(s22)

      expect(first.elements.get(0)).toEqual(s11)
      expect(first.elements.get(1)).toEqual(s12)
      expect(first.size).toBe(2)

      expect(second.elements.get(0)).toEqual(s21)
      expect(second.elements.get(1)).toEqual(s22)
      expect(second.size).toBe(2)

      first.concat(second)

      expect(first.elements.get(0)).toEqual(s11)
      expect(first.elements.get(1)).toEqual(s12)
      expect(first.elements.get(2)).toEqual(s21)
      expect(first.elements.get(3)).toEqual(s22)
      expect(first.size).toBe(4)

      expect(second.elements.get(0)).toEqual(s21)
      expect(second.elements.get(1)).toEqual(s22)
      expect(second.size).toBe(2)
    })
  })

  describe('#delete', function () {
    it('delete an element of the path', function () {
      const path : UnidocPath = new UnidocPath()

      const s1 : UnidocPathElement = new UnidocPathElement()
      const s2 : UnidocPathElement = new UnidocPathElement()
      const s3 : UnidocPathElement = new UnidocPathElement()
      const s4 : UnidocPathElement = new UnidocPathElement()

      s1.asSymbol(new UnidocLocation(0, 0, 1))
      s2.asSymbol(new UnidocLocation(0, 0, 2))
      s3.asSymbol(new UnidocLocation(0, 0, 3))
      s4.asSymbol(new UnidocLocation(0, 0, 4))

      path.push(s1)
      path.push(s2)
      path.push(s3)
      path.push(s4)

      expect(path.elements.get(0)).toEqual(s1)
      expect(path.elements.get(1)).toEqual(s2)
      expect(path.elements.get(2)).toEqual(s3)
      expect(path.elements.get(3)).toEqual(s4)
      expect(path.size).toBe(4)

      path.delete(1)

      expect(path.elements.get(0)).toEqual(s1)
      expect(path.elements.get(1)).toEqual(s3)
      expect(path.elements.get(2)).toEqual(s4)
      expect(path.size).toBe(3)
    })
  })

  describe('#keep', function () {
    it('keep only a part of the path', function () {
      const path : UnidocPath = new UnidocPath()

      const s1 : UnidocPathElement = new UnidocPathElement
      const s2 : UnidocPathElement = new UnidocPathElement
      const s3 : UnidocPathElement = new UnidocPathElement
      const s4 : UnidocPathElement = new UnidocPathElement()

      s1.asSymbol(new UnidocLocation(0, 0, 1))
      s2.asSymbol(new UnidocLocation(0, 0, 2))
      s3.asSymbol(new UnidocLocation(0, 0, 3))
      s4.asSymbol(new UnidocLocation(0, 0, 4))

      path.push(s1)
      path.push(s2)
      path.push(s3)
      path.push(s4)

      expect(path.elements.get(0)).toEqual(s1)
      expect(path.elements.get(1)).toEqual(s2)
      expect(path.elements.get(2)).toEqual(s3)
      expect(path.elements.get(3)).toEqual(s4)
      expect(path.size).toBe(4)

      path.keep(1, 2)

      expect(path.elements.get(0)).toEqual(s2)
      expect(path.elements.get(1)).toEqual(s3)
      expect(path.size).toBe(2)
    })
  })

  describe('#copy', function () {
    it('copy another path', function () {
      const source : UnidocPath = new UnidocPath()
      const destination : UnidocPath = new UnidocPath()

      source.push(new UnidocPathElement)
      source.push(new UnidocPathElement)
      source.push(new UnidocPathElement)
      source.push(new UnidocPathElement())

      destination.push(new UnidocPathElement)
      destination.push(new UnidocPathElement())

      expect(source).not.toEqual(destination)

      destination.copy(source)

      expect(source).toEqual(destination)
    })
  })

  describe('#clear', function () {
    it('empty a path', function () {
      const path : UnidocPath = new UnidocPath()

      const s1 : UnidocPathElement = new UnidocPathElement
      const s2 : UnidocPathElement = new UnidocPathElement
      const s3 : UnidocPathElement = new UnidocPathElement
      const s4 : UnidocPathElement = new UnidocPathElement()

      path.push(s1)
      path.push(s2)
      path.push(s3)
      path.push(s4)

      expect(path.elements.get(0)).toEqual(s1)
      expect(path.elements.get(1)).toEqual(s2)
      expect(path.elements.get(2)).toEqual(s3)
      expect(path.elements.get(3)).toEqual(s4)
      expect(path.size).toBe(4)

      path.clear()

      expect(path.size).toBe(0)
    })
  })

  describe('#toString', function () {
    it('return a string representation of a path', function () {
      const path : UnidocPath = new UnidocPath()

      const s1 : UnidocPathElement = new UnidocPathElement()
      const s2 : UnidocPathElement = new UnidocPathElement()
      const s3 : UnidocPathElement = new UnidocPathElement()
      const s4 : UnidocPathElement = new UnidocPathElement()

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

  describe('#equals', function () {
    it('return false if the given value is null', function () {
      const path : UnidocPath = new UnidocPath()

      expect(path.equals(null)).toBeFalsy()
      expect(path.equals(undefined)).toBeFalsy()
    })

    it('return true if the given value is the same instance', function () {
      const path : UnidocPath = new UnidocPath()

      expect(path.equals(path)).toBeTruthy()
    })

    it('return false if another type is compared', function () {
      const path : UnidocPath = new UnidocPath()

      expect(path.equals('location')).toBeFalsy()
      expect(path.equals(10)).toBeFalsy()
      expect(path.equals(new Date())).toBeFalsy()
    })

    it('return false if both instance are different', function () {
      const first : UnidocPath = new UnidocPath()
      const second : UnidocPath = new UnidocPath()

      first.pushTag(new UnidocLocation(8, 9), new UnidocLocation(10, 5), 'block#block.red.blue')
      first.pushTag(new UnidocLocation(10, 5), new UnidocLocation(40, 2), 'paragraph#tag.red.blue')
      first.pushSymbol(new UnidocLocation(32, 1))

      second.pushTag(new UnidocLocation(8, 9), new UnidocLocation(10, 5), 'block#block.red.blue')
      second.pushTag(new UnidocLocation(10, 5), new UnidocLocation(40, 2), 'paragraph#tag.red.yellow')
      second.pushSymbol(new UnidocLocation(32, 1))

      expect(first.equals(second)).toBeFalsy()
    })

    it('return true if both instance are equals', function () {
      const first : UnidocPath = new UnidocPath()
      const second : UnidocPath = new UnidocPath()

      first.pushTag(new UnidocLocation(8, 9), new UnidocLocation(10, 5), 'block#block.red.blue')
      first.pushTag(new UnidocLocation(10, 5), new UnidocLocation(40, 2), 'paragraph#tag.red.blue')
      first.pushSymbol(new UnidocLocation(32, 1))

      second.pushTag(new UnidocLocation(8, 9), new UnidocLocation(10, 5), 'block#block.red.blue')
      second.pushTag(new UnidocLocation(10, 5), new UnidocLocation(40, 2), 'paragraph#tag.red.blue')
      second.pushSymbol(new UnidocLocation(32, 1))

      expect(first.equals(second)).toBeTruthy()
    })
  })
})
