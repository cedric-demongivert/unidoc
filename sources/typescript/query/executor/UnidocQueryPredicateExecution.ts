import { UnidocEvent } from '../../event/UnidocEvent'

import { UnidocQueryPredicate } from '../UnidocQueryPredicate'
import { UnidocQueryPredicateRelationship } from '../UnidocQueryPredicateRelationship'
import { UnidocQueryExecution } from './UnidocQueryExecution'
import { UnidocQueryExecutionResult } from './UnidocQueryExecutionResult'

export class UnidocQueryPredicateExecution extends UnidocQueryExecution {
  public readonly relationship : UnidocQueryPredicateRelationship

  public constructor (relationship : UnidocQueryPredicateRelationship) {
    super(relationship)
  }

  public start () : UnidocQueryExecutionResult {
    if (this.relationship.predicate(UnidocQueryPredicate.START)) {
      return UnidocQueryExecutionResult.NEXT
    } else {
      return UnidocQueryExecutionResult.DROP
    }
  }

  public next (event : UnidocEvent) : UnidocQueryExecutionResult {
    if (this.relationship.predicate(event)) {
      return UnidocQueryExecutionResult.NEXT
    } else {
      return UnidocQueryExecutionResult.DROP
    }
  }

  public end () : UnidocQueryExecutionResult {
    if (this.relationship.predicate(UnidocQueryPredicate.END)) {
      return UnidocQueryExecutionResult.NEXT
    } else {
      return UnidocQueryExecutionResult.DROP
    }
  }
}
