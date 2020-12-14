import { UnidocValidationBranchIdentifier } from '../../validation/UnidocValidationBranchIdentifier'

import { UnidocState } from './UnidocState'
import { UnidocValidationGraph } from './UnidocValidationGraph'

export class UnidocValidationNode {
  /**
  *
  */
  private _parent: UnidocValidationGraph | null

  /**
  *
  */
  public readonly state: UnidocState

  /**
  *
  */
  public readonly branch: UnidocValidationBranchIdentifier

  /**
  *
  */
  public _content: UnidocValidationGraph | null

  /**
  *
  */
  public get parent(): UnidocValidationGraph | null {
    return this._parent
  }

  /**
  *
  */
  public set parent(parent: UnidocValidationGraph | null) {
    if (this._parent !== parent) {
      if (this._parent != null) {
        const oldParent: UnidocValidationGraph = this._parent
        this._parent = null
        oldParent.delete(this.state)
      }

      this._parent = parent

      if (parent != null) {
        parent.set(this.state, this)
      }
    }
  }

  /**
  *
  */
  public get content(): UnidocValidationGraph | null {
    return this._content
  }

  /**
  *
  */
  public set content(content: UnidocValidationGraph | null) {
    if (this._content !== content) {
      if (this._content != null) {
        const oldContent: UnidocValidationGraph = this._content
        this._content = null
        oldContent.parent = null
      }

      this._content = content

      if (content != null) {
        content.parent = this
      }
    }
  }

  /**
  * Instantiate a new validation node.
  */
  public constructor() {
    this._parent = null
    this._content = null
    this.state = new UnidocState()
    this.branch = new UnidocValidationBranchIdentifier()
  }

  public requireParent(): UnidocValidationGraph {
    if (this._parent) {
      return this._parent
    } else {
      throw new Error(
        'Unable to return the parent of this validation node as it does not ' +
        'have any parent.'
      )
    }
  }

  public requireContent(): UnidocValidationGraph {
    if (this._content) {
      return this._content
    } else {
      throw new Error(
        'Unable to return the content of this validation node as it does not ' +
        'have any content.'
      )
    }
  }

  public delete(): void {
    const oldParent: UnidocValidationGraph | null = this._parent

    if (oldParent) {
      this._parent = null
      oldParent.delete(this.state)
    }
  }

  public clear(): void {
    this.parent = null
    this.content = null
    this.state.clear()
    this.branch.clear()
  }
}
