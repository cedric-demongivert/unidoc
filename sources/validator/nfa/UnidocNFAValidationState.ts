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
  private _match: number | undefined

  /**
  *
  */
  public set match(match: number | undefined) {
    if (this._match !== match) {
      this._match = match

      if (this._match === undefined) {
        this.graph.deleteMatch(this)
      } else {
        this.graph.addMatch(this, match!)
      }
    }
  }

  /**
  *
  */
  public get match(): number | undefined {
    return this._match
  }

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
  public isMatch(): boolean {
    return this._match !== undefined
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

  /**
  *
  */
  public toString(): string {
    let result: string = this.constructor.name
    result += ' #'
    result += this.identifier

    if (this._match != null) {
      result += ' (MATCH:' + this._match + ')'
    }

    result += ' with outgoing relationships ('
    result += this._outputs.size
    result += ') into ['

    for (let index = 0; index < this._outputs.size; ++index) {
      if (index > 0) { result += ', ' }
      result += this._outputs.get(index).to.identifier
    }

    result += ']'

    return result
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
