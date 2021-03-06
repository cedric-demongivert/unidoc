import { DataObject } from "../DataObject"

import { UTF32StringNode } from "./UTF32StringNode"
import { UTF32String } from "./UTF32String"

/**
 * 
 */
export class UTF32StringTree<Value> implements DataObject<UTF32StringTree<Value>> {
  /**
   * 
   */
  private readonly _root: UTF32StringNode<Value>

  /**
   * 
   */
  public get size(): number {
    return this._root.size
  }

  /**
   * 
   */
  public constructor() {
    this._root = new UTF32StringNode()
  }

  /**
   * 
   */
  public has(key: UTF32String, offset: number = 0): boolean {
    return this._root.has(key, offset)
  }

  /**
   * 
   */
  public hasString(key: string, offset: number = 0): boolean {
    return this._root.hasString(key, offset)
  }

  /**
   * 
   */
  public get(key: UTF32String, offset: number = 0): Value | undefined {
    return this._root.get(key, offset)
  }

  /**
   * 
   */
  public getString(key: string, offset: number = 0): Value | undefined {
    return this._root.getString(key, offset)
  }

  /**
   * 
   */
  public set(key: UTF32String, value: Value, offset: number = 0): this {
    this._root.set(key, value, offset)
    return this
  }

  /**
   * 
   */
  public setMany(keys: Iterable<UTF32String>, value: Value): this {
    for (const key of keys) this._root.set(key, value)
    return this
  }

  /**
   * 
   */
  public setString(key: string, value: Value, offset: number = 0): this {
    this._root.setString(key, value, offset)
    return this
  }

  /**
   * 
   */
  public setManyString(keys: Iterable<string>, value: Value): this {
    for (const key of keys) this._root.setString(key, value)
    return this
  }

  /**
   * 
   */
  public delete(key: UTF32String, offset: number = 0): this {
    this._root.delete(key, offset)
    return this
  }

  /**
   * 
   */
  public deleteMany(keys: Iterable<UTF32String>): this {
    for (const key of keys) this._root.delete(key)
    return this
  }

  /**
   * 
   */
  public deleteString(key: string, offset: number = 0): this {
    this._root.deleteString(key, offset)
    return this
  }

  /**
   * 
   */
  public deleteManyString(keys: Iterable<string>): this {
    for (const key of keys) this._root.deleteString(key)
    return this
  }

  /**
   * 
   */
  public values(): IterableIterator<Value> {
    return this._root.values()
  }

  /**
   * 
   */
  public keys(container: UTF32String = UTF32String.allocate.withDefaultCapacity()): IterableIterator<UTF32String> {
    return this._root.keys(container)
  }

  /**
   * 
   */
  public [Symbol.iterator](): IterableIterator<Value> {
    return this._root.values()
  }

  /**
   * @see Clearable.prototype.clear
   */
  public clear(): this {
    this._root.clear()
    return this
  }

  /**
   * @see Assignable.prototype.copy
   */
  public copy(toCopy: UTF32StringTree<Value>): this {
    this._root.copy(toCopy._root)
    return this
  }

  /**
   * @see Clonable.prototype.clone
   */
  public clone(): UTF32StringTree<Value> {
    return new UTF32StringTree<Value>().copy(this)
  }

  /**
   * @see Comparable.prototype.equals
   */
  public equals(other: unknown): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UTF32StringTree) {
      return other._root.equals(this._root)
    }

    return false
  }
}