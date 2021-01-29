import { UnidocKissValidator } from '../kiss/UnidocKissValidator'

import { UnidocNFAValidationGraph } from './UnidocNFAValidationGraph'
import { UnidocNFAValidationState } from './UnidocNFAValidationState'

export class UnidocNFAValidationGraphBuilder {
  /**
  *
  */
  public readonly graph: UnidocNFAValidationGraph

  /**
  *
  */
  private readonly _origin: Set<UnidocNFAValidationState>

  /**
  *
  */
  private _input: UnidocNFAValidationState | undefined

  /**
  *
  */
  public constructor(graph: UnidocNFAValidationGraph)
  public constructor(graph: UnidocNFAValidationGraph, ...origins: Array<UnidocNFAValidationState | Iterable<UnidocNFAValidationState>>)
  public constructor(graph: UnidocNFAValidationGraph, ...origins: Array<UnidocNFAValidationState | Iterable<UnidocNFAValidationState>>) {
    this.graph = graph

    const states: Set<UnidocNFAValidationState> = new Set()

    for (const origin of origins) {
      if (origin instanceof UnidocNFAValidationState) {
        states.add(origin)
      } else {
        for (const state of origin) {
          states.add(state)
        }
      }
    }

    if (states.size === 0) {
      states.add(graph.start)
    }

    this._origin = states
    this._input = undefined
  }

  /**
  *
  */
  public * origin(): Generator<UnidocNFAValidationState> {
    return this._origin.values()
  }

  private input(): UnidocNFAValidationState {
    if (this._origin.size > 1) {
      if (this._input) {
        return this._input
      } else {
        const input: UnidocNFAValidationState = this.graph.state()

        for (const state of this._origin) {
          state.epsilon(input)
        }

        this._input = input
        return input
      }
    } else {
      return this._origin.values().next().value
    }
  }

  /**
  *
  */
  public then(validator: UnidocKissValidator.Factory): UnidocNFAValidationGraphBuilder {
    const output: UnidocNFAValidationState = this.graph.state()

    this.input().output(output, validator)

    return new UnidocNFAValidationGraphBuilder(this.graph, output)
  }

  /**
  *
  */
  public match(identifier: number = 0): UnidocNFAValidationGraph {
    const match: UnidocNFAValidationState = this.graph.state()
    match.match = identifier

    for (const node of this._origin) {
      node.epsilon(match)
    }

    return this.graph
  }

  /**
  *
  */
  public many(validator: UnidocKissValidator.Factory): UnidocNFAValidationGraphBuilder {
    const output: UnidocNFAValidationState = this.graph.state()
    const input: UnidocNFAValidationState = this.input()

    input.output(output, validator)
    input.epsilon(output)
    output.epsilon(input)

    return new UnidocNFAValidationGraphBuilder(this.graph, output)
  }

  /**
  *
  */
  public optional(validator: UnidocKissValidator.Factory): UnidocNFAValidationGraphBuilder {
    const output: UnidocNFAValidationState = this.graph.state()
    const input: UnidocNFAValidationState = this.input()

    input.output(output, validator)
    input.epsilon(output)

    return new UnidocNFAValidationGraphBuilder(this.graph, output)
  }

  /**
  *
  */
  public atLeast(validator: UnidocKissValidator.Factory, times: number): UnidocNFAValidationGraphBuilder {
    let current: UnidocNFAValidationState = this.input()

    for (let index = 0; index < times; ++index) {
      const next: UnidocNFAValidationState = this.graph.state()

      current.output(next, validator)
      current = next
    }

    return new UnidocNFAValidationGraphBuilder(this.graph, current)
  }

  /**
  *
  */
  public upTo(validator: UnidocKissValidator.Factory, times: number): UnidocNFAValidationGraphBuilder {
    const output: UnidocNFAValidationState = this.graph.state()
    let current: UnidocNFAValidationState = this.input()

    for (let index = 0; index < times - 1; ++index) {
      const next: UnidocNFAValidationState = this.graph.state()

      current.output(next, validator)
      current.epsilon(output)
      current = next
    }

    current.output(output, validator)
    current.epsilon(output)

    return new UnidocNFAValidationGraphBuilder(this.graph, output)
  }

  /**
  *
  */
  public range(validator: UnidocKissValidator.Factory, minimum: number = 0, maximum: number = Number.POSITIVE_INFINITY): UnidocNFAValidationGraphBuilder {
    let current: UnidocNFAValidationGraphBuilder = this

    if (minimum > 0) {
      current = current.atLeast(validator, minimum)
    }

    if (maximum === Number.POSITIVE_INFINITY) {
      current = current.many(validator)
    } else {
      current = current.upTo(validator, maximum - minimum)
    }

    return current
  }

  /**
  *
  */
  public any(...validators: UnidocKissValidator.Factory[]): UnidocNFAValidationGraphBuilder {
    const output: UnidocNFAValidationState = this.graph.state()
    const input: UnidocNFAValidationState = this.input()

    for (const validator of validators) {
      input.output(output, validator)
    }

    return new UnidocNFAValidationGraphBuilder(this.graph, output)
  }
}

export namespace UnidocNFAValidationGraphBuilder {
  /**
  *
  */
  export function create(graph: UnidocNFAValidationGraph): UnidocNFAValidationGraphBuilder {
    return new UnidocNFAValidationGraphBuilder(graph)
  }
}
