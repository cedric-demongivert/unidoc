import { UnidocEvent } from '../../event/UnidocEvent'

import { UnidocBlueprintValidationProcess } from './UnidocBlueprintValidationProcess'

export class UnidocBlueprintValidationState {
  public process: UnidocBlueprintValidationProcess | null

  /**
  *
  */
  public constructor() {
    this.process = null
  }

  /**
  * Called when the parent validation process enter into this state for the
  * first time.
  *
  * @param process - The process that enter into this state.
  */
  public onEnter(process: UnidocBlueprintValidationProcess): void {
    if (this.process == null) {
      this.process = process
    } else {
      this.throwMultipleBindingAttempt()
    }
  }

  /**
  * Called when a parent fork initialize this state for the first time.
  *
  * @param process - The process that enter into this state.
  */
  public onFork(process: UnidocBlueprintValidationProcess): void {
    if (this.process == null) {
      this.process = process
    } else {
      this.throwMultipleBindingAttempt()
    }
  }

  /**
  * Called when the parent validation process resume this state.
  */
  public onResume(): void {
    if (this.process == null) {
      this.throwUnboundProcess()
    }
  }

  /**
  * Called when the parent validation process exit this state.
  */
  public onExit(): void {
    if (this.process == null) {
      throw new Error(
        'Calling onExit on a state that was not bound to any process.'
      )
    } else {
      this.process = null
    }
  }

  /**
  * @return True if this state need an event to pursue the validation process.
  */
  public doesRequireEvent(): boolean {
    throw new Error(this.constructor.name + '#requireEvent is not implemented yet.')
  }

  /**
  * Called to pursue the validation process until a new event is required.
  */
  public onContinue(): void {
    if (this.process == null) {
      this.throwUnboundProcess()
    }
  }

  /**
  * Called to pursue the validation process.
  *
  * @param next - The next available event to validate, if any.
  */
  public onValidate(next: UnidocEvent): void {
    if (this.process == null) {

    }
  }

  /**
  * Called to complete the validation process.
  */
  public onComplete(): void {
    if (this.process == null) {
      this.throwUnboundProcess()
    }
  }

  /**
  * @return A copy of this validation state.
  */
  public fork(): UnidocBlueprintValidationState {
    throw new Error(this.constructor.name + '#fork was not implemented yet.')
  }

  /**
  *
  */
  public throwUnboundProcess(): void {
    throw new Error(
      'Trying to use a state that was not bound to any process as ' +
      'if it was bound. Please call onEnter or onFork before any call to ' +
      'methods that require the instance to be bound to a process.'
    )
  }

  /**
  *
  */
  public throwMultipleBindingAttempt(): void {
    throw new Error(
      'Trying to bind a state that is already bound to a process. Please ' +
      'call onEnter or onFork only once or unbound the state by using onExit ' +
      'before any new binding attempt.'
    )
  }
}
