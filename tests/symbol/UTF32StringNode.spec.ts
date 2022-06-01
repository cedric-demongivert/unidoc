/** eslint-env jest */

import { Empty } from '@cedric-demongivert/gl-tool-utils'
import { UTF32CodeUnit } from '../../sources/symbol/UTF32CodeUnit'
import { UTF32String } from '../../sources/symbol/UTF32String'
import { UTF32StringNode } from '../../sources/symbol/UTF32StringNode'

/**
 * 
 */
describe('UTF32StringNode', function () {
  /**
   * 
   */
  describe('constructor', function () {
    /**
     * 
     */
    it('instantiates an empty node', function () {
      expect(new UTF32StringNode().size).toBe(0)
    })
  })

  /**
   * 
   */
  describe('add', function () {
    /**
     * 
     */
    it('adds a string to the tree', function () {
      const node: UTF32StringNode = new UTF32StringNode()
      const value: UTF32String = UTF32String.fromString('alluberque')

      expect(node.size).toBe(0)
      expect(node.has(value)).toBeFalsy()

      node.add(value)

      expect(node.size).toBe(1)
      expect(node.has(value)).toBeTruthy()
    })

    /**
     * 
     */
    it('adds empty strings to the tree', function () {
      const node: UTF32StringNode = new UTF32StringNode()

      expect(node.size).toBe(0)
      expect(node.has(UTF32String.EMPTY)).toBeFalsy()

      node.add(UTF32String.EMPTY)

      expect(node.size).toBe(1)
      expect(node.has(UTF32String.EMPTY)).toBeTruthy()
    })

    /**
     * 
     */
    it('adds forks to the tree', function () {
      const node: UTF32StringNode = new UTF32StringNode()
      const first: UTF32String = UTF32String.fromString('paricii')
      const second: UTF32String = UTF32String.fromString('parisoo')

      expect(node.size).toBe(0)
      expect(node.has(first)).toBeFalsy()
      expect(node.has(second)).toBeFalsy()

      node.add(first)
      node.add(second)

      expect(node.size).toBe(2)
      expect(node.has(first)).toBeTruthy()
      expect(node.has(second)).toBeTruthy()
    })

    /**
     * 
     */
    it('adds splits to the tree', function () {
      const node: UTF32StringNode = new UTF32StringNode()
      const first: UTF32String = UTF32String.fromString('parisii')
      const second: UTF32String = UTF32String.fromString('paris')

      expect(node.size).toBe(0)
      expect(node.has(first)).toBeFalsy()
      expect(node.has(second)).toBeFalsy()

      node.add(first)

      expect(node.size).toBe(1)
      expect(node.has(first)).toBeTruthy()
      expect(node.has(second)).toBeFalsy()

      node.add(second)

      expect(node.size).toBe(2)
      expect(node.has(first)).toBeTruthy()
      expect(node.has(second)).toBeTruthy()
    })
  })

  /**
   * 
   */
  describe('addString', function () {
    /**
     * 
     */
    it('adds a string to the tree', function () {
      const node: UTF32StringNode = new UTF32StringNode()

      expect(node.size).toBe(0)
      expect(node.hasString('alluberque')).toBeFalsy()

      node.addString('alluberque')

      expect(node.size).toBe(1)
      expect(node.hasString('alluberque')).toBeTruthy()
    })

    /**
     * 
     */
    it('adds empty strings to the tree', function () {
      const node: UTF32StringNode = new UTF32StringNode()

      expect(node.size).toBe(0)
      expect(node.hasString(Empty.STRING)).toBeFalsy()

      node.addString(Empty.STRING)

      expect(node.size).toBe(1)
      expect(node.hasString(Empty.STRING)).toBeTruthy()
    })

    /**
     * 
     */
    it('adds forks to the tree', function () {
      const node: UTF32StringNode = new UTF32StringNode()

      expect(node.size).toBe(0)
      expect(node.hasString('paricii')).toBeFalsy()
      expect(node.hasString('parisoo')).toBeFalsy()

      node.addString('paricii')
      node.addString('parisoo')

      expect(node.size).toBe(2)
      expect(node.hasString('paricii')).toBeTruthy()
      expect(node.hasString('parisoo')).toBeTruthy()
    })

    /**
     * 
     */
    it('adds splits to the tree', function () {
      const node: UTF32StringNode = new UTF32StringNode()
      const first: UTF32String = UTF32String.fromString('parisii')
      const second: UTF32String = UTF32String.fromString('paris')

      expect(node.size).toBe(0)
      expect(node.has(first)).toBeFalsy()
      expect(node.has(second)).toBeFalsy()

      node.add(first)

      expect(node.size).toBe(1)
      expect(node.has(first)).toBeTruthy()
      expect(node.has(second)).toBeFalsy()

      node.add(second)

      expect(node.size).toBe(2)
      expect(node.has(first)).toBeTruthy()
      expect(node.has(second)).toBeTruthy()
    })
  })

  /**
   * 
   */
  describe('delete', function () {
    /**
     * 
     */
    it('deletes a string of the tree', function () {
      const node: UTF32StringNode = new UTF32StringNode()
      const value: UTF32String = UTF32String.fromString('alluberque')

      node.add(value)

      expect(node.size).toBe(1)
      expect(node.has(value)).toBeTruthy()

      node.delete(value)

      expect(node.size).toBe(0)
      expect(node.has(value)).toBeFalsy()
    })

    /**
     * 
     */
    it('deletes empty strings of the tree', function () {
      const node: UTF32StringNode = new UTF32StringNode()

      node.add(UTF32String.EMPTY)

      expect(node.size).toBe(1)
      expect(node.has(UTF32String.EMPTY)).toBeTruthy()

      node.delete(UTF32String.EMPTY)

      expect(node.size).toBe(0)
      expect(node.has(UTF32String.EMPTY)).toBeFalsy()
    })

    /**
     * 
     */
    it('resolves forks', function () {
      const node: UTF32StringNode = new UTF32StringNode()
      const first: UTF32String = UTF32String.fromString('paricii')
      const second: UTF32String = UTF32String.fromString('parisoo')

      node.add(first)
      node.add(second)


      expect(node.size).toBe(2)
      expect(node.has(first)).toBeTruthy()
      expect(node.has(second)).toBeTruthy()

      node.delete(second)

      expect(node.size).toBe(1)
      expect(node.has(first)).toBeTruthy()
      expect(node.has(second)).toBeFalsy()
    })

    /**
     * 
     */
    it('resolves splits', function () {
      const node: UTF32StringNode = new UTF32StringNode()
      const first: UTF32String = UTF32String.fromString('parisii')
      const second: UTF32String = UTF32String.fromString('paris')

      node.add(first)
      node.add(second)


      expect(node.size).toBe(2)
      expect(node.has(first)).toBeTruthy()
      expect(node.has(second)).toBeTruthy()

      node.delete(second)

      expect(node.size).toBe(1)
      expect(node.has(first)).toBeTruthy()
      expect(node.has(second)).toBeFalsy()
    })
  })

  /**
   * 
   */
  describe('deleteString', function () {
    /**
     * 
     */
    it('deletes a string of the tree', function () {
      const node: UTF32StringNode = new UTF32StringNode()

      node.addString('alluberque')

      expect(node.size).toBe(1)
      expect(node.hasString('alluberque')).toBeTruthy()

      node.deleteString('alluberque')

      expect(node.size).toBe(0)
      expect(node.hasString('alluberque')).toBeFalsy()
    })

    /**
     * 
     */
    it('deletes empty strings of the tree', function () {
      const node: UTF32StringNode = new UTF32StringNode()

      node.addString(Empty.STRING)

      expect(node.size).toBe(1)
      expect(node.hasString(Empty.STRING)).toBeTruthy()

      node.deleteString(Empty.STRING)

      expect(node.size).toBe(0)
      expect(node.hasString(Empty.STRING)).toBeFalsy()
    })

    /**
     * 
     */
    it('resolves forks', function () {
      const node: UTF32StringNode = new UTF32StringNode()

      node.addString('paricii')
      node.addString('parisoo')

      expect(node.size).toBe(2)
      expect(node.hasString('paricii')).toBeTruthy()
      expect(node.hasString('parisoo')).toBeTruthy()

      node.deleteString('parisoo')

      expect(node.size).toBe(1)
      expect(node.hasString('paricii')).toBeTruthy()
      expect(node.hasString('parisoo')).toBeFalsy()
    })

    /**
     * 
     */
    it('resolves splits', function () {
      const node: UTF32StringNode = new UTF32StringNode()

      node.addString('parisii')
      node.addString('paris')

      expect(node.size).toBe(2)
      expect(node.hasString('parisii')).toBeTruthy()
      expect(node.hasString('paris')).toBeTruthy()

      node.deleteString('paris')

      expect(node.size).toBe(1)
      expect(node.hasString('parisii')).toBeTruthy()
      expect(node.hasString('paris')).toBeFalsy()
    })
  })
})
