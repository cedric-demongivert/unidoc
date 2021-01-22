import { Pack } from '@cedric-demongivert/gl-tool-collection'
import { Sequence } from '@cedric-demongivert/gl-tool-collection'

import { UnidocNFAValidationState } from './UnidocNFAValidationState'
import { UnidocNFAValidationRelationship } from './UnidocNFAValidationRelationship'

export class UnidocNFAValidationGraph {
  /**
  *
  */
  private _states: Pack<UnidocNFAValidationState>

  /**
  *
  */
  public readonly states: Sequence<UnidocNFAValidationState>

  /**
  *
  */
  private _relationships: Pack<UnidocNFAValidationRelationship>

  /**
  *
  */
  public readonly relationships: Sequence<UnidocNFAValidationRelationship>

  /**
  *
  */
  public readonly start: UnidocNFAValidationState

  /**
  *
  */
  public readonly match: UnidocNFAValidationState

  /**
  *
  */
  public constructor() {
    this._states = Pack.any(2)
    this.states = this._states.view()
    this._relationships = Pack.any(0)
    this.relationships = this._relationships.view()

    this.start = new UnidocNFAValidationState(this)
    this.match = new UnidocNFAValidationState(this)
  }

  /**
  *
  */
  public addState(state: UnidocNFAValidationState): number {
    if (state.graph !== this) {
      throw new Error(
        'Unable to add the given state to this graph as it was instantiated ' +
        'for another graph. #addState is a method that must be called at the ' +
        'right time, please do not use it if you do not know exactly what ' +
        'you are doing.'
      )
    }

    if (state.identifier === undefined) {
      const identifier: number = this._states.size
      this._states.push(state)
      return identifier
    } else {
      return state.identifier
    }
  }

  /**
  *
  */
  public addRelationship(relationship: UnidocNFAValidationRelationship): number {
    if (relationship.from.graph !== this) {
      throw new Error(
        'Unable to add the given relationship to this graph as it was ' +
        'instantiated for another graph. #addRelationship is a method that ' +
        'must be called at the right time, please do not use it if you do ' +
        'not know exactly what you are doing.'
      )
    }

    if (relationship.identifier === undefined) {
      const identifier: number = this._relationships.size
      this._relationships.push(relationship)
      return identifier
    } else {
      return relationship.identifier
    }
  }

  /**
  *
  */
  public state(): UnidocNFAValidationState {
    return new UnidocNFAValidationState(this)
  }
}

export namespace UnidocNFAValidationGraph {

}
