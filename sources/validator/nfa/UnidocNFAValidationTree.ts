import { PackSet } from '@cedric-demongivert/gl-tool-collection'
import { Sequence } from '@cedric-demongivert/gl-tool-collection'
import { Allocator } from '@cedric-demongivert/gl-tool-collection'

import { UnidocValidationEvent } from '../../validation/UnidocValidationEvent'
import { UnidocValidationMessageType } from '../../validation/UnidocValidationMessageType'

import { UnidocNFAValidationTreeType } from './UnidocNFAValidationTreeType'
import { UnidocNFAValidationState } from './UnidocNFAValidationState'

export class UnidocNFAValidationTree {
  /**
  *
  */
  public type: UnidocNFAValidationTreeType

  /**
  *
  */
  private _parent: UnidocNFAValidationTree | null

  /**
  *
  */
  private readonly _children: PackSet<UnidocNFAValidationTree>

  /**
  *
  */
  public readonly children: Sequence<UnidocNFAValidationTree>

  /**
  *
  */
  public readonly event: UnidocValidationEvent

  /**
  *
  */
  public state: UnidocNFAValidationState | null

  /**
  *
  */
  public get parent(): UnidocNFAValidationTree | null {
    return this._parent
  }

  /**
  *
  */
  public set parent(parent: UnidocNFAValidationTree | null) {
    if (this._parent !== parent) {
      if (this._parent) {
        const oldParent: UnidocNFAValidationTree = this._parent
        this._parent = null
        oldParent.deleteChild(this)
      }

      this._parent = parent

      if (parent) {
        parent.addChild(this)
      }
    }
  }

  /**
  *
  */
  public constructor() {
    this._parent = null
    this._children = PackSet.any(4)
    this.children = this._children.view()
    this.event = new UnidocValidationEvent()
    this.type = UnidocNFAValidationTreeType.DEFAULT
    this.state = null
  }

  /**
  *
  */
  public isLeaf(): boolean {
    return this._children.size === 0
  }

  /**
  *
  */
  public isNode(): boolean {
    return this._children.size > 0
  }

  /**
  *
  */
  public isEvent(): boolean {
    return this.type === UnidocNFAValidationTreeType.EVENT
  }

  /**
  *
  */
  public isState(): boolean {
    return this.type === UnidocNFAValidationTreeType.STATE
  }

  /**
  *
  */
  public isStart(): boolean {
    return this.type === UnidocNFAValidationTreeType.START
  }

  /**
  *
  */
  public isHead(): boolean {
    return this.type === UnidocNFAValidationTreeType.HEAD
  }

  /**
  *
  */
  public asEvent(event: UnidocValidationEvent): UnidocNFAValidationTree {
    this.type = UnidocNFAValidationTreeType.EVENT
    this.event.copy(event)
    this.state = null
    return this
  }

  /**
  *
  */
  public asState(state: UnidocNFAValidationState): UnidocNFAValidationTree {
    this.type = UnidocNFAValidationTreeType.STATE
    this.event.clear()
    this.state = state
    return this
  }

  /**
  *
  */
  public asStart(): UnidocNFAValidationTree {
    this.type = UnidocNFAValidationTreeType.START
    this.event.clear()
    this.state = null
    return this
  }

  /**
  *
  */
  public asHead(): UnidocNFAValidationTree {
    this.type = UnidocNFAValidationTreeType.HEAD
    this.event.clear()
    this.state = null
    return this
  }

  /**
  *
  */
  public isUpward(node: UnidocNFAValidationTree): boolean {
    let parent: UnidocNFAValidationTree | null = this._parent

    while (parent) {
      if (parent === node) {
        return true
      } else {
        parent = parent.parent
      }
    }

    return false
  }

  /**
  *
  */
  public root(): UnidocNFAValidationTree {
    let result: UnidocNFAValidationTree = this

    while (result.parent != null) {
      result = result.parent
    }

    return result
  }

  /**
  *
  */
  public * up(): Generator<UnidocNFAValidationTree> {
    let result: UnidocNFAValidationTree = this

    while (result.parent != null) {
      result = result.parent
      yield result
    }

    return result
  }

  /**
  *
  */
  public countMessages(output: number[] = []): number[] {
    for (let index = 0, size = UnidocValidationMessageType.ALL.length; index < size; ++index) {
      output[index] = 0
    }

    let current: UnidocNFAValidationTree | null = this

    while (current) {
      if (current.type === UnidocNFAValidationTreeType.EVENT && current.event.isMessage()) {
        output[current.event.message.type] += 1
      }

      current = current.parent
    }

    return output
  }

  /**
  *
  */
  public batch(): number {
    let current: UnidocNFAValidationTree | null = this

    while (current) {
      if (current.type === UnidocNFAValidationTreeType.EVENT) {
        return current.event.batch
      }

      current = current.parent
    }

    return 0
  }

  /**
  *
  */
  public fork(): UnidocNFAValidationTree {
    const next: UnidocNFAValidationTree = UnidocNFAValidationTree.ALLOCATOR.allocate()

    next.parent = this

    return next
  }

  /**
  *
  */
  public addChild(child: UnidocNFAValidationTree): void {
    this._children.add(child)
    child.parent = this
  }

  /**
  *
  */
  public deleteChild(child: UnidocNFAValidationTree): void {
    this._children.delete(child)
    child.parent = null
  }

  /**
  *
  */
  public delete(): void {
    const oldParent: UnidocNFAValidationTree | null = this._parent

    this.parent = null

    while (this._children.size > 0) {
      this._children.first.parent = oldParent
    }
  }

  /**
  *
  */
  public clear(): void {
    this.parent = null

    while (this._children.size > 0) {
      this._children.first.parent = null
    }
  }

  /**
  *
  */
  public toString(): string {
    let result: string = this.constructor.name

    switch (this.type) {
      case UnidocNFAValidationTreeType.START:
        return result + ' START with ' + this._children.size + ' children'
      case UnidocNFAValidationTreeType.STATE:
        return result + ' STATE #' + this.state!.identifier + ' with ' + this._children.size + ' children'
      case UnidocNFAValidationTreeType.EVENT:
        return result + ' EVENT ' + this.event.toString() + ' with ' + this._children.size + ' children'
      case UnidocNFAValidationTreeType.HEAD:
        return result + ' HEAD with ' + this._children.size + ' children'
      default:
        throw new Error(
          'Unable to stringify tree node of type ' +
          UnidocNFAValidationTreeType.toDebugString(this.type) + ' as no ' +
          'procedure was defined for that.'
        )
    }
  }
}

export namespace UnidocNFAValidationTree {
  /**
  *
  */
  export function create(): UnidocNFAValidationTree {
    return new UnidocNFAValidationTree()
  }

  /**
  *
  */
  export const ALLOCATOR: Allocator<UnidocNFAValidationTree> = Allocator.fromFactory(create)

  /**
  * Trash a tree and keep is root.
  *
  * @param root - Root of the tree to trash.
  */
  export function trash(root: UnidocNFAValidationTree): void {
    const stack: UnidocNFAValidationTree[] = [...root.children]
    let next: UnidocNFAValidationTree | undefined = stack.pop()

    while (next) {
      for (const child of next.children) {
        stack.push(child)
      }

      ALLOCATOR.free(next)

      next = stack.pop()
    }
  }

  /**
  * Cut a branch of a tree and link it's starting node and it's ending node.
  *
  * @param node - A node of the branch to cut.
  */
  export function cut(node: UnidocNFAValidationTree): void {
    let upmost: UnidocNFAValidationTree | null = node.parent
    node.parent = null

    while (upmost && !upmost.isStart() && upmost.children.size === 0) {
      const next: UnidocNFAValidationTree | null = upmost.parent
      UnidocNFAValidationTree.ALLOCATOR.free(upmost)
      upmost = next
    }

    let lowest: UnidocNFAValidationTree | null = node

    while (lowest && lowest.children.size < 2) {
      const next: UnidocNFAValidationTree | null = lowest.children.size === 1 ? lowest.children.first : null
      UnidocNFAValidationTree.ALLOCATOR.free(lowest)
      lowest = next
    }

    if (lowest && upmost) {
      lowest.parent = upmost
    }
  }
}
