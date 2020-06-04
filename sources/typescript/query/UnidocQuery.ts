import { UnidocQueryState } from './UnidocQueryState'
import { UnidocQueryStateCollection } from './UnidocQueryStateCollection'
import { UnidocQueryRelationshipCollection } from './UnidocQueryRelationshipCollection'

/**
* A query that recognize specific sub-streams of unidoc events into an overall
* stream of unidoc events.
*/
export class UnidocQuery {
  /**
  * This query input state. The input state is the state in wich this query
  * is when it's execution begins.
  */
  public readonly input : UnidocQueryState

  /**
  * A collection of all states of this query.
  */
  public readonly states : UnidocQueryStateCollection

  /**
  * A collection of all relationships of this query.
  */
  public readonly relationships : UnidocQueryRelationshipCollection

  /**
  * Instantiate a new empty unidoc query.
  *
  * @param [states = 8] - The initial maximum number of state that this query can have.
  * @param [relationships = 16] - The initial maximum number of relationships that his query can handle.
  */
  public constructor (states : number = 8, relationships : number = 16) {
    this.states = new UnidocQueryStateCollection(this, states)
    this.relationships = new UnidocQueryRelationshipCollection(this, relationships)

    this.input = this.states.state()
  }

  /**
  * @see Object.toString
  */
  public toString () : string {
    let result : string = 'UnidocQuery { states: ['

    for (let index = 0; index < this.states.size; ++index) {
      if (index > 0) {
        result += ', '
      }

      result += this.states.get(index).toString
    }

    result += '], relationships: ['

    for (let index = 0; index < this.relationships.size; ++index) {
      if (index > 0) {
        result += ', '
      }

      result += this.relationships.get(index).toString()
    }

    result += '] }'

    return result
  }

  /**
  * @see Object.equals
  */
  public equals (other : any) : boolean {
    return other === this
  }
}
