import { Pack } from '@cedric-demongivert/gl-tool-collection'
import { Sequence } from '@cedric-demongivert/gl-tool-collection'

import { UnidocLocation } from '../location/UnidocLocation'

import { UnidocPathElement } from './UnidocPathElement'

/**
* A path in a unidoc document.
*/
export class UnidocPath {
  /**
  * Elements of the path.
  */
  private readonly _elements : Pack<UnidocPathElement>

  /**
  * Elements of the path.
  */
  public readonly elements : Sequence<UnidocPathElement>

  /**
  * Instantiate a new empty path.
  *
  * @param [capacity = 16] - Capacity to pre-allocate for the path in element.
  */
  public constructor (capacity : number = 16) {
    this._elements = Pack.instance(UnidocPathElement.ALLOCATOR, capacity)
    this.elements  = this._elements.view()
  }

  /**
  * @return The maximum number of element in this path.
  */
  public get capacity () : number {
    return this._elements.capacity
  }

  /**
  * @return The number of element in this path.
  */
  public get size () : number {
    return this._elements.size
  }

  /**
  * Update the number of element into this path.
  *
  * @param size - The new number of element into this path.
  */
  public set size (size : number) {
    this._elements.size = size
  }

  /**
  * @see Sequence.last
  */
  public get last () : UnidocPathElement {
    return this._elements.last
  }

  /**
  * @see Sequence.first
  */
  public get first () : UnidocPathElement {
    return this._elements.first
  }

  /**
  * Append the given element at the end of the path.
  *
  * @param step - New element to append at the end of the path.
  *
  * @return This path instance for chaining purpose.
  */
  public push (step : UnidocPathElement) : UnidocPath {
    this._elements.push(step)

    return this
  }

  /**
  * Push a new symbol at the end of this path.
  *
  * @param location - Location of the symbol in its parent document.
  *
  * @return This path instance for chaining purpose.
  */
  public pushSymbol (location : UnidocLocation) : UnidocPath {
    this._elements.size += 1
    this._elements.last.asSymbol(location)

    return this
  }

  /**
  * Push a new tag at the end of this path.
  *
  * @param from - Starting location of the tag in its parent document.
  * @param to - Ending location of the tag in its parent document, may be unknown.
  * @param configuration - Type, identifier and classes of the tag to append.
  *
  * @return This path instance for chaining purpose.
  */
  public pushTag (from : UnidocLocation, to : UnidocLocation, configuration : string = '') : UnidocPath {
    this._elements.size += 1
    this._elements.last.asTag(from, to, configuration)

    return this
  }

  /**
  * Push a stream element into this path.
  *
  * @param from - Starting location in the stream, may be unknown.
  * @param [to = from] - Ending location in the stream, may be unknown.
  *
  * @return This path instance for chaining purpose.
  */
  public pushStream (from : UnidocLocation, to : UnidocLocation = from) : UnidocPath {
    this._elements.size += 1
    this._elements.last.asStream(from, to)

    return this
  }

  /**
  * Push a memory element into this path.
  *
  * @param name - Name associated to the memory element.
  * @param from - Starting location in memory, may be unknown.
  * @param [to = from] - Ending location in memory, may be unknown.
  *
  * @return This path instance for chaining purpose.
  */
  public pushMemory (name : string, from : UnidocLocation, to : UnidocLocation = from) : UnidocPath {
    this._elements.size += 1
    this._elements.last.asMemory(name, from, to)

    return this
  }

  /**
  * Push a file element into this path.
  *
  * @param url - URL of the file.
  * @param from - Starting location in the file, may be unknown.
  * @param [to = from] - Ending location in the file, may be unknown.
  *
  * @return This path instance for chaining purpose.
  */
  public pushFile (url : string, from : UnidocLocation, to : UnidocLocation = from) : UnidocPath {
    this._elements.size += 1
    this._elements.last.asFile(url, from, to)

    return this
  }

  public snapToEnd () : UnidocPath {
    for (const element of this._elements) {
      element.from.copy(element.to)
    }

    return this
  }

  public snapToStart () : UnidocPath {
    for (const element of this._elements) {
      element.to.copy(element.from)
    }

    return this
  }

  /**
  * Replace an element of this path.
  *
  * @param index - The index of the element to replace.
  * @param step - The element to set at the given index.
  */
  public set (index : number, step : UnidocPathElement) : void {
    this._elements.set(index, step)
  }

  /**
  * Replace an element of this path with a symbol element.
  *
  * @param index - The index of the element to replace.
  * @param location - Location of the symbol in its parent document.
  */
  public setSymbol (index : number, location : UnidocLocation) : void {
    this._elements.get(index).asSymbol(location)
  }

  /**
  * Replace an element of this path with a tag element.
  *
  * @param index - The index of the element to replace.
  * @param from - Starting location of the tag in its parent document.
  * @param to - Ending location of the tag in its parent document, may be unknown.
  * @param configuration - Type, identifier and classes of the tag to append.
  */
  public setTag (index : number, from : UnidocLocation, to : UnidocLocation, configuration : string = '') : void {
    this._elements.get(index).asTag(from, to, configuration)
  }

  /**
  * Concat the given path at the end of this path.
  *
  * All concatenated elements will be deep-copied.
  *
  * @param toConcat - A path to append at the end of this path.
  */
  public concat (toConcat : UnidocPath) : void {
    for (const element of toConcat._elements) {
      this._elements.push(element)
    }
  }

  /**
  * Delete the elements in the given range.
  *
  * @param from - Index of the first element to delete.
  * @param [length = 1] - Number of elements to delete.
  */
  public delete (from : number, length : number = 1) : void {
    this._elements.deleteMany(from, length)
  }

  /**
  * Delete the last element of the path.
  */
  public pop () : void {
    this._elements.pop()
  }

  /**
  * Update this path to keep only the given subpath.
  *
  * @param from - Index of the first element to keep.
  * @param [length = 1] - Number of elements to keep.
  */
  public keep (from : number, length : number = 1) : void {
    this._elements.size = from + length
    this._elements.deleteMany(0, from)
  }

  /**
  * @return A deep copy of this path.
  */
  public clone () : UnidocPath {
    const result : UnidocPath = new UnidocPath(this.size)
    result.copy(this)
    return result
  }

  /**
  * Deeply copy the given path.
  *
  * @param toCopy - A path instance to copy.
  */
  public copy (toCopy : UnidocPath) : void {
    this._elements.size = 0

    for (const element of toCopy._elements) {
      this._elements.push(element)
    }
  }

  /**
  * Empty this path.
  */
  public clear () : void {
    this._elements.clear()
  }

  /**
  * @see Object#toString
  */
  public toString () : string {
    let result : string = ''

    for (const element of this.elements) {
      if (result.length > 0) { result += ' > ' }
      result += element.toString()
    }

    return result
  }

  /**
  * @see Object#equals
  */
  public equals (other : any) : boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocPath) {
      if (other._elements.size !== this._elements.size) {
        return false
      }

      for (let index = 0, length = other.size; index < length; ++index) {
        if (!this._elements.get(index).equals(other._elements.get(index))) {
          return false
        }
      }

      return true
    }

    return false
  }

  /**
  * @see Symbol.iterator
  */
  public * [Symbol.iterator] () : Iterator<UnidocPathElement> {
    yield * this._elements
  }
}

export namespace UnidocPath {
  /**
  * Class of each instance of a path element.
  */
  export const Element = UnidocPathElement

  /**
  * An empty unidoc path.
  */
  export const EMPTY : UnidocPath = new UnidocPath(0)

  /**
  * Instantiate a new unidoc path of the given capacity.
  *
  * @param capacity - Capacity of the path to instantiate.
  *
  * @return An instance of unidoc path of the given capacity.
  */
  export function create (capacity : number) : UnidocPath {
    return new UnidocPath(capacity)
  }

  export function memory (name : string, from : UnidocLocation, to : UnidocLocation) : UnidocPath
  export function memory (name : string, from : [number, number, number], to : [number, number, number]) : UnidocPath
  export function memory (name : string, from : UnidocLocation | [number, number, number], to : UnidocLocation | [number, number, number] = from) : UnidocPath {
    return UnidocPath.create(1).pushMemory(
      name,
      from instanceof UnidocLocation ? from : new UnidocLocation(...from),
      to instanceof UnidocLocation ? to : new UnidocLocation(...to))
  }

  /**
  * Instantiate a deep copy of the given instance.
  *
  * @param toCopy - An instance to copy.
  *
  * @return A deep copy of the given instance.
  */
  export function copy (toCopy : UnidocPath) : UnidocPath
  export function copy (toCopy : null) : null
  export function copy (toCopy : UnidocPath | null) : UnidocPath | null {
    return toCopy == null ? toCopy : toCopy.clone()
  }
}
