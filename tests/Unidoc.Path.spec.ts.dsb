/** eslint-env jest */

import { Unidoc } from '@library/index'

describe('Unidoc.Path', function () {
  describe('#constructor', function () {
    it('instantiate an empty path', function () {
      const path : Unidoc.Path = new Unidoc.Path()

      expect(path.size).toBe(0)
    })
  })

  describe('#push', function () {
    it('append elements to the path', function () {
      const path : Unidoc.Path = new Unidoc.Path()
      const s1 : Unidoc.Path.Any = new Unidoc.Path.Block()
      const s2 : Unidoc.Path.Any = new Unidoc.Path.Tag()
      const s3 : Unidoc.Path.Any = new Unidoc.Path.Text()

      expect(path.size).toBe(0)

      path.push(s1)
      path.push(s2)
      path.push(s3)

      expect(path.get(0)).toBe(s1)
      expect(path.get(1)).toBe(s2)
      expect(path.get(2)).toBe(s3)
      expect(path.size).toBe(3)
    })
  })

  describe('#set', function () {
    it('replace an element of the path', function () {
      const path : Unidoc.Path = new Unidoc.Path()

      const s1 : Unidoc.Path.Any = new Unidoc.Path.Block()
      const s21 : Unidoc.Path.Any = new Unidoc.Path.Tag()
      const s22 : Unidoc.Path.Any = new Unidoc.Path.Tag()
      const s3 : Unidoc.Path.Any = new Unidoc.Path.Text()

      path.push(s1)
      path.push(s21)
      path.push(s3)

      expect(path.get(0)).toBe(s1)
      expect(path.get(1)).toBe(s21)
      expect(path.get(1)).not.toBe(s22)
      expect(path.get(2)).toBe(s3)
      expect(path.size).toBe(3)

      path.set(1, s22)

      expect(path.get(0)).toBe(s1)
      expect(path.get(1)).not.toBe(s21)
      expect(path.get(1)).toBe(s22)
      expect(path.get(2)).toBe(s3)
      expect(path.size).toBe(3)
    })
  })

  describe('#concat', function () {
    it('replace an element of the path', function () {
      const first : Unidoc.Path = new Unidoc.Path()
      const second : Unidoc.Path = new Unidoc.Path()

      const s11 : Unidoc.Path.Any = new Unidoc.Path.Block()
      const s12 : Unidoc.Path.Any = new Unidoc.Path.Tag()
      const s21 : Unidoc.Path.Any = new Unidoc.Path.Tag()
      const s22 : Unidoc.Path.Any = new Unidoc.Path.Text()

      first.push(s11)
      first.push(s12)
      second.push(s21)
      second.push(s22)

      expect(first.get(0)).toBe(s11)
      expect(first.get(1)).toBe(s12)
      expect(first.size).toBe(2)
      expect(second.get(0)).toBe(s21)
      expect(second.get(1)).toBe(s22)
      expect(second.size).toBe(2)

      first.concat(second)

      expect(first.get(0)).toBe(s11)
      expect(first.get(1)).toBe(s12)
      expect(first.get(2)).not.toBe(s21)
      expect(first.get(3)).not.toBe(s22)
      expect(first.get(2)).toEqual(s21)
      expect(first.get(3)).toEqual(s22)
      expect(first.size).toBe(4)
      expect(second.get(0)).toBe(s21)
      expect(second.get(1)).toBe(s22)
      expect(second.size).toBe(2)
    })
  })

  describe('#delete', function () {
    it('delete an element of the path', function () {
      const path : Unidoc.Path = new Unidoc.Path()

      const s1 : Unidoc.Path.Any = new Unidoc.Path.Block()
      const s2 : Unidoc.Path.Any = new Unidoc.Path.Tag()
      const s3 : Unidoc.Path.Any = new Unidoc.Path.Tag()
      const s4 : Unidoc.Path.Any = new Unidoc.Path.Text()

      path.push(s1)
      path.push(s2)
      path.push(s3)
      path.push(s4)

      expect(path.get(0)).toBe(s1)
      expect(path.get(1)).toBe(s2)
      expect(path.get(2)).toBe(s3)
      expect(path.get(3)).toBe(s4)
      expect(path.size).toBe(4)

      path.delete(1)

      expect(path.get(0)).toBe(s1)
      expect(path.get(1)).toBe(s3)
      expect(path.get(2)).toBe(s4)
      expect(path.size).toBe(3)
    })
  })

  describe('#keep', function () {
    it('keep only a part of the path', function () {
      const path : Unidoc.Path = new Unidoc.Path()

      const s1 : Unidoc.Path.Any = new Unidoc.Path.Block()
      const s2 : Unidoc.Path.Any = new Unidoc.Path.Tag()
      const s3 : Unidoc.Path.Any = new Unidoc.Path.Tag()
      const s4 : Unidoc.Path.Any = new Unidoc.Path.Text()

      path.push(s1)
      path.push(s2)
      path.push(s3)
      path.push(s4)

      expect(path.get(0)).toBe(s1)
      expect(path.get(1)).toBe(s2)
      expect(path.get(2)).toBe(s3)
      expect(path.get(3)).toBe(s4)
      expect(path.size).toBe(4)

      path.keep(1, 2)

      expect(path.get(0)).toBe(s2)
      expect(path.get(1)).toBe(s3)
      expect(path.size).toBe(2)
    })
  })

  describe('#copy', function () {
    it('copy another path', function () {
      const source : Unidoc.Path = new Unidoc.Path()
      const destination : Unidoc.Path = new Unidoc.Path()

      source.push(new Unidoc.Path.Block())
      source.push(new Unidoc.Path.Tag())
      source.push(new Unidoc.Path.Tag())
      source.push(new Unidoc.Path.Text())

      destination.push(new Unidoc.Path.Block())
      destination.push(new Unidoc.Path.Text())

      expect(source).not.toEqual(destination)

      destination.copy(source)

      expect(source).toEqual(destination)
    })
  })

  describe('#clear', function () {
    it('empty a path', function () {
      const path : Unidoc.Path = new Unidoc.Path()

      const s1 : Unidoc.Path.Any = new Unidoc.Path.Block()
      const s2 : Unidoc.Path.Any = new Unidoc.Path.Tag()
      const s3 : Unidoc.Path.Any = new Unidoc.Path.Tag()
      const s4 : Unidoc.Path.Any = new Unidoc.Path.Text()

      path.push(s1)
      path.push(s2)
      path.push(s3)
      path.push(s4)

      expect(path.get(0)).toBe(s1)
      expect(path.get(1)).toBe(s2)
      expect(path.get(2)).toBe(s3)
      expect(path.get(3)).toBe(s4)
      expect(path.size).toBe(4)

      path.clear()

      expect(path.size).toBe(0)
    })
  })

  describe('#text', function () {
    it('append a text element to the path', function () {
      const source : Unidoc.Path = new Unidoc.Path()
      const destination : Unidoc.Path = new Unidoc.Path()

      const location : Unidoc.Location = new Unidoc.Location(5, 8)

      source.push(new Unidoc.Path.Text(location))
      destination.text(location)

      expect(source).toEqual(destination)
    })
  })

  describe('#tag', function () {
    it('append a tag element to the path', function () {
      const source : Unidoc.Path = new Unidoc.Path()
      const destination : Unidoc.Path = new Unidoc.Path()

      const configuration : Unidoc.Path.Tag.Configuration = {
        location: new Unidoc.Location(5, 8),
        type: 5,
        label: 'paragraph',
        classes: ['blue', 'red'],
        identifier: 'introduction'
      }

      source.push(new Unidoc.Path.Tag(configuration))
      destination.tag(configuration)

      expect(source).toEqual(destination)
    })
  })

  describe('#block', function () {
    it('append a block element to the path', function () {
      const source : Unidoc.Path = new Unidoc.Path()
      const destination : Unidoc.Path = new Unidoc.Path()

      const configuration : Unidoc.Path.Block.Configuration = {
        location: new Unidoc.Location(5, 8),
        classes: ['blue', 'red'],
        identifier: 'introduction'
      }

      source.push(new Unidoc.Path.Block(configuration))
      destination.block(configuration)

      expect(source).toEqual(destination)
    })
  })

  describe('#toString', function () {
    it('return a string representation of a path', function () {
      const path : Unidoc.Path = new Unidoc.Path()

      const s1 : Unidoc.Path.Any = new Unidoc.Path.Block()
      const s2 : Unidoc.Path.Any = new Unidoc.Path.Tag()
      const s3 : Unidoc.Path.Any = new Unidoc.Path.Tag()
      const s4 : Unidoc.Path.Any = new Unidoc.Path.Text()

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
      const path : Unidoc.Path = new Unidoc.Path()

      expect(path.equals(null)).toBeFalsy()
      expect(path.equals(undefined)).toBeFalsy()
    })

    it('return true if the given value is the same instance', function () {
      const path : Unidoc.Path = new Unidoc.Path()

      expect(path.equals(path)).toBeTruthy()
    })

    it('return false if another type is compared', function () {
      const path : Unidoc.Path = new Unidoc.Path()

      expect(path.equals('location')).toBeFalsy()
      expect(path.equals(10)).toBeFalsy()
      expect(path.equals(new Date())).toBeFalsy()
    })

    it('return false if both instance are different', function () {
      const first : Unidoc.Path = new Unidoc.Path()
      const second : Unidoc.Path = new Unidoc.Path()

      first.block({
        location: new Unidoc.Location(8, 9),
        identifier: 'block',
        classes: ['red', 'blue']
      })
      first.tag({
        location: new Unidoc.Location(10, 5),
        type: 5,
        label: 'paragraph',
        identifier: 'tag',
        classes: ['red', 'blue']
      })
      first.text(new Unidoc.Location(32, 1))

      second.block({
        location: new Unidoc.Location(8, 9),
        identifier: 'block',
        classes: ['red', 'blue']
      })
      second.tag({
        location: new Unidoc.Location(10, 5),
        type: 5,
        label: 'paragraph',
        identifier: 'tag',
        classes: ['red', 'yellow']
      })
      second.text(new Unidoc.Location(32, 1))

      expect(first.equals(second)).toBeFalsy()
    })

    it('return true if both instance are equals', function () {
      const first : Unidoc.Path = new Unidoc.Path()
      const second : Unidoc.Path = new Unidoc.Path()

      first.block({
        location: new Unidoc.Location(8, 9),
        identifier: 'block',
        classes: ['red', 'blue']
      })
      first.tag({
        location: new Unidoc.Location(10, 5),
        type: 5,
        label: 'paragraph',
        identifier: 'tag',
        classes: ['red', 'blue']
      })
      first.text(new Unidoc.Location(32, 1))

      second.block({
        location: new Unidoc.Location(8, 9),
        identifier: 'block',
        classes: ['red', 'blue']
      })
      second.tag({
        location: new Unidoc.Location(10, 5),
        type: 5,
        label: 'paragraph',
        identifier: 'tag',
        classes: ['red', 'blue']
      })
      second.text(new Unidoc.Location(32, 1))

      expect(first.equals(second)).toBeTruthy()
    })
  })
})
