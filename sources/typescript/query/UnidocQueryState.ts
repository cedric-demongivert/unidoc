import { Sequence } from '@cedric-demongivert/gl-tool-collection'
import { Pack } from '@cedric-demongivert/gl-tool-collection'

import { UnidocQuery } from './UnidocQuery'
import { UnidocQueryRelationship } from './UnidocQueryRelationship'

export class UnidocQueryState {
  /**
  * This state's parent query.
  */
  public readonly query : UnidocQuery

  /**
  * This state's identifier in its parent query.
  */
  public readonly identifier : number

  /**
  * This state's outgoing relationships.
  */
  public readonly outputs : Sequence<UnidocQueryRelationship>

  /**
  * This state's ingoing relationships.
  */
  public readonly inputs : Sequence<UnidocQueryRelationship>

  /**
  * Mutable collection of outgoing relationships.
  */
  private readonly _outputs : Pack<UnidocQueryRelationship>

  /**
  * Mutable collection of ingoing relationships.
  */
  private readonly _inputs : Pack<UnidocQueryRelationship>

  public constructor (query : UnidocQuery, identifier? : number) {
    this.query = query
    this.assertThatIdentifierIsNotAlreadyUsed(identifier)

    if (identifier == null) {
      this.identifier = query.states.add(this)
    } else {
      this.identifier = identifier
      query.states.add(this)
    }
  }

  public addIngoingRelationship (value : UnidocQueryRelationship) : void {
    if (!this._inputs.has(value)) {
      this._inputs.push(value)
      value.to = this
    }
  }

  public addOutgoingRelationship (value : UnidocQueryRelationship) : void {
    if (!this._outputs.has(value)) {
      this._outputs.push(value)
      value.from = this
    }
  }

  public deleteIngoingRelationship (value : UnidocQueryRelationship) : void {
    const index : number = this._inputs.indexOf(value)

    if (index >= 0) {
      this._inputs.warp(index)
      value.to = null
    }
  }

  public deleteOutgoingRelationship (value : UnidocQueryRelationship) : void {
    const index : number = this._outputs.indexOf(value)

    if (index >= 0) {
      this._outputs.warp(index)
      value.from = null
    }
  }

  private assertThatIdentifierIsNotAlreadyUsed (identifier : number) : void {
    if (identifier != null && this.query.states.has(identifier)) {
      throw new Error(
        'Unable to instantiate a state with identifier ' + identifier +
        ' because the given identifier was already used by another state of ' +
        'this query.'
      )
    }
  }

  public equals (other : any) : boolean {
    return other === this
  }
}
