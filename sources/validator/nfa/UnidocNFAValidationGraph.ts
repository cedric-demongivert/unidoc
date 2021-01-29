import { Pack } from '@cedric-demongivert/gl-tool-collection'
import { Sequence } from '@cedric-demongivert/gl-tool-collection'
import { NativeSet } from '@cedric-demongivert/gl-tool-collection'
import { Collection } from '@cedric-demongivert/gl-tool-collection'

import { UnidocNFAValidationState } from './UnidocNFAValidationState'
import { UnidocNFAValidationRelationship } from './UnidocNFAValidationRelationship'
import { UnidocNFAValidationGraphBuilder } from './UnidocNFAValidationGraphBuilder'

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
  public readonly _matchs: NativeSet<UnidocNFAValidationState>

  /**
  *
  */
  public readonly matchs: Collection<UnidocNFAValidationState>

  /**
  *
  */
  public constructor() {
    this._states = Pack.any(2)
    this.states = this._states.view()
    this._relationships = Pack.any(0)
    this.relationships = this._relationships.view()
    this._matchs = new NativeSet(new Set())

    this.start = new UnidocNFAValidationState(this)
    this.matchs = this._matchs.view()
  }

  /**
  *
  */
  public addMatch(state: UnidocNFAValidationState, match: number): void {
    this._matchs.add(state)
    state.match = match
  }

  /**
  *
  */
  public deleteMatch(state: UnidocNFAValidationState): void {
    this._matchs.delete(state)
    state.match = undefined
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

  /**
  *
  */
  public builder(): UnidocNFAValidationGraphBuilder {
    return new UnidocNFAValidationGraphBuilder(this)
  }
}

export namespace UnidocNFAValidationGraph {
  /**
  *
  */
  export const MATCH: UnidocNFAValidationGraph = (
    new UnidocNFAValidationGraph()
      .builder()
      .match()
  )

}
