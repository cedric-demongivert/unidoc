import { UnidocQueryState } from './UnidocQueryState'
import { UnidocQueryStateCollection } from './UnidocQueryStateCollection'
import { UnidocQueryRelationshipCollection } from './UnidocQueryRelationshipCollection'

export class UnidocQuery {
  /**
  * This query initial state. The initial state is the state in wich this query
  * is when it's execution begins.
  */
  public readonly initial : UnidocQueryState

  /**
  * This query final state. Entering into the final state of a query trigger the
  * emission of a valid chain of events.
  */
  public readonly final : UnidocQueryState

  /**
  * This query error state. Entering into an error state drops a chain of event.
  */
  public readonly error : UnidocQueryState

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

    this.initial = this.states.state()
    this.final = this.states.state()
    this.error = this.states.state()
  }
}
