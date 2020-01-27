/** eslint-env jest */

import { Aliases } from '../sources/typescript/parsing/alias/Aliases'

describe('Aliases', function () {
  describe('#constructor', function () {
    it('instantiate an empty alias dictionary with the given capacity', function () {
      const aliases : Aliases<number> = new Aliases(128)

      expect(aliases.capacity).toBe(128)
      expect(aliases.size).toBe(0)
    })
  })

  describe('#declare', function () {
    it('declare an alias', function () {
      const aliases : Aliases<number> = new Aliases(128)

      expect(aliases.capacity).toBe(128)
      expect(aliases.size).toBe(0)
      expect(aliases.get('paragraph')).toBeUndefined()

      aliases.declare('paragraph', 28)

      expect(aliases.capacity).toBe(128)
      expect(aliases.size).toBe(1)
      expect(aliases.get('paragraph')).toBe(28)
    })

    it('update an alias', function () {
      const aliases : Aliases<number> = new Aliases(128)

      aliases.declare('paragraph', 28)

      expect(aliases.capacity).toBe(128)
      expect(aliases.size).toBe(1)
      expect(aliases.get('paragraph')).toBe(28)

      aliases.declare('paragraph', 178)

      expect(aliases.capacity).toBe(128)
      expect(aliases.size).toBe(1)
      expect(aliases.get('paragraph')).toBe(178)
    })

    it('allows to declare multiple aliases', function () {
      const aliases : Aliases<number> = new Aliases(128)

      const values : [string, number][] = [
        ['paragraph', 128],
        ['potato', 128],
        ['potatoes', 56],
        ['clap', 12],
        ['clapclap', 8],
        ['clapclapclap', 6]
      ]

      expect(aliases.capacity).toBe(128)
      expect(aliases.size).toBe(0)

      for (const [alias, value] of values) {
        expect(aliases.get(alias)).toBeUndefined()
        aliases.declare(alias, value)
        expect(aliases.get(alias)).toBe(value)
      }

      expect(aliases.capacity).toBe(128)
      expect(aliases.size).toBe(values.length)
    })
  })

  describe('#delete', function () {
    it('remove an alias', function () {
      const aliases : Aliases<number> = new Aliases(128)

      const values : [string, number][] = [
        ['paragraph', 128],
        ['potato', 128],
        ['potatoes', 56],
        ['clap', 12],
        ['clapclap', 8],
        ['clapclapclap', 6]
      ]

      for (const [alias, value] of values) {
        aliases.declare(alias, value)
      }

      expect(aliases.capacity).toBe(128)
      expect(aliases.size).toBe(values.length)

      expect(aliases.get('clapclap')).toBe(8)
      aliases.delete('clapclap')
      expect(aliases.get('clapclap')).toBe(undefined)

      expect(aliases.capacity).toBe(128)
      expect(aliases.size).toBe(values.length - 1)
    })

    it('work on inexisting aliases', function () {
      const aliases : Aliases<number> = new Aliases(128)

      const values : [string, number][] = [
        ['paragraph', 128],
        ['potato', 128],
        ['potatoes', 56],
        ['clap', 12],
        ['clapclap', 8],
        ['clapclapclap', 6]
      ]

      for (const [alias, value] of values) {
        aliases.declare(alias, value)
      }

      expect(aliases.capacity).toBe(128)
      expect(aliases.size).toBe(values.length)

      expect(aliases.get('clapclop')).toBe(undefined)
      aliases.delete('clapclop')
      expect(aliases.get('clapclop')).toBe(undefined)

      expect(aliases.capacity).toBe(128)
      expect(aliases.size).toBe(values.length)
    })

    it('allows to remove multiple aliases', function () {
      const aliases : Aliases<number> = new Aliases(128)

      const values : [string, number][] = [
        ['paragraph', 128],
        ['potato', 128],
        ['potatoes', 56],
        ['clap', 12],
        ['clapclap', 8],
        ['clapclapclap', 6]
      ]

      for (const [alias, value] of values) {
        aliases.declare(alias, value)
      }

      expect(aliases.capacity).toBe(128)
      expect(aliases.size).toBe(values.length)

      for (const [alias, value] of values) {
        expect(aliases.get(alias)).toBe(value)
        aliases.delete(alias)
        expect(aliases.get(alias)).toBeUndefined()
      }

      expect(aliases.capacity).toBe(128)
      expect(aliases.size).toBe(0)
    })
  })

  describe('#clear', function () {
    it('empty the dictionary', function () {
      const aliases : Aliases<number> = new Aliases(128)

      const values : [string, number][] = [
        ['paragraph', 128],
        ['potato', 128],
        ['potatoes', 56],
        ['clap', 12],
        ['clapclap', 8],
        ['clapclapclap', 6]
      ]

      for (const [alias, value] of values) {
        aliases.declare(alias, value)
      }

      expect(aliases.capacity).toBe(128)
      expect(aliases.size).toBe(values.length)

      for (const [alias, value] of values) {
        expect(aliases.get(alias)).toBe(value)
      }

      aliases.clear()

      for (const [alias, value] of values) {
        expect(aliases.get(alias)).toBeUndefined()
      }

      expect(aliases.capacity).toBe(128)
      expect(aliases.size).toBe(0)
    })
  })
})
