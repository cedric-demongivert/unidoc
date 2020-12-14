import { UnidocBlueprint } from '../../blueprint/UnidocBlueprint'

import { UnidocState } from './UnidocState'

import { UnidocValidationNode } from './UnidocValidationNode'
import { UnidocStateMap } from './UnidocStateMap'

export class UnidocValidationGraph {
  /**
  *
  */
  private _parent: UnidocValidationNode | null

  /**
  *
  */
  public blueprint: UnidocBlueprint

  /**
  *
  */
  private readonly _nodes: UnidocStateMap<UnidocValidationNode>

  /**
  *
  */
  public get parent(): UnidocValidationNode | null {
    return this._parent
  }

  /**
  *
  */
  public set parent(parent: UnidocValidationNode | null) {
    if (this._parent !== parent) {
      if (this._parent != null) {
        const oldParent: UnidocValidationNode = this._parent
        this._parent = null
        oldParent.content = null
      }

      this._parent = parent

      if (parent != null) {
        parent.content = this
      }
    }
  }

  /**
  * Instantiate a new validation node.
  */
  public constructor() {
    this._parent = null
    this._nodes = new UnidocStateMap()
    this.blueprint = UnidocBlueprint.end()
  }

  public requireParent(): UnidocValidationNode {
    if (this._parent) {
      return this._parent
    } else {
      throw new Error(
        'Unable to return the parent of this validation graph as it does not ' +
        'have any parent.'
      )
    }
  }

  /**
  *
  */
  public isEmpty(): boolean {
    return this._nodes.size <= 0
  }

  /**
  *
  */
  public has(state: UnidocState): boolean {
    return this._nodes.has(state)
  }

  /**
  *
  */
  public delete(state: UnidocState): void {
    const node: UnidocValidationNode | undefined = this._nodes.get(state)
    this._nodes.delete(state)

    if (node != null) {
      node.parent = null
    }
  }

  /**
  *
  */
  public create(state: UnidocState): UnidocValidationNode {
    const existing: UnidocValidationNode | undefined = this._nodes.get(state)

    if (existing == null) {
      const node: UnidocValidationNode = new UnidocValidationNode()
      node.state.copy(state)
      this._nodes.set(state, node)
      node.parent = this

      return node
    } else {
      return existing
    }
  }

  /**
  *
  */
  public set(state: UnidocState, node: UnidocValidationNode): void {
    const existing: UnidocValidationNode | undefined = this._nodes.get(state)

    if (existing !== node) {
      if (existing != null) {
        this._nodes.delete(existing.state)
        existing.parent = null
      }

      node.state.copy(state)
      this._nodes.set(state, node)
    }
  }

  /**
  *
  */
  public get(state: UnidocState): UnidocValidationNode | undefined {
    return this._nodes.get(state)
  }

  /**
  *
  */
  public clear(): void {
    this.blueprint = UnidocBlueprint.end()
    this.parent = null
    this._nodes.clear()
  }
}
