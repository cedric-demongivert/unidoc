import { UnidocQueryRule } from '../UnidocQueryRule'
import { UnidocQueryRelationship } from '../UnidocQueryRelationship'

export class UnidocQueryExecution {
  /**
  * Executed relationship.
  */
  private _relationship : UnidocQueryRelationship

  /**
  *
  */
  private _rule : UnidocQueryRule

  /**
  * Begining of the path into the parent event stream.
  */
  public from : number

  /**
  * Ending of the path into the parent event stream.
  */
  public to : number

  public constructor (relationship : UnidocQueryRelationship) {
    this._relationship = relationship
    this._rule = relationship.rule()
    this.from = 0
    this.to = 0
  }

  public get relationship () : UnidocQueryRelationship {
    return this._relationship
  }

  public set relationship (relationship : UnidocQueryRelationship) {
    this._relationship = relationship
    this._rule = relationship.rule()
  }

  public get rule () : UnidocQueryRule {
    return this._rule
  }
}

export namespace UnidocQueryExecution {

}
