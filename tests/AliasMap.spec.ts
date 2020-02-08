/** eslint-env jest */

import { AliasMap } from '@library/parsing/alias/AliasMap'

describe('AliasMap', function () {
  describe('#constructor', function () {
    it('instantiate an empty alias map with the given capacity', function () {
      const AliasMap : AliasMap<number> = new AliasMap(128)

      expect(AliasMap.capacity).toBe(128)
      expect(AliasMap.size).toBe(0)
    })
  })

  describe('#declare', function () {
    it('declare an alias', function () {
      const AliasMap : AliasMap<number> = new AliasMap(128)

      expect(AliasMap.capacity).toBe(128)
      expect(AliasMap.size).toBe(0)
      expect(AliasMap.get('paragraph')).toBeUndefined()

      AliasMap.declare('paragraph', 28)

      expect(AliasMap.capacity).toBe(128)
      expect(AliasMap.size).toBe(1)
      expect(AliasMap.get('paragraph')).toBe(28)
    })

    it('update an alias', function () {
      const AliasMap : AliasMap<number> = new AliasMap(128)

      AliasMap.declare('paragraph', 28)

      expect(AliasMap.capacity).toBe(128)
      expect(AliasMap.size).toBe(1)
      expect(AliasMap.get('paragraph')).toBe(28)

      AliasMap.declare('paragraph', 178)

      expect(AliasMap.capacity).toBe(128)
      expect(AliasMap.size).toBe(1)
      expect(AliasMap.get('paragraph')).toBe(178)
    })

    it('allows to declare multiple AliasMap', function () {
      const AliasMap : AliasMap<number> = new AliasMap(128)

      const values : [string, number][] = [
        ['paragraph', 128],
        ['potato', 128],
        ['potatoes', 56],
        ['clap', 12],
        ['clapclap', 8],
        ['clapclapclap', 6]
      ]

      expect(AliasMap.capacity).toBe(128)
      expect(AliasMap.size).toBe(0)

      for (const [alias, value] of values) {
        expect(AliasMap.get(alias)).toBeUndefined()
        AliasMap.declare(alias, value)
        expect(AliasMap.get(alias)).toBe(value)
      }

      expect(AliasMap.capacity).toBe(128)
      expect(AliasMap.size).toBe(values.length)
    })
  })

  describe('#delete', function () {
    it('remove an alias', function () {
      const AliasMap : AliasMap<number> = new AliasMap(128)

      const values : [string, number][] = [
        ['paragraph', 128],
        ['potato', 128],
        ['potatoes', 56],
        ['clap', 12],
        ['clapclap', 8],
        ['clapclapclap', 6]
      ]

      for (const [alias, value] of values) {
        AliasMap.declare(alias, value)
      }

      expect(AliasMap.capacity).toBe(128)
      expect(AliasMap.size).toBe(values.length)

      expect(AliasMap.get('clapclap')).toBe(8)
      AliasMap.delete('clapclap')
      expect(AliasMap.get('clapclap')).toBe(undefined)

      expect(AliasMap.capacity).toBe(128)
      expect(AliasMap.size).toBe(values.length - 1)
    })

    it('work on inexisting AliasMap', function () {
      const AliasMap : AliasMap<number> = new AliasMap(128)

      const values : [string, number][] = [
        ['paragraph', 128],
        ['potato', 128],
        ['potatoes', 56],
        ['clap', 12],
        ['clapclap', 8],
        ['clapclapclap', 6]
      ]

      for (const [alias, value] of values) {
        AliasMap.declare(alias, value)
      }

      expect(AliasMap.capacity).toBe(128)
      expect(AliasMap.size).toBe(values.length)

      expect(AliasMap.get('clapclop')).toBe(undefined)
      AliasMap.delete('clapclop')
      expect(AliasMap.get('clapclop')).toBe(undefined)

      expect(AliasMap.capacity).toBe(128)
      expect(AliasMap.size).toBe(values.length)
    })

    it('allows to remove multiple AliasMap', function () {
      const AliasMap : AliasMap<number> = new AliasMap(128)

      const values : [string, number][] = [
        ['paragraph', 128],
        ['potato', 128],
        ['potatoes', 56],
        ['clap', 12],
        ['clapclap', 8],
        ['clapclapclap', 6]
      ]

      for (const [alias, value] of values) {
        AliasMap.declare(alias, value)
      }

      expect(AliasMap.capacity).toBe(128)
      expect(AliasMap.size).toBe(values.length)

      for (const [alias, value] of values) {
        expect(AliasMap.get(alias)).toBe(value)
        AliasMap.delete(alias)
        expect(AliasMap.get(alias)).toBeUndefined()
      }

      expect(AliasMap.capacity).toBe(128)
      expect(AliasMap.size).toBe(0)
    })
  })

  describe('#clear', function () {
    it('empty the dictionary', function () {
      const AliasMap : AliasMap<number> = new AliasMap(128)

      const values : [string, number][] = [
        ['paragraph', 128],
        ['potato', 128],
        ['potatoes', 56],
        ['clap', 12],
        ['clapclap', 8],
        ['clapclapclap', 6]
      ]

      for (const [alias, value] of values) {
        AliasMap.declare(alias, value)
      }

      expect(AliasMap.capacity).toBe(128)
      expect(AliasMap.size).toBe(values.length)

      for (const [alias, value] of values) {
        expect(AliasMap.get(alias)).toBe(value)
      }

      AliasMap.clear()

      for (const [alias, value] of values) {
        expect(AliasMap.get(alias)).toBeUndefined()
      }

      expect(AliasMap.capacity).toBe(128)
      expect(AliasMap.size).toBe(0)
    })
  })
})
