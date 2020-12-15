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
  * The next validation node in the sequence.
  */
  private _next: UnidocValidationNode | null

  /**
  * The previous validation node in the sequence.
  */
  private _previous: UnidocValidationNode | null

  /**
  * A fork of this node, if any.
  */
  private _fork: UnidocValidationNode | null

  public get next(): UnidocValidationNode | null {
    return this._next
  }

  public get previous(): UnidocValidationNode | null {
    return this._previous
  }

  public get fork(): UnidocValidationNode | null {
    return this._fork
  }

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

  public rebranch(branch: UnidocValidationBranchIdentifier): void {
    if (this._previous) {
      for (const node of this._previous.nodes()) {
        if (node.event.branch.equals(this.event.branch)) {
          node.event.branch.equals(branch)
        } else {
          break
        }
      }
    }

    this.event.branch.equals(branch)
  }

  public rotate(): void {
    const tmp: UnidocValidationNode | null = this._next
    this._next = this._fork
    this._fork = tmp
  }

  public insert(node: UnidocValidationNode): void {
    const oldNext: UnidocValidationNode | null = this._next

    this.next = node
    node.next = oldNext
  }

  public * branch(): IterableIterator<UnidocValidationEvent> {
    let node: UnidocValidationNode | null = this

    while (node != null) {
      yield node.event
      node = node.next || node.fork
    }
  }

  public * events(): IterableIterator<UnidocValidationEvent> {
    let node: UnidocValidationNode | null = this

    while (node != null) {
      yield node.event

      node = node.previous
    }
  }

  public * nodes(): IterableIterator<UnidocValidationNode> {
    let node: UnidocValidationNode | null = this

    while (node != null) {
      const nextNode: UnidocValidationNode | null = node.previous

      yield node

      node = nextNode
    }
  }

  public dump(): void {
    let result: string = '['

    result += '\r\n  '
    result += this.event.toString()

    if (this._previous) {
      for (const node of this._previous.nodes()) {
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

  public delete(): void {
    if (this._previous != null) {
      if (this._previous.fork === this) {
        this._previous.fork = this._next || this._fork
      } else {
        this._previous.next = this._next || this._fork
      }
    } else {
      if (this._next != null) {
        this._next.previous = null
      }

      if (this._fork != null) {
        this._fork.previous = null
      }
    }
  }

  public clear(): void {
    this.event.clear()
    this.previous = null
    this.next = null
    this.fork = null
  }

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
