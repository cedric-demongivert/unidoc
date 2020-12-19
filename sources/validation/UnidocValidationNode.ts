import { Pack } from '@cedric-demongivert/gl-tool-collection'

import { UnidocValidationBranchIdentifier } from './UnidocValidationBranchIdentifier'
import { UnidocValidationEvent } from './UnidocValidationEvent'
import { UnidocValidationEventType } from './UnidocValidationEventType'
import { UnidocValidationMessageType } from './UnidocValidationMessageType'

export class UnidocValidationNode {
  /**
  * The validation event stored into this node.
  */
  public readonly event: UnidocValidationEvent

  /**
  * The next validation node of this validation branch, if any.
  */
  private _next: UnidocValidationNode | null

  /**
  * The previous validation node of this validation branch, if any.
  */
  private _previous: UnidocValidationNode | null

  /**
  * The first node of the fork initiated from this node, if any.
  */
  private _fork: UnidocValidationNode | null

  /**
  * @return The next validation node of this validation branch, if any.
  */
  public get next(): UnidocValidationNode | null {
    return this._next
  }

  /**
  * Update the next validation node of this validation branch.
  *
  * @param newNext - The new validation node that must follow this one in this validation branch.
  */
  public set next(newNext: UnidocValidationNode | null) {
    if (this._next !== newNext) {
      if (this._next != null) {
        const oldNext: UnidocValidationNode = this._next
        this._next = null
        oldNext.previous = null
      }

      this._next = newNext

      if (newNext != null) {
        newNext.previous = this
      }
    }
  }

  /**
  * @return The previous validation node of this validation branch, if any.
  */
  public get previous(): UnidocValidationNode | null {
    return this._previous
  }

  public set previous(newPrevious: UnidocValidationNode | null) {
    if (this._previous !== newPrevious) {
      if (this._previous != null) {
        const oldPrevious: UnidocValidationNode = this._previous
        this._previous = null

        if (oldPrevious.fork === this) {
          oldPrevious.fork = null
        } else if (oldPrevious.next === this) {
          oldPrevious.next = null
        }
      }

      this._previous = newPrevious

      if (newPrevious != null) {
        if (newPrevious.fork !== this && newPrevious.next !== this) {
          newPrevious.next = this
        }
      }
    }
  }

  /**
  * @return The first node of the fork initiated from this node, if any.
  */
  public get fork(): UnidocValidationNode | null {
    return this._fork
  }

  public set fork(newFork: UnidocValidationNode | null) {
    if (this._fork !== newFork) {
      if (this._fork != null) {
        const oldFork: UnidocValidationNode = this._fork
        this._fork = null
        oldFork.previous = null
      }

      this._fork = newFork

      if (newFork != null) {
        newFork.previous = this
      }
    }
  }

  /**
  * @return The node at the end of this validation branch.
  */
  public get leaf(): UnidocValidationNode {
    let result: UnidocValidationNode = this

    while (result.next) {
      result = result.next
    }

    return result
  }

  /**
  * @return The root of this validation tree.
  */
  public get root(): UnidocValidationNode {
    let result: UnidocValidationNode = this

    while (result.previous) {
      result = result.previous
    }

    return result
  }

  /**
  * @return Return the type of this validation node.
  */
  public get type(): UnidocValidationEventType {
    return this.event.type
  }

  /**
  * @return Return the branch of this validation node.
  */
  public get branch(): UnidocValidationBranchIdentifier {
    return this.event.branch
  }

  /**
  * Instantiate a new empty validation node.
  */
  public constructor() {
    this.event = new UnidocValidationEvent()
    this._previous = null
    this._next = null
    this._fork = null
  }

  public isFork(): boolean {
    return this.event.type === UnidocValidationEventType.FORK
  }

  public isMainBranch(branch: UnidocValidationBranchIdentifier): boolean {
    return this.event.branch.equals(branch)
  }

  /**
  * Remove this branch from the tree.
  *
  * @return An iterator that iterate over the nodes that will be deleted.
  */
  public * chop(): IterableIterator<UnidocValidationNode> {
    const branch: number = this.event.branch.global

    let node: UnidocValidationNode | null = this.leaf

    while (node != null && node.event.type !== UnidocValidationEventType.FORK) {
      yield node

      const next: UnidocValidationNode | null = node._previous
      node.delete()
      node = next
    }

    if (node != null) {
      if (node.event.branch.global === branch) {
        const previous: UnidocValidationNode | null = node.previous

        yield node.fork!
        node.fork!.delete()

        yield node
        node.delete()

        if (previous) {
          previous.rebranch(node.event.target) // WARNING: if node cleared before chop, there may be a problem here
        }
      } else {
        yield node
        node.delete()
      }
    }
  }

  /**
  * Change the branch identifier of the branch that contains this node.
  *
  * @param branch - The new branch identifier to set.
  */
  public rebranch(branch: UnidocValidationBranchIdentifier): void {
    const oldBranch: number = this.event.branch.global

    let current: UnidocValidationNode | null = this.leaf

    while (current && current.event.branch.global === oldBranch) {
      if (current.event.type === UnidocValidationEventType.FORKED) {
        current.previous!.event.target.copy(branch)
      } else if (current.event.type === UnidocValidationEventType.FORK) {
        if (current.fork!.event.type !== UnidocValidationEventType.FORKED) {
          console.log(current.event.toString())
          throw new Error('BLUUURG: ' + current.fork!.event.toString())
        }
        current.fork!.event.target.copy(branch)
      }

      current.event.branch.copy(branch)

      current = current.previous
    }
  }

  /**
  * Insert the given node between this node and it's next node.
  *
  * @param node - The node to insert.
  */
  public insert(node: UnidocValidationNode): void {
    const oldNext: UnidocValidationNode | null = this._next

    this.next = node
    node.next = oldNext
  }

  public * events(): IterableIterator<UnidocValidationEvent> {
    let node: UnidocValidationNode | null = this

    while (node != null) {
      yield node.event

      node = node.previous
    }
  }

  public * backward(): IterableIterator<UnidocValidationNode> {
    let node: UnidocValidationNode | null = this

    while (node != null) {
      yield node

      node = node.previous
    }
  }

  public * forward(): IterableIterator<UnidocValidationNode> {
    let node: UnidocValidationNode | null = this

    while (node != null) {
      yield node
      node = node.next
    }
  }

  public dump(): void {
    let result: string = '['

    result += '\r\n  '
    result += this.event.toString()

    if (this._previous) {
      for (const node of this._previous.backward()) {
        result += ',\r\n  '
        result += node.event.toString()
      }
    }

    result += '\r\n]'

    console.log(result)
  }

  public countMessages(output: Pack<number>): void {
    let node: UnidocValidationNode | null = this

    while (node != null) {
      if (node.event.type === UnidocValidationEventType.MESSAGE) {
        output.set(
          node.event.message.type,
          output.get(node.event.message.type) + 1
        )
      }

      node = node.previous
    }
  }

  /**
  * Remove this node from it's tree and keep the overall tree structure.
  */
  public delete(): void {
    if (this._previous) {
      if (this._previous.fork === this) {
        this._previous.fork = this._next || this._fork
      } else {
        this._previous.next = this._next || this._fork
      }
    } else {
      if (this._next) {
        this._next.previous = null
      }

      if (this._fork) {
        this._fork.previous = null
      }
    }
  }

  /**
  * Reset the state of this objet to the one just after it's instantiation.
  */
  public clear(): void {
    this.event.clear()
    this.delete()
  }

  /**
  * @see Object.toString
  */
  public toString(): string {
    let result: string = 'node of event '
    result += this.event.toString()
    result += ' between '
    result += this._previous == null ? 'null' : this._previous.event.index
    result += ' and '
    result += this._next == null ? 'null' : this._next.event.index
    result += ' fork '
    result += this._fork == null ? 'null' : this._fork.event.index

    return result
  }
}
