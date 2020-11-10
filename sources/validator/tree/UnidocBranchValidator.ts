import { UnidocEvent } from '../../event/UnidocEvent'

import { UnidocValidationMessageType } from '../../validation/UnidocValidationMessageType'
import { UnidocValidationBranchIdentifier } from '../../validation/UnidocValidationBranchIdentifier'

import { UnidocTreeValidator } from './UnidocTreeValidator'
import { UnidocBranchAutomata } from './UnidocBranchAutomata'
import { UnidocNullBranchAutomata } from './UnidocNullBranchAutomata'

export class UnidocBranchValidator {
  public readonly tree: UnidocTreeValidator
  public readonly branch: UnidocValidationBranchIdentifier
  public automata: UnidocBranchAutomata
  public running: boolean

  public constructor(tree: UnidocTreeValidator) {
    this.tree = tree
    this.branch = new UnidocValidationBranchIdentifier()
    this.automata = UnidocNullBranchAutomata.INSTANCE
    this.running = true
  }

  /**
  * Start this validation branch.
  */
  public initialize(): void {
    this.automata.initialize(this)
  }

  /**
  * Make this branch validating the given event.
  *
  * @param [event] - The event to validate.
  */
  public validate(event?: UnidocEvent): void {
    if (event) {
      this.automata.validate(this, event)
    } else {
      this.automata.validate(this)
    }
  }

  public asMessageOfType(type: UnidocValidationMessageType): UnidocBranchValidator {
    this.tree.fromBranch(this).asMessageOfType(type)
    return this
  }

  public asVerboseMessage(): UnidocBranchValidator {
    this.tree.fromBranch(this).asVerboseMessage()
    return this
  }

  public asInformationMessage(): UnidocBranchValidator {
    this.tree.fromBranch(this).asInformationMessage()
    return this
  }

  public asWarningMessage(): UnidocBranchValidator {
    this.tree.fromBranch(this).asWarningMessage()
    return this
  }

  public asErrorMessage(): UnidocBranchValidator {
    this.tree.fromBranch(this).asErrorMessage()
    return this
  }

  public asFailureMessage(): UnidocBranchValidator {
    this.tree.fromBranch(this).asFailureMessage()
    return this
  }

  public ofCode(code: string): UnidocBranchValidator {
    this.tree.ofCode(code)
    return this
  }

  public withData(key: string, value: any): UnidocBranchValidator {
    this.tree.withData(key, value)
    return this
  }

  public produce(): void {
    this.tree.produce()
  }

  public fork(automata: UnidocBranchAutomata): void {
    this.tree.fork(this, automata)
  }

  /**
  * End this validation branch.
  */
  public complete(): void {
    if (this.running) {
      this.running = false
      this.automata.complete(this)
    }
  }

  /**
  * Mark this branch as the last one.
  */
  public last(): void {
    this.automata.last(this)
  }
}
