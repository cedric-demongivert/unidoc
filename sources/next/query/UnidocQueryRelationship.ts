import { UnidocQuery } from './UnidocQuery'
import { UnidocQueryState } from './UnidocQueryState'
import { UnidocQueryRuleFactory } from './UnidocQueryRuleFactory'
import { Anything } from './rule/Anything'

/**
* A unidoc validator state.
*/
export class UnidocQueryRelationship {
  /**
  * Parent unidoc validator.
  */
  public readonly query : UnidocQuery

  /**
  * Identifier of this relationship.
  */
  public readonly identifier : number

  /**
  * State at the begining of this relationship.
  */
  private _from : UnidocQueryState

  /**
  * State at the end of this relationship.
  */
  private _to : UnidocQueryState

  /**
  * The rule that define this relationship.
  */
  public rule : UnidocQueryRuleFactory<any>

  /**
  * Instantiate a new relationship for the given query.
  *
  * @param query - The parent query.
  */
  public constructor (query : UnidocQuery, identifier? : number) {
    this.query = query

    this.assertThatIdentifierIsNotAlreadyUsed(identifier)

    if (identifier == null) {
      this.identifier = query.relationships.add(this)
    } else {
      this.identifier = identifier
      query.relationships.add(this)
    }

    this._from = null
    this._to = null
    this.rule = Anything.factory
  }

  /**
  * @return The state that starts this relationship.
  */
  public get from () : UnidocQueryState {
    return this._from
  }

  /**
  * @return The state that terminate this relationship.
  */
  public get to () : UnidocQueryState {
    return this._to
  }

  /**
  * Update the state that starts this relationship.
  *
  * This operation auto-update the query in order to keep it valid.
  *
  * @param value - The new state that starts this relationship.
  */
  public set from (value : UnidocQueryState) {
    if (value !== this._from) {
      if (this._from != null) {
        const oldFrom : UnidocQueryState = this._from
        this._from = null
        oldFrom.deleteOutgoingRelationship(this)
      }

      this._from = value

      if (this._from != null) {
        value.addOutgoingRelationship(this)
      }
    }
  }

  /**
  * Update the state that terminate this relationship.
  *
  * This operation auto-update the query in order to keep it valid.
  *
  * @param value - The new state that terminate this relationship.
  */
  public set to (value : UnidocQueryState) {
    if (value !== this._to) {
      if (this._to != null) {
        const oldTo : UnidocQueryState = this._to
        this._to = null
        oldTo.deleteIngoingRelationship(this)
      }

      this._to = value

      if (this._to != null) {
        value.addIngoingRelationship(this)
      }
    }
  }

  /**
  *
  */
  private assertThatIdentifierIsNotAlreadyUsed (identifier : number) : void {
    if (identifier != null && this.query.relationships.has(identifier)) {
      throw new Error(
        'Unable to instantiate a relationship with identifier ' + identifier +
        ' because the given identifier was already used by another ' +
        'relationship of this query.'
      )
    }
  }

  /**
  * @see Object.toString
  */
  public toString () : string {
    return 'UnidocQueryRelationship@' + this.identifier + ' { from: ' +
    this.from.toString() + ', to ' + this.to.toString() + ' }'
  }

  /**
  * @see Object.equals
  */
  public equals (other : any) : boolean {
    return other === this
  }
}