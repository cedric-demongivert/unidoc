import { Pack } from '@cedric-demongivert/gl-tool-collection'
import { Sequence } from '@cedric-demongivert/gl-tool-collection'

import { UnidocLocation } from '../UnidocLocation'

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
  */
  public push (step : UnidocPathElement) : void {
    this._elements.push(step)
  }

  /**
  * Push a new symbol at the end of this path.
  *
  * @param location - Location of the symbol in its parent document.
  */
  public pushSymbol (location : UnidocLocation) : void {
    this._elements.size += 1
    this._elements.last.asSymbol(location)
  }

  /**
  * Push a new tag at the end of this path.
  *
  * @param from - Starting location of the tag in its parent document.
  * @param to - Ending location of the tag in its parent document, may be unknown.
  * @param configuration - Type, identifier and classes of the tag to append.
  */
  public pushTag (from : UnidocLocation, to : UnidocLocation, configuration : string = '') : void {
    this._elements.size += 1
    this._elements.last.asTag(from, to, configuration)
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
  * Copy the given path.
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
  }

  /**
  * @see Symbol.iterator
  */
  public * [Symbol.iterator] () : Iterator<UnidocPathElement> {
    yield * this._elements
  }
}

export namespace Path {
  /**
  * Instantiate a deep copy of the given instance.
  *
  * @param toCopy - An instance to copy.
  *
  * @return A deep copy of the given instance.
  */
  export function copy (toCopy : UnidocPath) : UnidocPath {
    const result : UnidocPath = new UnidocPath()

    result.copy(toCopy)

    return result
  }
}
