import { DataObject } from "../DataObject"

import { UTF32StringNode } from "./UTF32StringNode"
import { UTF32String } from "./UTF32String"

/**
 * 
 */
export class UTF32StringSet implements DataObject<UTF32StringSet> {
  /**
   * 
   */
  private readonly _root: UTF32StringNode<boolean>

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
  public add(key: UTF32String, offset: number = 0): this {
    this._root.set(key, true, offset)
    return this
  }

  /**
   * 
   */
  public addMany(keys: Iterable<UTF32String>): this {
    for (const key of keys) this._root.set(key, true)
    return this
  }

  /**
   * 
   */
  public addString(key: string, offset: number = 0): this {
    this._root.setString(key, true, offset)
    return this
  }

  /**
   * 
   */
  public addManyString(keys: Iterable<string>): this {
    for (const key of keys) this._root.setString(key, true)
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
  public values(container: UTF32String = UTF32String.allocate.withDefaultCapacity()): IterableIterator<UTF32String> {
    return this._root.keys(container)
  }

  /**
   * 
   */
  public [Symbol.iterator](): IterableIterator<UTF32String> {
    return this._root.keys()
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
  public copy(toCopy: UTF32StringSet): this {
    this._root.copy(toCopy._root)
    return this
  }

  /**
   * @see Clonable.prototype.clone
   */
  public clone(): UTF32StringSet {
    return new UTF32StringSet().copy(this)
  }

  /**
   * @see Comparable.prototype.equals
   */
  public equals(other: unknown): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UTF32StringSet) {
      return other._root.equals(this._root)
    }

    return false
  }
}