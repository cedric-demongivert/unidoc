import { Allocator } from '@cedric-demongivert/gl-tool-collection'

import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocBlueprint } from '../blueprint/UnidocBlueprint'

import { UnidocValidationBranchIdentifier } from './UnidocValidationBranchIdentifier'
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
  * Notify the validation of the given event by this branch.
  *
  * @param event - The event that is validated.
  */
  public validate(event: UnidocEvent): UnidocValidationBranchManager {
    this.tree.validate(this.branch, event)
    return this
  }


  public documentCompletion(): UnidocValidationBranchManager {
    this.tree.documentCompletion(this.branch)
    return this
  }

  public prepareNewMessage(): UnidocValidationBranchManager {
    this.tree.prepareNewMessage(this.branch)
    return this
  }

  public setMessageType(type: UnidocValidationMessageType): UnidocValidationBranchManager {
    this.tree.setMessageType(type)
    return this
  }

  public setMessageCode(code: string): UnidocValidationBranchManager {
    this.tree.setMessageCode(code)
    return this
  }

  public setMessageData(key: string, value: any): UnidocValidationBranchManager {
    this.tree.setMessageData(key, value)
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
  * Merge this branch into another one and return the resulting branch.
  *
  * @param target - The branch to merge into.
  *
  * @return The resulting branch.
  */
  public merge(target: UnidocValidationBranchIdentifier): UnidocValidationBranchManager {
    return this.tree.merge(this.branch, target)
  }

  /**
  * @see ListenableUnidocProducer.produce
  */
  public produce(): UnidocValidationBranchManager {
    this.tree.produce()
    return this
  }

  /**
  *
  */
  public entering(blueprint: UnidocBlueprint): UnidocValidationBranchManager {
    this.tree.entering(this.branch, blueprint)
    return this
  }

  /**
  *
  */
  public exiting(blueprint: UnidocBlueprint): UnidocValidationBranchManager {
    this.tree.exiting(this.branch, blueprint)
    return this
  }

  /**
  * @see ListenableUnidocProducer.complete
  */
  public terminate(): void {
    this.tree.terminate(this.branch)
  }

  /**
  *
  */
  public clear(): void {
    this.branch.clear()
  }

  /**
  *
  */
  public copy(toCopy: UnidocValidationBranchManager): void {
    this.branch.copy(toCopy.branch)
  }
}

export namespace UnidocValidationBranchManager {
  export function create(tree: UnidocValidationTreeManager): UnidocValidationBranchManager {
    return new UnidocValidationBranchManager(tree)
  }

  export function allocator(tree: UnidocValidationTreeManager): Allocator<UnidocValidationBranchManager> {
    return Allocator.fromFactory(create.bind(null, tree))
  }
}
