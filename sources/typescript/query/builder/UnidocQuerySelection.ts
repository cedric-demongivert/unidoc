import { IdentifierSet } from '@cedric-demongivert/gl-tool-collection'
import { Sequence } from '@cedric-demongivert/gl-tool-collection'

import { UnidocQuery } from '../UnidocQuery'
import { UnidocQueryState } from '../UnidocQueryState'

export class UnidocQuerySelection {
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
  * A readonly view over all selected elements.
  */
  public readonly elements : Sequence<number>

  /**
  * Instantiate a new empty selection of states.
  *
  * @param query - The parent query of this selection.
  */
  public constructor (query : UnidocQuery) {
    this._elements = IdentifierSet.allocate(query.states.capacity)
    this._query = query
    this.elements = this._elements.view()
  }

  /**
  * @return The parent query of this selection.
  */
  public get query () : UnidocQuery {
    return this._query
  }

  public set query (query : UnidocQuery) {
    this._query = query
    this._elements.clear()
  }

  public select (element : UnidocQueryState) {
    if (element.query !== this._query) {
      throw new Error(
        'Unable to select a state from a query that is not the parent query ' +
        'of this selection.'
      )
    }

    this._elements.push(element)
  }
}
