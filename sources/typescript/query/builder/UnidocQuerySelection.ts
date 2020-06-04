import { IdentifierSet } from '@cedric-demongivert/gl-tool-collection'
import { Sequence } from '@cedric-demongivert/gl-tool-collection'
import { SequenceView } from '@cedric-demongivert/gl-tool-collection'
import { SequenceIterator } from '@cedric-demongivert/gl-tool-collection'

import { UnidocQuery } from '../UnidocQuery'
import { UnidocQueryStateCollection } from '../UnidocQueryStateCollection'
import { UnidocQueryState } from '../UnidocQueryState'

export class UnidocQuerySelection implements Sequence<UnidocQueryState> {
  /**
  * The parent query of this selection. All element of this selection must
  * belong to this query.
  */
  private _query  : UnidocQuery

  /**
  * A collection of selected element.
  */
  private _elements : IdentifierSet

  /**
  * Instantiate a new empty selection of states.
  *
  * @param query - The parent query of this selection.
  */
  public constructor (query : UnidocQuery) {
    this._elements = IdentifierSet.allocate(query.states.capacity)
    this._query = query
  }

  /**
  * @see Sequence.size
  */
  public get size () : number {
    return this._elements.size
  }

  /**
  * @return The parent query of this selection.
  */
  public get query () : UnidocQuery {
    return this._query
  }

  /**
  * Update the parent query of this selection.
  *
  * A change of the parent query of a selection will clear it of all of it's
  * previously selected elements.
  *
  * @param query - The new parent query of this selection.
  */
  public set query (query : UnidocQuery) {
    if (query !== this._query) {
      this._query = query
      this._elements.clear()
    }
  }

  /**
  * Select the given state.
  *
  * @param state - The state to select.
  */
  public select (state : UnidocQueryState) {
    if (state.query !== this._query) {
      throw new Error(
        'Unable to select a state from a query that is not the parent query ' +
        'of this selection.'
      )
    }

    this._elements.add(state.identifier)
  }

  /**
  * Deselect the given state.
  *
  * @param state - The state to deselect.
  */
  public delete (state : UnidocQueryState) {
    if (state.query !== this._query) {
      throw new Error(
        'Unable to deselect a state from a query that is not the parent ' +
        'query of this selection.'
      )
    }

    this._elements.delete(state.identifier)
  }

  /**
  * @see Sequence.get
  */
  public get (index : number) : UnidocQueryState {
    const states : UnidocQueryStateCollection = this._query.states
    return states.get(states.indexOf(this._elements.get(index)))
  }

  /**
  * @see Sequence.last
  */
  public get last () : UnidocQueryState {
    const states : UnidocQueryStateCollection = this._query.states
    return states.get(states.indexOf(this._elements.last))
  }

  /**
  * @see Sequence.lastIndex
  */
  public get lastIndex () : number {
    return this._elements.lastIndex
  }

  /**
  * @see Sequence.first
  */
  public get first () : UnidocQueryState {
    const states : UnidocQueryStateCollection = this._query.states
    return states.get(states.indexOf(this._elements.first))
  }

  /**
  * @see Sequence.firstIndex
  */
  public get firstIndex () : number {
    return this._elements.firstIndex
  }

  /**
  * @see Sequence.has
  */
  public has (element : UnidocQueryState) : boolean {
    return this._elements.has(element.identifier)
  }

  /**
  * @see Sequence.indexOf
  */
  public indexOf (element : UnidocQueryState) : number {
    return this._elements.indexOf(element.identifier)
  }

  /**
  * Copy the given selection.
  *
  * @param toCopy - A selection to copy.
  */
  public copy (toCopy : UnidocQuerySelection) : void {
    this._query = toCopy._query
    this._elements.copy(toCopy._elements)
  }

  /**
  * @see Sequence.clone
  */
  public clone () : UnidocQuerySelection {
    const copy : UnidocQuerySelection = new UnidocQuerySelection(this._query)
    copy._elements.copy(this._elements)

    return copy
  }

  /**
  * @see Sequence.view
  */
  public view () : Sequence<UnidocQueryState> {
    return new SequenceView(this)
  }

  /**
  * @see Sequence.iterator
  */
  public iterator() : SequenceIterator<UnidocQueryState> {
    const iterator : SequenceIterator<UnidocQueryState> = new SequenceIterator()

    iterator.sequence = this

    return iterator
  }

  /**
  * @see Sequence[Symbol.iterator]
  */
  public * [Symbol.iterator] () : Iterator<UnidocQueryState> {
    const states : UnidocQueryStateCollection = this._query.states

    for (const identifier of this._elements) {
      yield states.get(states.indexOf(this._elements.last))
    }
  }

  /**
  * @see Sequence.equals
  */
  public equals (other : any) : boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocQuerySelection) {
      return other._query === this._query &&
             other._elements.equals(this._elements)
    }

    return false
  }
}

export namespace UnidocQuerySelection {
  export function clone (selection : UnidocQuerySelection) : UnidocQuerySelection {
    return selection == null ? selection : selection.clone()
  }

  export function select (state : UnidocQueryState) : UnidocQuerySelection {
    const result : UnidocQuerySelection = new UnidocQuerySelection(state.query)
    result.select(state)
    return result
  }
}
