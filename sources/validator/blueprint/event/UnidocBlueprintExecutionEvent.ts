import { Allocator } from '@cedric-demongivert/gl-tool-collection'

import { UnidocBlueprint } from '../../../blueprint/UnidocBlueprint'
import { UnidocBlueprintType } from '../../../blueprint/UnidocBlueprintType'
import { UnidocValidationBranchIdentifier } from '../../../validation/UnidocValidationBranchIdentifier'

import { UnidocState } from '../UnidocState'
import { UnidocValidationGraph } from '../UnidocValidationGraph'

import { UnidocBlueprintExecutionEventType } from './UnidocBlueprintExecutionEventType'

const DEFAULT_GRAPH: UnidocValidationGraph = new UnidocValidationGraph()

export class UnidocBlueprintExecutionEvent {
  /**
  *
  */
  public type: UnidocBlueprintExecutionEventType

  /**
  *
  */
  public readonly state: UnidocState

  /**
  *
  */
  public graph: UnidocValidationGraph

  /**
  *
  */
  public blueprint: UnidocBlueprint | null

  /**
  *
  */
  public readonly branch: UnidocValidationBranchIdentifier

  public constructor() {
    this.type = UnidocBlueprintExecutionEventType.DEFAULT
    this.state = new UnidocState()
    this.graph = DEFAULT_GRAPH
    this.blueprint = null
    this.branch = new UnidocValidationBranchIdentifier()
  }

  public ofBranch(branch: UnidocValidationBranchIdentifier): UnidocBlueprintExecutionEvent {
    this.branch.copy(branch)

    return this
  }

  public asAcceptEverything(): UnidocBlueprintExecutionEvent {
    this.type = UnidocBlueprintExecutionEventType.ACCEPT_EVERYTHING
    this.state.clear()
    this.graph = DEFAULT_GRAPH
    this.blueprint = null

    return this
  }

  public asEnter(graph: UnidocValidationGraph, state: UnidocState): UnidocBlueprintExecutionEvent {
    this.type = UnidocBlueprintExecutionEventType.ENTER
    this.state.copy(state)
    this.graph = graph
    this.blueprint = null

    return this
  }

  public asStart(graph: UnidocValidationGraph): UnidocBlueprintExecutionEvent {
    this.type = UnidocBlueprintExecutionEventType.START
    this.state.clear()
    this.graph = graph
    this.blueprint = null

    return this
  }

  public asDive(graph: UnidocValidationGraph, state: UnidocState, blueprint: UnidocBlueprint): UnidocBlueprintExecutionEvent {
    this.type = UnidocBlueprintExecutionEventType.DIVE
    this.state.copy(state)
    this.graph = graph
    this.blueprint = blueprint

    return this
  }

  public asSuccess(graph: UnidocValidationGraph): UnidocBlueprintExecutionEvent {
    this.type = UnidocBlueprintExecutionEventType.SUCCESS
    this.state.clear()
    this.graph = graph
    this.blueprint = null

    return this
  }

  public asSkip(graph: UnidocValidationGraph): UnidocBlueprintExecutionEvent {
    this.type = UnidocBlueprintExecutionEventType.SKIP
    this.state.clear()
    this.graph = graph
    this.blueprint = null

    return this
  }

  public asFailure(graph: UnidocValidationGraph): UnidocBlueprintExecutionEvent {
    this.type = UnidocBlueprintExecutionEventType.FAILURE
    this.state.clear()
    this.graph = graph
    this.blueprint = null

    return this
  }

  public asEvent(graph: UnidocValidationGraph, state: UnidocState): UnidocBlueprintExecutionEvent {
    this.type = UnidocBlueprintExecutionEventType.EVENT
    this.state.copy(state)
    this.graph = graph
    this.blueprint = null

    return this
  }

  /**
  *
  */
  public copy(toCopy: UnidocBlueprintExecutionEvent): void {
    this.type = toCopy.type
    this.state.copy(toCopy.state)
    this.graph = toCopy.graph
    this.blueprint = toCopy.blueprint
    this.branch.copy(toCopy.branch)
  }

  /**
  *
  */
  public clone(): UnidocBlueprintExecutionEvent {
    const result: UnidocBlueprintExecutionEvent = new UnidocBlueprintExecutionEvent()
    result.copy(this)
    return result
  }

  /**
  *
  */
  public clear(): void {
    this.type = UnidocBlueprintExecutionEventType.DEFAULT
    this.state.clear()
    this.graph = DEFAULT_GRAPH
    this.blueprint = null
    this.branch.clear()
  }

  public toString(): string {
    let result: string = ''

    result += this.constructor.name
    result += ' '
    result += this.branch.toString()
    result += ' #'
    result += this.type

    result += ' ('
    result += UnidocBlueprintExecutionEventType.toString(this.type)
    result += ') '

    if (this.type !== UnidocBlueprintExecutionEventType.ACCEPT_EVERYTHING) {
      result += ' blueprint #'
      result += this.graph.blueprint.type
      result += ' ('
      result += UnidocBlueprintType.toString(this.graph.blueprint.type)
      result += ')'

      if (this.graph.blueprint.type === UnidocBlueprintType.EVENT) {
        result += ' '
        result += (this.graph.blueprint as any).predicate.toString()
      }

      switch (this.type) {
        case UnidocBlueprintExecutionEventType.DIVE:
        case UnidocBlueprintExecutionEventType.ENTER:
        case UnidocBlueprintExecutionEventType.EVENT:
          result += ' state '
          result += this.state.toHexadecimalString()
        default:
          break
      }
    }

    return result
  }
}

export namespace UnidocBlueprintExecutionEvent {
  /**
  * Return a deep copy of the given instance.
  *
  * @param toCopy - An instance to copy.
  *
  * @return A deep copy of the given instance.
  */
  export function copy(toCopy: UnidocBlueprintExecutionEvent): UnidocBlueprintExecutionEvent
  export function copy(toCopy: null): null
  export function copy(toCopy: undefined): undefined
  export function copy(toCopy: UnidocBlueprintExecutionEvent | null | undefined): UnidocBlueprintExecutionEvent | null | undefined {
    return toCopy == null ? toCopy : toCopy.clone()
  }

  export function create(): UnidocBlueprintExecutionEvent {
    return new UnidocBlueprintExecutionEvent()
  }

  export const ALLOCATOR: Allocator<UnidocBlueprintExecutionEvent> = {
    allocate(): UnidocBlueprintExecutionEvent {
      return new UnidocBlueprintExecutionEvent()
    },

    clear(instance: UnidocBlueprintExecutionEvent): void {
      instance.clear()
    },

    copy(source: UnidocBlueprintExecutionEvent, destination: UnidocBlueprintExecutionEvent): void {
      destination.copy(source)
    }
  }
}
