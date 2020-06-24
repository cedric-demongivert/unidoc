import { BidirectionalIterator } from '@cedric-demongivert/gl-tool-collection'
import { CollectionIterator } from '@cedric-demongivert/gl-tool-collection'

import { UnidocQueryStateCollection } from './UnidocQueryStateCollection'
import { UnidocQueryState } from './UnidocQueryState'

export class UnidocQueryStateCollectionIterator implements BidirectionalIterator<UnidocQueryState>
{
  /**
  * The parent pack of this iterator.
  */
  public parent : UnidocQueryStateCollection

  /**
  * The location of the element described by this iterator in the parent pack.
  */
  public index : number

  /**
  * Instantiate a new random access iterator instance.
  */
  public constructor () {
    this.parent = null
    this.index = 0
  }

  /**
  * @see Iterator.collection
  */
  public collection () : UnidocQueryStateCollection {
    return this.parent
  }

  /**
  * @see ForwardIterator.hasNext
  */
  public hasNext () : boolean {
    return this.parent && this.index < this.parent.size
  }

  /**
  * @see ForwardIterator.next
  */
  public next () : void {
    this.index += 1
  }

  /**
  * @see ForwardIterator.forward
  */
  public forward (count : number) : void {
    this.index += count
  }

  /**
  * @see ForwardIterator.end
  */
  public end () : void {
    this.index = this.parent ? this.parent.lastIndex : 0
  }

  /**
  * @see BackwardIterator.hasPrevious
  */
  public hasPrevious () : boolean {
    return this.parent && this.index > 0
  }

  /**
  * @see BackwardIterator.previous
  */
  public previous () : void {
    this.index -= 1
  }

  /**
  * @see BackwardIterator.backward
  */
  public backward (count : number) : void {
    this.index -= count
  }

  /**
  * @see BackwardIterator.start
  */
  public start () : void {
    this.index = 0
  }

  /**
  * @see Iterator.get
  */
  public get () : UnidocQueryState {
    return this.parent.get(this.index)
  }

  /**
  * @see Iterator.move
  */
  public move (iterator : CollectionIterator<UnidocQueryState>) : void {
    if (iterator instanceof UnidocQueryStateCollectionIterator) {
      this.parent = iterator.parent
      this.index = iterator.index
    } else {
      throw new Error(
        'Trying to move to a location described by an unsupported type of ' +
        'iterator'
      )
    }
  }

  /**
  * @see BidirectionalIterator.go
  */
  public go (index : number) : void {
    this.index = index
  }

  /**
  * Shallow-copy the given instance.
  *
  * @param toCopy
  */
  public copy (toCopy : UnidocQueryStateCollectionIterator) : void {
    this.parent = toCopy.parent
    this.index = toCopy.index
  }

  /**
  * @see Iterator.clone
  */
  public clone () : UnidocQueryStateCollectionIterator {
    const copy : UnidocQueryStateCollectionIterator = new UnidocQueryStateCollectionIterator()

    copy.copy(this)

    return copy
  }

  /**
  * @see Iterator.equals
  */
  public equals (other : any) : boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocQueryStateCollectionIterator) {
      return other.parent === this.parent &&
             other.index === this.index
    }

    return false
  }
}

export namespace UnidocQueryStateCollectionIterator {
  /**
  * Return a shallow copy of the given iterator.
  *
  * A shallow-copy *b* of an iterator *a* is an instance that follow both
  * properties :
  *  - b !== a
  *  - b.equals(a)
  *
  * @param toCopy - An iterator to copy.
  *
  * @return A shallow copy of the given iterator.
  */
  export function copy (toCopy : UnidocQueryStateCollectionIterator) : UnidocQueryStateCollectionIterator {
    return toCopy == null ? toCopy : toCopy.clone()
  }
}