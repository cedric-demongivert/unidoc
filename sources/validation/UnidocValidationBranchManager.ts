import { Allocator } from '@cedric-demongivert/gl-tool-collection'

import { UnidocEvent } from '../event/UnidocEvent'

import { UnidocValidationBranchIdentifier } from './UnidocValidationBranchIdentifier'
import { UnidocValidationEvent } from './UnidocValidationEvent'
import { UnidocValidationMessage } from './UnidocValidationMessage'
import { UnidocValidationMessageType } from './UnidocValidationMessageType'
import { UnidocValidationTreeManager } from './UnidocValidationTreeManager'

export class UnidocValidationBranchManager {
  public readonly tree: UnidocValidationTreeManager
  public readonly branch: UnidocValidationBranchIdentifier

  public constructor(tree: UnidocValidationTreeManager) {
    this.tree = tree
    this.branch = new UnidocValidationBranchIdentifier()
  }

  /**
  * Initilize this branch.
  */
  public initialize(): UnidocValidationBranchManager {
    this.tree.initializeBranch(this.branch)
    return this
  }

  /**
  * Notify the validation of the given event by this branch.
  *
  * @param event - The event that is validated.
  */
  public validate(event: UnidocEvent): UnidocValidationBranchManager {
    this.tree.validate(this.branch, event)
    return this
  }

  public asMessageOfType(type: UnidocValidationMessageType): UnidocValidationBranchManager {
    this.tree.fromBranch(this.branch).asMessageOfType(type)
    return this
  }

  public asVerboseMessage(): UnidocValidationBranchManager {
    this.tree.fromBranch(this.branch).asVerboseMessage()
    return this
  }

  public asInformationMessage(): UnidocValidationBranchManager {
    this.tree.fromBranch(this.branch).asInformationMessage()
    return this
  }

  public asWarningMessage(): UnidocValidationBranchManager {
    this.tree.fromBranch(this.branch).asWarningMessage()
    return this
  }

  public asErrorMessage(): UnidocValidationBranchManager {
    this.tree.fromBranch(this.branch).asErrorMessage()
    return this
  }

  public asFailureMessage(): UnidocValidationBranchManager {
    this.tree.fromBranch(this.branch).asFailureMessage()
    return this
  }

  public ofCode(code: string): UnidocValidationBranchManager {
    this.tree.ofCode(code)
    return this
  }

  public withData(key: string, value: any): UnidocValidationBranchManager {
    this.tree.withData(key, value)
    return this
  }

  /**
  * Notify the publication of the given message by this branch.
  *
  * @param message - The message to publish.
  */
  public message(message: UnidocValidationMessage): UnidocValidationBranchManager {
    this.tree.message(this.branch, message)
    return this
  }

  /**
  * Fork this branch and return a new branch.
  *
  * @return The forked branch.
  */
  public fork(): UnidocValidationBranchManager {
    return this.tree.fork(this.branch)
  }

  /**
  * @see ListenableUnidocProducer.produce
  */
  public produce(): UnidocValidationBranchManager {
    this.tree.produce()
    return this
  }

  /**
  * @see ListenableUnidocProducer.complete
  */
  public complete(): void {
    this.tree.completeBranch(this.branch)
  }

  public clear(): void {
    this.branch.clear()
  }

  public copy(toCopy: UnidocValidationBranchManager): void {
    this.branch.copy(toCopy.branch)
  }
}

export namespace UnidocValidationBranchManager {
  export function allocator(tree: UnidocValidationTreeManager): Allocator<UnidocValidationBranchManager> {
    return {
      allocate(): UnidocValidationBranchManager {
        return new UnidocValidationBranchManager(tree)
      },

      clear(instance: UnidocValidationBranchManager): void {
        instance.clear()
      },

      copy(source: UnidocValidationBranchManager, destination: UnidocValidationBranchManager): void {
        destination.copy(source)
      }
    }
  }
}
