import { UnidocKissValidator } from '../kiss/UnidocKissValidator'

import { UnidocNFAValidationState } from './UnidocNFAValidationState'

/**
*
*/
export class UnidocNFAValidationRelationship {
  /**
  *
  */
  public readonly from: UnidocNFAValidationState

  /**
  *
  */
  public readonly to: UnidocNFAValidationState

  /**
  *
  */
  public readonly validator: UnidocKissValidator.Factory

  /**
  *
  */
  public readonly identifier: number

  /**
  *
  */
  public constructor(from: UnidocNFAValidationState, to: UnidocNFAValidationState, validator: UnidocKissValidator.Factory) {
    if (from.graph !== to.graph) {
      throw new Error(
        'Unable to instantiate a relationship between the given states ' +
        'because they both belongs to two different graphs.'
      )
    }

    this.from = from
    this.to = to
    this.validator = validator
    this.identifier = this.from.graph.addRelationship(this)
    this.from.addOutputRelationship(this)
  }

  /**
  *
  */
  public toString(): string {
    let result: string = this.constructor.name
    result += ' #'
    result += this.identifier
    result += ' from state #'
    result += this.from.identifier
    result += ' to state #'
    result += this.to.identifier
    return result
  }
}

export namespace UnidocNFAValidationRelationship {

}
