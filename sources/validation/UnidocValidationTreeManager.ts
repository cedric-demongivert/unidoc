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

    this._nextBatch.clear()
    this._branchIdentifiers.add(0)
    this._branches.size += 1
    this._branches.last.branch.set(0, 0)
    this._nextBranch = 1
    this._nextBatch.set(0, 0)
    this.initializeBranch(this._branches.last.branch)

    return this._branches.last
  }

  /**
  * Mark the given branch as initialized.
  *
  * @param branch - The branch to initialize.
  */
  public initializeBranch(branch: UnidocValidationBranchIdentifier): void {
    this._event.fromBranch(branch).asInitialization()
    this.produce(this._event)
  }

  /**
  * Mark the given branch as completed.
  *
  * @param branch - The branch to complete.
  */
  public completeBranch(branch: UnidocValidationBranchIdentifier): void {
    this._event.fromBranch(branch).asCompletion()
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

  public fromBranch(branch: UnidocValidationBranchIdentifier): UnidocValidationTreeManager {
    this._event.fromBranch(branch)
    return this
  }

  public asMessageOfType(type: UnidocValidationMessageType): UnidocValidationTreeManager {
    this._event.asMessageOfType(type)
    return this
  }

  public asVerboseMessage(): UnidocValidationTreeManager {
    this._event.asVerboseMessage()
    return this
  }

  public asInformationMessage(): UnidocValidationTreeManager {
    this._event.asInformationMessage()
    return this
  }

  public asWarningMessage(): UnidocValidationTreeManager {
    this._event.asWarningMessage()
    return this
  }

  public asErrorMessage(): UnidocValidationTreeManager {
    this._event.asErrorMessage()
    return this
  }

  public asFailureMessage(): UnidocValidationTreeManager {
    this._event.asFailureMessage()
    return this
  }

  public ofCode(code: string): UnidocValidationTreeManager {
    this._event.ofCode(code)
    return this
  }

  public withData(key: string, value: any): UnidocValidationTreeManager {
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
  * Fork the given branch and return a new branch number.
  *
  * @param branch - The identifier of the branch to fork.
  *
  * @return The forked branch.
  */
  public fork(branch: UnidocValidationBranchIdentifier): UnidocValidationBranchManager {
    this._branches.size += 1

    const fork: UnidocValidationBranchManager = this._branches.last

    fork.branch.global = this._nextBranch
    this._nextBranch += 1

    fork.branch.local = this._branchIdentifiers.next()

    this._event.fromBranch(branch).asFork(fork.branch)
    this._nextBatch.set(fork.branch.local, this._nextBatch.get(branch.local))
    this.produce(this._event)

    return fork
  }

  /**
  * @see ListenableUnidocProducer.produce
  */
  public produce(event: UnidocValidationEvent = this._event): UnidocValidationTreeManager {
    event.index = this._nextIndex
    this._nextIndex += 1

    const local: number = event.branch.local

    if (event.type === UnidocValidationEventType.VALIDATION) {
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
      this.completeBranch(this._branches.first.branch)
    }

    super.complete()
  }

  public clear(): void {
    this._nextBranch = 0
    this._nextIndex = 0
    this._event.clear()
    this.removeAllEventListener()
  }
}
