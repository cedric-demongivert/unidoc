import { UnidocQuery } from './UnidocQuery'
import { UnidocQueryRelationship } from './UnidocQueryRelationship'
import { UnidocQueryPredicate } from './UnidocQueryPredicate'

/**
* A relationship that is active when the given predicate is truthy.
*/
export class UnidocQueryPredicateRelationship extends UnidocQueryRelationship {
  public predicate : UnidocQueryPredicate

  /**
  * Instantiate a new predicate relationship for the given query.
  *
  * @param query - The parent query.
  */
  public constructor (query : UnidocQuery, identifier? : number) {
    super(query, identifier)

    this.predicate = UnidocQueryPredicate.truthy
  }
}
