import { DataObject } from "../DataObject"

import { UTF32StringNode } from "./UTF32StringNode"
import { UTF32String } from "./UTF32String"

/**
 * 
 */
export class UTF32StringTree implements DataObject<UTF32StringTree> {
  /**
   * 
   */
  private readonly _root: UTF32StringNode

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
  public has(value: UTF32String, offset: number = 0): boolean {
    return this._root.has(value, offset)
  }

  /**
   * 
   */
  public hasString(value: string, offset: number = 0): boolean {
    return this._root.hasString(value, offset)
  }

  /**
   * 
   */
  public add(value: UTF32String, offset: number = 0): this {
    this._root.add(value, offset)
    return this
  }

  /**
   * 
   */
  public addMany(values: Iterable<UTF32String>): this {
    for (const value of values) this._root.add(value)
    return this
  }

  /**
   * 
   */
  public addString(value: string, offset: number): this {
    this._root.addString(value, offset)
    return this
  }

  /**
   * 
   */
  public addManyString(values: Iterable<string>): this {
    for (const value of values) this._root.addString(value)
    return this
  }

  /**
   * 
   */
  public delete(value: UTF32String, offset: number = 0): this {
    this._root.delete(value, offset)
    return this
  }

  /**
   * 
   */
  public deleteMany(values: Iterable<UTF32String>): this {
    for (const value of values) this._root.delete(value)
    return this
  }

  /**
   * 
   */
  public deleteString(value: string, offset: number = 0): this {
    this._root.deleteString(value, offset)
    return this
  }

  /**
   * 
   */
  public deleteManyString(values: Iterable<string>): this {
    for (const value of values) this._root.deleteString(value)
    return this
  }

  /**
   * 
   */
  public values(container: UTF32String = UTF32String.allocate.withDefaultCapacity()): IterableIterator<UTF32String> {
    return this._root.values(container)
  }

  /**
   * 
   */
  public [Symbol.iterator](): IterableIterator<UTF32String> {
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
  public copy(toCopy: UTF32StringTree): this {
    this._root.copy(toCopy._root)
    return this
  }

  /**
   * @see Clonable.prototype.clone
   */
  public clone(): UTF32StringTree {
    return new UTF32StringTree().copy(this)
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