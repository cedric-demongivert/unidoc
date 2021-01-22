import { PackSet } from '@cedric-demongivert/gl-tool-collection'
import { Sequence } from '@cedric-demongivert/gl-tool-collection'

import { UnidocKissValidator } from '../kiss/UnidocKissValidator'

import { UnidocNFAValidationGraph } from './UnidocNFAValidationGraph'
import { UnidocNFAValidationRelationship } from './UnidocNFAValidationRelationship'

export class UnidocNFAValidationState {
  /**
  *
  */
  public readonly graph: UnidocNFAValidationGraph

  /**
  *
  */
  private readonly _outputs: PackSet<UnidocNFAValidationRelationship>

  /**
  *
  */
  public readonly outputs: Sequence<UnidocNFAValidationRelationship>

  /**
  *
  */
  public readonly identifier: number

  /**
  *
  */
  public constructor(graph: UnidocNFAValidationGraph) {
    this.graph = graph
    this._outputs = PackSet.any(4)
    this.outputs = this._outputs.view()
    this.identifier = graph.addState(this)
  }

  /**
  *
  */
  public addOutputRelationship(relationship: UnidocNFAValidationRelationship): void {
    if (relationship.from !== this) {
      throw new Error(
        'Unable to add the given relationship as an outgoing relationship of ' +
        'this state as the given relationship originate from a different ' +
        'state. #addOutputRelationship is a method that must be called at the' +
        'right time, please do not use it if you do not know exactly what ' +
        'you are doing.'
      )
    }

    this._outputs.add(relationship)
  }

  /**
  *
  */
  public output(to: UnidocNFAValidationState, validator: UnidocKissValidator.Factory): void {
    new UnidocNFAValidationRelationship(this, to, validator)
  }

  /**
  *
  */
  public input(from: UnidocNFAValidationState, validator: UnidocKissValidator.Factory): void {
    new UnidocNFAValidationRelationship(from, this, validator)
  }

  /**
  *
  */
  public epsilon(to: UnidocNFAValidationState): void {
    new UnidocNFAValidationRelationship(this, to, UnidocKissValidator.validateEpsilon)
  }
}

export namespace UnidocValidationNFA {
  /**
  *
  */
  export type State = number

  /**
  *
  */
  export type Relationship = any
}
