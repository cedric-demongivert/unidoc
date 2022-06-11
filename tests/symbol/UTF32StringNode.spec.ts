/** eslint-env jest */

import { Empty } from '@cedric-demongivert/gl-tool-utils'
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
  describe('set', function () {
    /**
     * 
     */
    it('add a string to the tree', function () {
      const node: UTF32StringNode<number> = new UTF32StringNode()
      const value: UTF32String = UTF32String.fromString('alluberque')

      expect(node.size).toBe(0)
      expect(node.has(value)).toBeFalsy()
      expect(node.get(value)).toBeUndefined()

      node.set(value, 5)

      expect(node.size).toBe(1)
      expect(node.has(value)).toBeTruthy()
      expect(node.get(value)).toBe(5)
    })

    /**
     * 
     */
    it('update a string of the tree', function () {
      const node: UTF32StringNode<number> = new UTF32StringNode()
      const value: UTF32String = UTF32String.fromString('alluberque')

      node.set(value, 5)

      expect(node.size).toBe(1)
      expect(node.has(value)).toBeTruthy()
      expect(node.get(value)).toBe(5)

      node.set(value, 10)

      expect(node.size).toBe(1)
      expect(node.has(value)).toBeTruthy()
      expect(node.get(value)).toBe(10)
    })

    /**
     * 
     */
    it('adds empty strings to the tree', function () {
      const node: UTF32StringNode<number> = new UTF32StringNode()

      expect(node.size).toBe(0)
      expect(node.has(UTF32String.EMPTY)).toBeFalsy()
      expect(node.get(UTF32String.EMPTY)).toBeUndefined()

      node.set(UTF32String.EMPTY, 5)

      expect(node.size).toBe(1)
      expect(node.has(UTF32String.EMPTY)).toBeTruthy()
      expect(node.get(UTF32String.EMPTY)).toBe(5)
    })

    /**
     * 
     */
    it('adds forks to the tree', function () {
      const node: UTF32StringNode<number> = new UTF32StringNode()
      const first: UTF32String = UTF32String.fromString('paricii')
      const second: UTF32String = UTF32String.fromString('parisoo')

      expect(node.size).toBe(0)
      expect(node.has(first)).toBeFalsy()
      expect(node.has(second)).toBeFalsy()
      expect(node.get(first)).toBeUndefined()
      expect(node.get(second)).toBeUndefined()

      node.set(first, 3)
      node.set(second, 5)

      expect(node.size).toBe(2)
      expect(node.has(first)).toBeTruthy()
      expect(node.has(second)).toBeTruthy()
      expect(node.get(first)).toBe(3)
      expect(node.get(second)).toBe(5)
    })

    /**
     * 
     */
    it('adds splits to the tree', function () {
      const node: UTF32StringNode<number> = new UTF32StringNode()
      const first: UTF32String = UTF32String.fromString('parisii')
      const second: UTF32String = UTF32String.fromString('paris')

      expect(node.size).toBe(0)
      expect(node.has(first)).toBeFalsy()
      expect(node.has(second)).toBeFalsy()
      expect(node.get(first)).toBeUndefined()
      expect(node.get(second)).toBeUndefined()

      node.set(first, 3)

      expect(node.size).toBe(1)
      expect(node.has(first)).toBeTruthy()
      expect(node.has(second)).toBeFalsy()
      expect(node.get(first)).toBe(3)
      expect(node.get(second)).toBeUndefined()

      node.set(second, 5)

      expect(node.size).toBe(2)
      expect(node.has(first)).toBeTruthy()
      expect(node.has(second)).toBeTruthy()
      expect(node.get(first)).toBe(3)
      expect(node.get(second)).toBe(5)
    })
  })

  /**
   * 
   */
  describe('setString', function () {
    /**
     * 
     */
    it('adds a string to the tree', function () {
      const node: UTF32StringNode<number> = new UTF32StringNode()

      expect(node.size).toBe(0)
      expect(node.hasString('alluberque')).toBeFalsy()
      expect(node.getString('alluberque')).toBeUndefined()

      node.setString('alluberque', 5)

      expect(node.size).toBe(1)
      expect(node.hasString('alluberque')).toBeTruthy()
      expect(node.getString('alluberque')).toBe(5)
    })

    /**
     * 
     */
    it.only('update a string of the tree', function () {
      const node: UTF32StringNode<number> = new UTF32StringNode()

      node.setString('alluberque', 5)

      expect(node.size).toBe(1)
      expect(node.hasString('alluberque')).toBeTruthy()
      expect(node.getString('alluberque')).toBe(5)

      node.setString('alluberque', 10)

      expect(node.size).toBe(1)
      expect(node.hasString('alluberque')).toBeTruthy()
      expect(node.getString('alluberque')).toBe(10)
    })

    /**
     * 
     */
    it('adds empty strings to the tree', function () {
      const node: UTF32StringNode<number> = new UTF32StringNode()

      expect(node.size).toBe(0)
      expect(node.hasString(Empty.STRING)).toBeFalsy()
      expect(node.getString(Empty.STRING)).toBeUndefined()

      node.setString(Empty.STRING, 5)

      expect(node.size).toBe(1)
      expect(node.hasString(Empty.STRING)).toBeTruthy()
      expect(node.getString(Empty.STRING)).toBe(5)
    })

    /**
     * 
     */
    it('adds forks to the tree', function () {
      const node: UTF32StringNode<number> = new UTF32StringNode()

      expect(node.size).toBe(0)
      expect(node.hasString('paricii')).toBeFalsy()
      expect(node.hasString('parisoo')).toBeFalsy()
      expect(node.getString('paricii')).toBeUndefined()
      expect(node.getString('parisoo')).toBeUndefined()

      node.setString('paricii', 5)
      node.setString('parisoo', 3)

      expect(node.size).toBe(2)
      expect(node.hasString('paricii')).toBeTruthy()
      expect(node.hasString('parisoo')).toBeTruthy()
      expect(node.getString('paricii')).toBe(5)
      expect(node.getString('parisoo')).toBe(3)
    })

    /**
     * 
     */
    it('adds splits to the tree', function () {
      const node: UTF32StringNode<number> = new UTF32StringNode()

      expect(node.size).toBe(0)
      expect(node.hasString('parisii')).toBeFalsy()
      expect(node.hasString('paris')).toBeFalsy()
      expect(node.getString('parisii')).toBeUndefined()
      expect(node.getString('paris')).toBeUndefined()

      node.setString('parisii', 5)

      expect(node.size).toBe(1)
      expect(node.hasString('parisii')).toBeTruthy()
      expect(node.hasString('paris')).toBeFalsy()
      expect(node.getString('parisii')).toBe(5)
      expect(node.getString('paris')).toBeUndefined()

      node.setString('paris', 3)

      expect(node.size).toBe(2)
      expect(node.hasString('parisii')).toBeTruthy()
      expect(node.hasString('paris')).toBeTruthy()
      expect(node.getString('parisii')).toBe(5)
      expect(node.getString('paris')).toBe(3)
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
      const node: UTF32StringNode<number> = new UTF32StringNode()
      const value: UTF32String = UTF32String.fromString('alluberque')

      node.set(value, 5)

      expect(node.size).toBe(1)
      expect(node.has(value)).toBeTruthy()
      expect(node.get(value)).toBe(5)

      node.delete(value)

      expect(node.size).toBe(0)
      expect(node.has(value)).toBeFalsy()
      expect(node.get(value)).toBeUndefined()
    })

    /**
     * 
     */
    it('deletes empty strings of the tree', function () {
      const node: UTF32StringNode<number> = new UTF32StringNode()

      node.set(UTF32String.EMPTY, 5)

      expect(node.size).toBe(1)
      expect(node.has(UTF32String.EMPTY)).toBeTruthy()
      expect(node.get(UTF32String.EMPTY)).toBe(5)

      node.delete(UTF32String.EMPTY)

      expect(node.size).toBe(0)
      expect(node.has(UTF32String.EMPTY)).toBeFalsy()
      expect(node.get(UTF32String.EMPTY)).toBeUndefined()
    })

    /**
     * 
     */
    it('resolves forks', function () {
      const node: UTF32StringNode<number> = new UTF32StringNode()
      const first: UTF32String = UTF32String.fromString('paricii')
      const second: UTF32String = UTF32String.fromString('parisoo')

      node.set(first, 5)
      node.set(second, 3)

      expect(node.size).toBe(2)
      expect(node.has(first)).toBeTruthy()
      expect(node.has(second)).toBeTruthy()
      expect(node.get(first)).toBe(5)
      expect(node.get(second)).toBe(3)

      node.delete(second)

      expect(node.size).toBe(1)
      expect(node.has(first)).toBeTruthy()
      expect(node.has(second)).toBeFalsy()
      expect(node.get(first)).toBe(5)
      expect(node.get(second)).toBeUndefined()
    })

    /**
     * 
     */
    it('resolves splits', function () {
      const node: UTF32StringNode<number> = new UTF32StringNode()
      const first: UTF32String = UTF32String.fromString('parisii')
      const second: UTF32String = UTF32String.fromString('paris')

      node.set(first, 5)
      node.set(second, 3)

      expect(node.size).toBe(2)
      expect(node.has(first)).toBeTruthy()
      expect(node.has(second)).toBeTruthy()
      expect(node.get(first)).toBe(5)
      expect(node.get(second)).toBe(3)

      node.delete(second)

      expect(node.size).toBe(1)
      expect(node.has(first)).toBeTruthy()
      expect(node.has(second)).toBeFalsy()
      expect(node.get(first)).toBe(5)
      expect(node.get(second)).toBeUndefined()
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
      const node: UTF32StringNode<number> = new UTF32StringNode()

      node.setString('alluberque', 5)

      expect(node.size).toBe(1)
      expect(node.hasString('alluberque')).toBeTruthy()
      expect(node.getString('alluberque')).toBe(5)

      node.deleteString('alluberque')

      expect(node.size).toBe(0)
      expect(node.hasString('alluberque')).toBeFalsy()
      expect(node.getString('alluberque')).toBeUndefined()
    })

    /**
     * 
     */
    it('deletes empty strings of the tree', function () {
      const node: UTF32StringNode<number> = new UTF32StringNode()

      node.setString(Empty.STRING, 5)

      expect(node.size).toBe(1)
      expect(node.hasString(Empty.STRING)).toBeTruthy()
      expect(node.getString(Empty.STRING)).toBe(5)

      node.deleteString(Empty.STRING)

      expect(node.size).toBe(0)
      expect(node.hasString(Empty.STRING)).toBeFalsy()
      expect(node.getString(Empty.STRING)).toBeUndefined()
    })

    /**
     * 
     */
    it('resolves forks', function () {
      const node: UTF32StringNode<number> = new UTF32StringNode()

      node.setString('paricii', 5)
      node.setString('parisoo', 3)

      expect(node.size).toBe(2)
      expect(node.hasString('paricii')).toBeTruthy()
      expect(node.hasString('parisoo')).toBeTruthy()
      expect(node.getString('paricii')).toBe(5)
      expect(node.getString('parisoo')).toBe(3)

      node.deleteString('parisoo')

      expect(node.size).toBe(1)
      expect(node.hasString('paricii')).toBeTruthy()
      expect(node.hasString('parisoo')).toBeFalsy()
      expect(node.getString('paricii')).toBe(5)
      expect(node.getString('parisoo')).toBeUndefined()
    })

    /**
     * 
     */
    it('resolves splits', function () {
      const node: UTF32StringNode<number> = new UTF32StringNode()

      node.setString('parisii', 5)
      node.setString('paris', 3)

      expect(node.size).toBe(2)
      expect(node.hasString('parisii')).toBeTruthy()
      expect(node.hasString('paris')).toBeTruthy()
      expect(node.getString('parisii')).toBe(5)
      expect(node.getString('paris')).toBe(3)

      node.deleteString('paris')

      expect(node.size).toBe(1)
      expect(node.hasString('parisii')).toBeTruthy()
      expect(node.hasString('paris')).toBeFalsy()
      expect(node.getString('parisii')).toBe(5)
      expect(node.getString('paris')).toBeUndefined()
    })
  })
})
