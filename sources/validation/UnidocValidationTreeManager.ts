import { IdentifierSet } from '@cedric-demongivert/gl-tool-collection'
import { Pack } from '@cedric-demongivert/gl-tool-collection'
import { Sequence } from '@cedric-demongivert/gl-tool-collection'

import { UnidocEvent } from '../event/UnidocEvent'

import { ListenableUnidocProducer } from '../producer/ListenableUnidocProducer'

import { UnidocValidationEvent } from './UnidocValidationEvent'
import { UnidocValidationEventType } from './UnidocValidationEventType'
import { UnidocValidationMessage } from './UnidocValidationMessage'
import { UnidocValidationMessageType } from './UnidocValidationMessageType'
import { UnidocValidationBranchIdentifier } from './UnidocValidationBranchIdentifier'

import { UnidocValidationBranchManager } from './UnidocValidationBranchManager'

export class UnidocValidationTreeManager extends ListenableUnidocProducer<UnidocValidationEvent> {
  /**
  * Next available branch.
  */
  private _nextBranch: number

  /**
  * Index of the next event.
  */
  private _nextIndex: number

  /**
  * Index of the next event.
  */
  private _nextBatch: Pack<number>

  /**
  * Collection of used local branch indentifiers.
  */
  private readonly _branchIdentifiers: IdentifierSet

  /**
  * Collection of existing branch managers.
  */
  private readonly _branches: Pack<UnidocValidationBranchManager>

  /**
  * Sequence of existing branch managers.
  */
  public readonly branches: Sequence<UnidocValidationBranchManager>

  /**
  * Instance used for publishing new events.
  */
  private _event: UnidocValidationEvent

  public constructor(capacity: number = 32) {
    super()
    this._nextBranch = 0
    this._nextIndex = 0
    this._nextBatch = Pack.uint32(capacity)
    this._branchIdentifiers = IdentifierSet.allocate(capacity)
    this._branches = Pack.instance(UnidocValidationBranchManager.allocator(this), capacity)
    this._event = new UnidocValidationEvent()

    this.branches = this._branches.view()
  }

  /**
  * @return The current capacity, in branches, of this manager.
  */
  public get capacity(): number {
    return this._branches.capacity
  }

  /**
  * Initilize this tree.
  */
  public initialize(): UnidocValidationBranchManager {
    super.initialize()

    this._nextBranch = 0
    this._nextIndex = 0
    this._branchIdentifiers.clear()
    this._branches.clear()

    return this.create()
  }

  /**
  * Create a new branch and return it's manager.
  *
  * @return The manager of the branch that was created.
  */
  public create(): UnidocValidationBranchManager {
    const identifier: number = this._branchIdentifiers.next()

    this._branches.size += 1

    const result: UnidocValidationBranchManager = this._branches.last
    result.branch.set(this._nextBranch, identifier)

    this._nextBranch += 1
    this._nextBatch.set(identifier, 0)

    this._event.fromBranch(result.branch).asCreation()
    this.produce(this._event)

    return result
  }

  /**
  * Mark the given branch as completed.
  *
  * @param branch - The branch to complete.
  */
  public terminate(branch: UnidocValidationBranchIdentifier): void {
    this._event.fromBranch(branch).asTermination()
    this.produce(this._event)

    const index: number = this._branchIdentifiers.indexOf(branch.local)
    this._branchIdentifiers.delete(branch.local)
    this._branches.warp(index)
  }

  /**
  * Notify the validation of the given event by the given branch.
  *
  * @param branch - The branch that does the validation.
  * @param event - The event that is validated.
  */
  public validate(branch: UnidocValidationBranchIdentifier, event: UnidocEvent): UnidocValidationTreeManager {
    this._event.fromBranch(branch).asValidation(event)
    this.produce(this._event)
    return this
  }

  /**
  * Notify the document completion.
  *
  * @param branch - The branch that does the validation.
  */
  public documentCompletion(branch: UnidocValidationBranchIdentifier): UnidocValidationTreeManager {
    this._event.fromBranch(branch).asDocumentCompletion()
    this.produce(this._event)
    return this
  }

  public prepareNewMessage(branch: UnidocValidationBranchIdentifier): UnidocValidationTreeManager {
    this._event.fromBranch(branch)
    this._event.asMessage()
    return this
  }

  public setMessageType(type: UnidocValidationMessageType): UnidocValidationTreeManager {
    this._event.asMessageOfType(type)
    return this
  }

  public setMessageCode(code: string): UnidocValidationTreeManager {
    this._event.ofCode(code)
    return this
  }

  public setMessageData(key: string, value: any): UnidocValidationTreeManager {
    this._event.withData(key, value)
    return this
  }

  /**
  * Notify the publication of the given message by the given branch.
  *
  * @param branch - The branch that does the validation.
  * @param message - The message to publish.
  */
  public message(branch: UnidocValidationBranchIdentifier, message: UnidocValidationMessage): UnidocValidationTreeManager {
    this._event.fromBranch(branch).asMessage(message)
    this.produce(this._event)
    return this
  }

  /**
  *
  */
  public getManagerOf(branch: UnidocValidationBranchIdentifier): UnidocValidationBranchManager {
    return this._branches.get(this._branchIdentifiers.indexOf(branch.local))
  }

  /**
  * Fork the given branch and return the resulting branch manager.
  *
  * @param branch - The identifier of the branch to fork.
  *
  * @return The resulting branch manager.
  */
  public fork(branch: UnidocValidationBranchIdentifier): UnidocValidationBranchManager {
    this._branches.size += 1

    const fork: UnidocValidationBranchManager = this._branches.last

    fork.branch.global = this._nextBranch
    this._nextBranch += 1

    if (this._branchIdentifiers.size === this._branchIdentifiers.capacity) {
      this._branchIdentifiers.reallocate(this._branchIdentifiers.size * 2)
    }

    fork.branch.local = this._branchIdentifiers.next()

    this._event.fromBranch(branch).asFork(fork.branch)
    this._nextBatch.set(fork.branch.local, this._nextBatch.get(branch.local))
    this.produce(this._event)

    return fork
  }

  /**
  * Merge a branch into another and return the manager of the resulting branch.
  *
  * @param from - The identifier of the source branch.
  * @param to - The identifier of the destination branch.
  *
  * @return The manager of the resulting branch.
  */
  public merge(from: UnidocValidationBranchIdentifier, to: UnidocValidationBranchIdentifier): UnidocValidationBranchManager {
    this._event.fromBranch(from).asMerge(to)
    this.produce(this._event)

    const index: number = this._branchIdentifiers.indexOf(from.local)
    this._branchIdentifiers.delete(from.local)
    this._branches.warp(index)

    return this._branches.get(this._branchIdentifiers.indexOf(to.local))
  }

  /**
  * @see ListenableUnidocProducer.produce
  */
  public produce(event: UnidocValidationEvent = this._event): UnidocValidationTreeManager {
    event.index = this._nextIndex
    this._nextIndex += 1

    const local: number = event.branch.local

    if (
      event.type === UnidocValidationEventType.VALIDATION ||
      event.type === UnidocValidationEventType.DOCUMENT_COMPLETION
    ) {
      this._nextBatch.set(local, event.event.index + 1)
    }
    event.batch = this._nextBatch.get(local)

    super.produce(event)
    return this
  }

  /**
  * @see ListenableUnidocProducer.complete
  */
  public complete(): void {
    while (this._branches.size > 0) {
      this.terminate(this._branches.first.branch)
    }

    super.complete()
  }

  /**
  * Reset this manager instance to it's initial state.
  */
  public reset(): void {
    this._nextBranch = 0
    this._nextIndex = 0
    this._event.clear()
  }

  /**
  * Reset this manager to it's instantiation state.
  */
  public clear(): void {
    this._nextBranch = 0
    this._nextIndex = 0
    this._event.clear()
    this.removeAllEventListener()
  }
}
