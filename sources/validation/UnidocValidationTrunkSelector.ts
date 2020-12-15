import { Pack } from '@cedric-demongivert/gl-tool-collection'
import { IdentifierSet } from '@cedric-demongivert/gl-tool-collection'

import { SubscribableUnidocConsumer } from '../consumer/SubscribableUnidocConsumer'
import { UnidocProducerEvent } from '../producer/UnidocProducerEvent'
import { StaticUnidocProducer } from '../producer/StaticUnidocProducer'

import { UnidocValidationBranchIdentifier } from './UnidocValidationBranchIdentifier'
import { UnidocValidationEvent } from './UnidocValidationEvent'
import { UnidocValidationNode } from './UnidocValidationNode'
import { UnidocValidationEventType } from './UnidocValidationEventType'
import { UnidocValidationSelector } from './UnidocValidationSelector'
import { UnidocValidationMessageType } from './UnidocValidationMessageType'

const ROOT_BRANCH: UnidocValidationBranchIdentifier = new UnidocValidationBranchIdentifier().set(0, 0)

function getNextBatchAnchor(iterator: Iterator<UnidocValidationNode>): UnidocValidationNode {
  let result: IteratorResult<UnidocValidationNode>
  let previous: UnidocValidationNode | null = null

  while (!(result = iterator.next()).done) {
    switch (result.value.event.type) {
      case UnidocValidationEventType.VALIDATION:
      case UnidocValidationEventType.DOCUMENT_COMPLETION:
        return result.value
      default:
        break
    }

    previous = result.value
  }

  if (previous) {
    return previous
  } else {
    throw new Error('No next batch anchor available.')
  }
}

export class UnidocValidationTrunkSelector
  extends SubscribableUnidocConsumer<UnidocValidationEvent>
  implements UnidocValidationSelector {
  /**
  *
  */
  private readonly _output: StaticUnidocProducer<UnidocValidationEvent>

  /**
  *
  */
  private readonly _event: UnidocValidationEvent

  /**
  *
  */
  private _index: number

  /**
  *
  */
  private _lastBatch: number

  /**
  *
  */
  private readonly _nodes: Pack<UnidocValidationNode>

  /**
  *
  */
  private readonly _branches: Pack<UnidocValidationNode | null>

  /**
  *
  */
  private _root: UnidocValidationNode | null

  /**
  *
  */
  private readonly _leftMessages: Pack<number>

  /**
  *
  */
  private readonly _rightMessages: Pack<number>

  /**
  *
  */
  public constructor(capacity: number = 32) {
    super()
    this._output = new StaticUnidocProducer()
    this._event = new UnidocValidationEvent()
    this._index = 0
    this._lastBatch = 0

    this._nodes = Pack.any(capacity)
    this._branches = Pack.any(capacity / 8)
    this._root = null

    this._leftMessages = Pack.uint32(UnidocValidationMessageType.ALL.length)
    this._rightMessages = Pack.uint32(UnidocValidationMessageType.ALL.length)

    for (let index = 0; index < capacity; ++index) {
      this._nodes.set(index, new UnidocValidationNode())
    }
  }

  /**
  *
  */
  private chop(branch: number): void {
    let node: UnidocValidationNode | null = this._branches.get(branch)
    this._branches.set(branch, null)

    while (node != null && node.event.type != UnidocValidationEventType.FORK) {
      const next: UnidocValidationNode | null = node.previous
      node.delete()
      this._nodes.push(node)
      node = next
    }

    if (node != null) {
      if (node === this._root) {
        this._root = node.next || node.fork
      }

      if (this._branches.get(node.event.branch.local) === node) {
        this._branches.set(node.event.branch.local, node.previous)
      }

      node.delete()
      this._nodes.push(node)
    }
  }

  /**
  *
  */
  private chopDeadBranches(event: UnidocValidationEvent): void {
    switch (event.type) {
      case UnidocValidationEventType.FORK:
      case UnidocValidationEventType.VALIDATION:
      case UnidocValidationEventType.DOCUMENT_COMPLETION:
        for (let index = 0; index < this._branches.size; ++index) {
          const branch: UnidocValidationNode | null = this._branches.get(index)
          if (branch != null && branch.event.type === UnidocValidationEventType.TERMINATION) {
            this.chop(index)
          }
        }
        break
      default:
        break
    }
  }

  /**
  *
  */
  private dump(): void {
    let node: UnidocValidationNode | null = this._root

    while (node != null && node.event.type != UnidocValidationEventType.FORK) {
      const next: UnidocValidationNode | null = node.next

      node.delete()
      this._nodes.push(node)

      if (next == null) {
        this._branches.set(node.event.branch.local, null)
      }

      this.duplicate(node.event)
      node = next
    }

    this._root = node
  }

  /**
  *
  */
  private allocateNode(): UnidocValidationNode {
    if (this._nodes.size > 0) {
      return this._nodes.pop()
    } else {
      return new UnidocValidationNode()
    }
  }

  /**
  * @see UnidocConsumer.handleInitialization
  */
  public handleInitialization(): void {
    this._output.initialize()
    this._index = 0

    this.produce(this._event.fromBranch(ROOT_BRANCH).asCreation())
  }

  /**
  * @see UnidocConsumer.handleProduction
  */
  public handleProduction(event: UnidocValidationEvent): void {
    this.chopDeadBranches(event)

    switch (event.type) {
      case UnidocValidationEventType.FORKED:
        this.handleProductionOfForked(event)
        break
      case UnidocValidationEventType.FORK:
        this.handleProductionOfFork(event)
        break
      case UnidocValidationEventType.MERGE:
        this.handleProductionOfMerge(event)
        break
      default:
        this.handleProductionOfEvent(event)
        break
    }

    this.dump()
  }

  /**
  *
  */
  private handleProductionOfMerge(event: UnidocValidationEvent): void {
    const to: UnidocValidationNode | null = this._branches.get(event.target.local)
    const from: UnidocValidationNode | null = this._branches.get(event.branch.local)

    if (to == null || from == null) {
      throw new Error('Unable to merge inexisting branches.')
    }

    if (this.isLeftBetterThanRight(to, from)) {
      this.chop(event.branch.local)
    } else {
      this.chop(event.target.local)
      from.rebranch(event.target)
      this._branches.set(event.target.local, this._branches.get(event.branch.local))
      this._branches.set(event.branch.local, null)
    }
  }

  /**
  *
  */
  private handleProductionOfFork(event: UnidocValidationEvent): void {
    const branch: UnidocValidationNode | null = this._branches.get(event.branch.local)
    const node: UnidocValidationNode = this.allocateNode()

    node.event.copy(event)

    if (branch != null) {
      branch.next = node
    }

    if (this._root == null) {
      this._root = node
    }

    this._branches.set(event.branch.local, node)
  }

  /**
  *
  */
  private handleProductionOfForked(event: UnidocValidationEvent): void {
    const branch: UnidocValidationNode | null = this._branches.get(event.branch.local)
    const origin: UnidocValidationNode | null = this._branches.get(event.target.local)

    if (origin == null) {
      throw new Error('Illegal state : forked from nowhere.')
    }

    const node: UnidocValidationNode = this.allocateNode()

    origin.fork = node
    node.event.copy(event)

    if (branch != null && node !== branch) {
      branch.next = node
    }

    if (this._root == null) {
      this._root = node
    }

    this._branches.set(event.branch.local, node)
  }

  /**
  *
  */
  private handleProductionOfEvent(event: UnidocValidationEvent): void {
    const branch: UnidocValidationNode | null = this._branches.get(event.branch.local)
    const node: UnidocValidationNode = this.allocateNode()

    node.event.copy(event)

    if (branch != null && node !== branch) {
      branch.next = node
    }

    if (this._root == null) {
      this._root = node
    }

    this._branches.set(event.branch.local, node)
  }

  /**
  *
  */
  private duplicate(event: UnidocValidationEvent): void {
    switch (event.type) {
      case UnidocValidationEventType.FORK:
      case UnidocValidationEventType.FORKED:
      case UnidocValidationEventType.CREATION:
      case UnidocValidationEventType.TERMINATION:
      case UnidocValidationEventType.MERGE:
        break
      default:
        event.branch.copy(ROOT_BRANCH)
        this.produce(event)
        break
    }
  }

  /**
  *
  */
  private produce(event: UnidocValidationEvent): void {
    event.index = this._index
    this._index += 1
    this._lastBatch = event.batch
    this._output.produce(event)
  }

  /**
  * @see UnidocConsumer.handleCompletion
  */
  public handleCompletion(): void {
    if (this._root != null) {
      this.keepBestBranch()
      this.dump()
    }

    this._event.fromBranch(ROOT_BRANCH).asTermination()
    this._event.batch = this._lastBatch
    this.produce(this._event)

    this._output.complete()
  }

  /**
  *
  */
  private keepBestBranch(): void {
    let best: UnidocValidationNode | null = this._branches.get(0)
    let bestIndex: number = 0

    for (let index = 1; index < this._branches.size; ++index) {
      const other: UnidocValidationNode | null = this._branches.get(index)

      if (best == null) {
        best = other
        bestIndex = index
      } else if (other != null) {
        if (this.isLeftBetterThanRight(best, other)) {
          this.chop(index)
        } else {
          this.chop(bestIndex)
          bestIndex = index
          best = other
        }
      }
    }
  }

  /**
  *
  */
  private isLeftBetterThanRight(left: UnidocValidationNode, right: UnidocValidationNode): boolean {
    if (left.event.batch !== right.event.batch) {
      return left.event.batch > right.event.batch
    }

    const leftMessages: Pack<number> = this._leftMessages
    const rightMessages: Pack<number> = this._rightMessages

    leftMessages.fill(0)
    rightMessages.fill(0)

    left.countMessages(leftMessages)
    right.countMessages(rightMessages)

    let invert: boolean = false

    for (let index = 0; index < UnidocValidationMessageType.ALL.length; ++index) {
      const type: UnidocValidationMessageType = UnidocValidationMessageType.ALL.length - index - 1

      if (leftMessages.get(type) < rightMessages.get(type)) {
        return !invert
      } else if (leftMessages.get(type) === rightMessages.get(type)) {
        if (leftMessages.get(type) > 0) {
          invert = true
        }
      } else {
        return invert
      }
    }

    return left.event.branch.global > right.event.branch.global
  }

  /**
  * @see UnidocConsumer.handleFailure
  */
  public handleFailure(error: Error): void {
    throw new Error("Method not implemented.");
  }

  /**
  * @see UnidocProducer.addEventListener
  */
  public addEventListener(event: UnidocProducerEvent, listener: any): void {
    this._output.addEventListener(event, listener)
  }

  /**
  * @see UnidocProducer.removeEventListener
  */
  public removeEventListener(event: UnidocProducerEvent, listener: any): void {
    this._output.removeEventListener(event, listener)
  }

  /**
  * @see UnidocProducer.removeAllEventListener
  */
  public removeAllEventListener(...parameters: [any?]): void {
    this._output.removeAllEventListener(...parameters)
  }
}
