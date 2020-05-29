import { UnidocEvent } from '../../event/UnidocEvent'

import { UnidocQueryRelationship } from '../UnidocQueryRelationship'
import { UnidocQueryPredicateRelationship } from '../UnidocQueryPredicateRelationship'
import { UnidocQueryFreeRelationship } from '../UnidocQueryFreeRelationship'

import { UnidocQueryExecutionResult } from './UnidocQueryExecutionResult'
import { UnidocQueryPredicateExecution } from './UnidocQueryPredicateExecution'

export class UnidocQueryExecution {
  /**
  * Executed relationship.
  */
  public readonly relationship : UnidocQueryRelationship

  /**
  * Begining of the path into the parent event stream.
  */
  public from : number

  /**
  * Ending of the path into the parent event stream.
  */
  public to : number

  public constructor (relationship : UnidocQueryRelationship) {
    this.relationship = relationship
    this.from = 0
    this.to = 0
  }

  public start () : UnidocQueryExecutionResult {
    return UnidocQueryExecutionResult.NEXT
  }

  public next (event : UnidocEvent) : UnidocQueryExecutionResult {
    return UnidocQueryExecutionResult.NEXT
  }

  public end () : UnidocQueryExecutionResult {
    return UnidocQueryExecutionResult.NEXT
  }
}

export namespace UnidocQueryExecution {
  export function create (relationship : UnidocQueryRelationship) : UnidocQueryExecution {
    if (relationship instanceof UnidocQueryPredicateRelationship) {
      return new UnidocQueryPredicateExecution(relationship)
    } else if (relationship instanceof UnidocQueryFreeRelationship) {
      return new UnidocQueryExecution(relationship)
    } else {
      throw new Error(
        'Unable to make an execution of the given relationship : ' +
        relationship + ' because the given relationship is not supported yet.'
      )
    }
  }
}
