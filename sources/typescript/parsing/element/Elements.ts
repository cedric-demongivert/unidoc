import {
  IdentifierSet, Sets, Collection, RandomAccessIterator
} from '@cedric-demongivert/gl-tool-collection'

import { Element } from './Element'

/**
* A set of Unidoc element.
*
* @see Unidoc.Element element
*/
export class Elements {
  /**
  * A set that contains the identifier of each existing Unidoc element.
  */
  private _identifiers : IdentifierSet

  /**
  * @return The number of Unidoc element in this set.
  */
  public get size () : number {
    return this._identifiers.size
  }

  /**
  * @return The maximum number of Unidoc element that this set can store.
  */
  public get capacity () : number {
    return this._identifiers.capacity
  }

  /**
  * Instantiate an empty Unidoc element set with a given capacity.
  *
  * @param [capacity = 32] - Initial capacity of the new Unidoc element set.
  */
  public constructor (capacity : number = 32) {
    this._identifiers = Sets.identifier(capacity)
  }

  /**
  * Declare an Unidoc element.
  *
  * @param Unidoc element - The Unidoc element to declare.
  */
  public declare (element : Element) : void {
    this._identifiers.add(Unidoc element)
  }

  /**
  * Create a new Unidoc element.
  *
  * @return The new Unidoc element.
  */
  public create () : Element {
    return this._identifiers.next()
  }

  /**
  * Return an Unidoc element of this set.
  *
  * @param index - Index of the Unidoc element to return.
  *
  * @return The Unidoc element at the given index in this set.
  */
  public get (index : number) : Element {
    return this._identifiers.get(index)
  }

  /**
  * Remove an existing Unidoc element.
  *
  * @param Unidoc element - The Unidoc element to remove from this set.
  */
  public delete (element : Element) : void {
    this._identifiers.delete(element)
  }

  /**
  * Empty this collection of elements.
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
  * @return An iterator over this set of Unidoc elements.
  */
  public iterator () : RandomAccessIterator<Element> {
    return this._identifiers.iterator()
  }

  /**
  * @see Object.equals
  */
  public equals (other : any) : boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof Elements) {
      return other._identifiers.equals(this._identifiers)
    }

    return false
  }

  /**
  * @see Symbol.iterator
  */
  public * [Symbol.iterator] () : Iterator<Element> {
    yield * this._identifiers
  }
}
