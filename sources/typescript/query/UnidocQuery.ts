import { UnidocQueryState } from './UnidocQueryState'
import { UnidocQueryStateCollection } from './UnidocQueryStateCollection'
import { UnidocQueryRelationshipCollection } from './UnidocQueryRelationshipCollection'

export class UnidocQuery {
  /**
  * This query input state. The input state is the state in wich this query
  * is when it's execution begins.
  */
  public readonly input : UnidocQueryState

  /**
  * This query output state. Entering into the output state of a query trigger
  * the emission of a chain of events.
  */
  public readonly output : UnidocQueryState

  /**
  * A collection of all states of this query.
  */
  public readonly states : UnidocQueryStateCollection

  /**
  * A collection of all states of this query.
  */
  public readonly relationships : UnidocQueryRelationshipCollection

  public constructor (states : number = 8, relationships : number = 16) {
    this.states = new UnidocQueryStateCollection(this, states)
    this.relationships = new UnidocQueryRelationshipCollection(this, relationships)

    this.input = this.states.state()
    this.output = this.states.state()
  }
}
