import { UnidocQuery } from './UnidocQuery'
import { UnidocQueryRelationship } from './UnidocQueryRelationship'

/**
* A relationship that is always active
*/
export class UnidocQueryFreeRelationship extends UnidocQueryRelationship {
  /**
  * Instantiate a new free relationship for the given query.
  *
  * @param query - The parent query.
  */
  public constructor (query : UnidocQuery, identifier? : number) {
    super(query, identifier)
  }
}
