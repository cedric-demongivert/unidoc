import { Allocator, Duplicator, Pack } from "@cedric-demongivert/gl-tool-collection"

import { DataObject } from "../DataObject"

import { UnidocSequenceOrigin } from "./UnidocSequenceOrigin"
import { UnidocRange } from "./UnidocRange"

/**
 * A path to a given location in a source of symbols.
 */
export class UnidocPath implements DataObject {
  /**
   * 
   */
  public readonly elements: Pack<UnidocSequenceOrigin>

  /**
   * 
   */
  public get size(): number {
    return this.elements.size
  }

  /**
   * 
   */
  public set size(value: number) {
    this.elements.size = value
  }

  /**
   * 
   */
  public constructor(capacity: number = 8) {
    this.elements = Pack.instance(UnidocOrigin.ALLOCATOR, capacity)
  }

  /**
   * 
   */
  public reallocate(capacity: number): void {
    this.elements.reallocate(capacity)
  }

  /**
   * 
   */
  public push(value: UnidocOrigin): this {
    this.elements.push(value)
    return this
  }

  /**
   * 
   */
  public set(index: number, value: UnidocOrigin): this {
    this.elements.set(index, value)
    return this
  }

  /**
   * 
   */
  public delete(index: number): this {
    this.elements.delete(index)
    return this
  }

  /**
   * 
   */
  public get(index: number): UnidocOrigin {
    return this.elements.get(index)
  }

  /**
   * 
   */
  public keep(from: number, to: number): this {
    const size: number = to - from
    const elements: Pack<UnidocOrigin> = this.elements

    for (let index = 0; index < size; ++index) {
      elements.set(index, elements.get(from + index))
    }

    elements.size = size

    return this
  }

  /**
   * @mayBeDeleted
   */
  public inMemory(name: string, range: UnidocRange = UnidocRange.ZERO): this {
    this.elements.size += 1
    this.elements.last.inMemory(name).setLocation(range)
    return this
  }

  /**
   * @mayBeDeleted
   */
  public inFile(path: string, range: UnidocRange = UnidocRange.ZERO): this {
    this.elements.size += 1
    this.elements.last.inFile(path).setLocation(range)
    return this
  }

  /**
   * @mayBeDeleted
   */
  public inURI(uri: string, range: UnidocRange = UnidocRange.ZERO): this {
    this.elements.size += 1
    this.elements.last.inURI(uri).setLocation(range)
    return this
  }

  /**
   * 
   */
  public concat(toCopy: UnidocPath): void {
    this.elements.concat(toCopy.elements)
  }

  /**
   * @see DataObject.copy
   */
  public copy(toCopy: this): this {
    this.elements.copy(toCopy.elements)
    return this
  }

  /**
   * @see DataObject.clone
   */
  public clone(): UnidocPath {
    const result: UnidocPath = new UnidocPath(this.elements.capacity)
    result.copy(this)
    return result
  }

  /**
   * @see DataObject.clear
   */
  public clear(): this {
    this.elements.clear()
    return this
  }

  /**
  * @see Object.toString
  */
  public toString(): string {
    if (this.elements.size > 0) {
      let result: string = this.elements.first.toString()

      for (let index = 1; index < this.elements.size; ++index) {
        result += ', ' + this.elements.get(index).toString()
      }

      return result
    } else {
      return 'undefined origin'
    }
  }

  /**
  * @see DataObject.equals
  */
  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocPath) {
      return other.elements.equals(this.elements)
    }

    return false
  }
}

export namespace UnidocPath {
  /**
   * 
   */
  export function create(capacity: number = 0): UnidocPath {
    return new UnidocPath(capacity)
  }

  /**
   * 
   */
  export const ALLOCATOR: Allocator<UnidocPath> = Duplicator.fromFactory(create)
}