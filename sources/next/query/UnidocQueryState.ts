import { Sequence } from '@cedric-demongivert/gl-tool-collection'
import { Pack } from '@cedric-demongivert/gl-tool-collection'

import { UnidocQuery } from './UnidocQuery'
import { UnidocQueryRelationship } from './UnidocQueryRelationship'

import { UnidocQueryStateEvent } from './UnidocQueryStateEvent'

export class UnidocQueryState {
  /**
  * Parent query.
  */
  public readonly query : UnidocQuery

  /**
  * Unique number in a query that identify this state.
  */
  public readonly identifier : number

  /**
  * Outgoing relationships.
  */
  public readonly outputs : Sequence<UnidocQueryRelationship>

  /**
  * Ingoing relationships.
  */
  public readonly inputs : Sequence<UnidocQueryRelationship>

  /**
  * Events associated to this state.
  */
  public readonly events : Set<UnidocQueryStateEvent>

  /**
  * Mutable collection of outgoing relationships.
  */
  private readonly _outputs : Pack<UnidocQueryRelationship>

  /**
  * Mutable collection of ingoing relationships.
  */
  private readonly _inputs : Pack<UnidocQueryRelationship>

  /**
  * Instantiate a new state for the given query.
  *
  * @param query - The parent query of the new state to create.
  * @param [identifier] - Identifier of the state to create.
  *
  * @throw Error If the given identifier is already assigned to a state of the
  *              parent query.
  */
  public constructor (query : UnidocQuery, identifier? : number) {
    this.query = query
    this.assertThatIdentifierIsNotAlreadyUsed(identifier)

    if (identifier == null) {
      this.identifier = query.states.add(this)
    } else {
      this.identifier = identifier
      query.states.add(this)
    }

    this._outputs = Pack.any(4)
    this._inputs = Pack.any(4)

    this.outputs = this._outputs.view()
    this.inputs = this._inputs.view()
    this.events = new Set<UnidocQueryStateEvent>()
  }

  /**
  * Add a relationship that finish into this state.
  *
  * @param value - The relationship to add.
  */
  public addIngoingRelationship (value : UnidocQueryRelationship) : void {
    if (!this._inputs.has(value)) {
      this._inputs.push(value)
      value.to = this
    }
  }

  /**
  * Add a relationship that begins from this state.
  *
  * @param value - The relationship to add.
  */
  public addOutgoingRelationship (value : UnidocQueryRelationship) : void {
    if (!this._outputs.has(value)) {
      this._outputs.push(value)
      value.from = this
    }
  }

  /**
  * Delete a relationship that finish into this state.
  *
  * @param value - The relationship to delete.
  */
  public deleteIngoingRelationship (value : UnidocQueryRelationship) : void {
    const index : number = this._inputs.indexOf(value)

    if (index >= 0) {
      this._inputs.warp(index)
      value.to = null
    }
  }

  /**
  * Delete a relationship that begins from this state.
  *
  * @param value - The relationship to delete.
  */
  public deleteOutgoingRelationship (value : UnidocQueryRelationship) : void {
    const index : number = this._outputs.indexOf(value)

    if (index >= 0) {
      this._outputs.warp(index)
      value.from = null
    }
  }

  /**
  *
  */
  private assertThatIdentifierIsNotAlreadyUsed (identifier : number) : void {
    if (identifier != null && this.query.states.has(identifier)) {
      throw new Error(
        'Unable to instantiate a state with identifier ' + identifier +
        ' because the given identifier was already used by another state of ' +
        'this query.'
      )
    }
  }

  /**
  * @see Object#toString
  */
  public toString () : string {
    return 'UnidocQueryState@' + this.identifier
  }

  /**
  * @see Object#equals
  */
  public equals (other : any) : boolean {
    return other === this
  }
}
