import { IdentifierSet } from '@cedric-demongivert/gl-tool-collection'
import { BidirectionalIterator } from '@cedric-demongivert/gl-tool-collection'

import { Tag } from './Tag'

/**
* A set of Unidoc tag.
*
* @see Unidoc.Tag
*/
export class Set {
  /**
  * A set that contains the identifier of each existing Unidoc tag.
  */
  private _identifiers : IdentifierSet

  /**
  * @return The number of Unidoc tag in this set.
  */
  public get size () : number {
    return this._identifiers.size
  }

  /**
  * @return The maximum number of Unidoc tag that this set can store.
  */
  public get capacity () : number {
    return this._identifiers.capacity
  }

  /**
  * Instantiate an empty Unidoc tag set with a given capacity.
  *
  * @param [capacity = 32] - Initial capacity of the new Unidoc tag set.
  */
  public constructor (capacity : number = 32) {
    this._identifiers = IdentifierSet.allocate(capacity)
  }

  /**
  * Declare an Unidoc tag.
  *
  * @param tag - The Unidoc tag to declare.
  */
  public declare (tag : Tag) : void {
    this._identifiers.add(tag)
  }

  /**
  * Create a new Unidoc tag.
  *
  * @return The new Unidoc tag.
  */
  public create () : Tag {
    return this._identifiers.next()
  }

  /**
  * Return an Unidoc  of this set.
  *
  * @param index - Index of the Unidoc  to return.
  *
  * @return The Unidoc  at the given index in this set.
  */
  public get (index : number) : Tag {
    return this._identifiers.get(index)
  }

  /**
  * Remove an existing Unidoc tag.
  *
  * @param tag - The Unidoc tag to remove from this set.
  */
  public delete (tag : Tag) : void {
    this._identifiers.delete(tag)
  }

  /**
  * Empty this collection of tag.
  */
  public clear () : void {
    this._identifiers.clear()
  }

  /**
  * Update the capacity of this set.
  *
  * @param capacity - The new capacity of this set.
  */
  public reallocate (capacity : number) : void {
    this._identifiers.reallocate(capacity)
  }

  /**
  * Optimize the capacity of this set.
  */
  public fit () : void {
    this._identifiers.fit()
  }

  /**
  * @return An iterator over this set of Unidoc tag.
  */
  public iterator () : BidirectionalIterator<Tag> {
    return this._identifiers.iterator()
  }

  /**
  * @see Object.equals
  */
  public equals (other : any) : boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof Set) {
      return other._identifiers.equals(this._identifiers)
    }

    return false
  }

  /**
  * @see Symbol.iterator
  */
  public * [Symbol.iterator] () : Iterator<Tag> {
    yield * this._identifiers
  }
}

export namespace Set {
  /**
  * Return a deep copy of the given instance.
  *
  * @param toCopy - An instance to copy.
  *
  * @return A deep copy of the given instance.
  */
  export function copy (toCopy : Set) : Set {
    const result : Set = new Set(toCopy.capacity)

    for (let index = 0, length = toCopy.size; index < length; ++index) {
      result.declare(toCopy.get(index))
    }

    return result
  }

  /**
  * Return a set that contains the tags in the given array.
  *
  * @param tags - Tags to store in the resulting set.
  *
  * @return A set that contains the tags in the given array.
  */
  export function fromArray (tags : Tag[]) : Set {
    const result : Set = new Set(Math.max(...tags))

    for (let index = 0, length = tags.length; index < length; ++index) {
      result.declare(tags[index])
    }

    return result
  }
}
