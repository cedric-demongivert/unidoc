import { Pack } from '@cedric-demongivert/gl-tool-collection'

import { UnidocValidation } from '../validation/UnidocValidation'
import { UnidocPathElementType } from '../path/UnidocPathElementType'
import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocEventType } from '../event/UnidocEventType'

import { UnidocValidationContext } from './UnidocValidationContext'
import { UnidocValidationProcess } from './UnidocValidationProcess'
import { UnidocValidatorEventType } from './UnidocValidatorEventType'

export class UnidocValidator {
  private readonly _validationListeners : Set<UnidocValidator.ValidationListener>
  private readonly _completionListeners : Set<UnidocValidator.CompletionListener>

  private readonly _stack : Pack<UnidocValidationProcess>
  private readonly _context : UnidocValidationContext

  /**
  * Instantiate a new empty validator.
  */
  public constructor () {
    this._validationListeners = new Set<UnidocValidator.ValidationListener>()
    this._completionListeners = new Set<UnidocValidator.CompletionListener>()
    this._stack = Pack.any(16)
    this._context = new UnidocValidationContext(this)
  }

  /**
  * Start the given validation process and push it into this validator stack.
  *
  * @param process - The validation process to start.
  */
  public start (process : UnidocValidationProcess) : void {
    this._stack.push(process)
  }

  /**
  * Terminate the current validation process and remove it from this validator stack.
  *
  * @return The process that was terminated.
  */
  public terminate () : UnidocValidationProcess {
    return this._stack.pop()
  }

  public get current () : UnidocValidationProcess {
    return this._stack.last
  }

  /**
  * Notify the validator that an event is ready for validation in the parent
  * stream of events.
  *
  * @param event - Next unidoc event to validate.
  */
  public next (event : UnidocEvent) : void {
    //console.log(event.toString())
    this._context.event.copy(event)
    this._stack.last.resolve(this._context)
  }

  /**
  * Emit the given validation to this validator listeners.
  *
  * @param validation - The validation message to emit.
  */
  public emit (validation : UnidocValidation) : void {
    for (const listener of this._validationListeners) {
      listener(validation)
    }
  }

  /**
  * Notify the validator that the stream of event to validate ends.
  */
  public complete () : void {
    for (const listener of this._completionListeners) {
      listener()
    }
  }

  /**
  * Add the given listener to this validator set of listeners.
  *
  * @param type - Type of event to listen to.
  * @param listener - A listener to call then the given type of event happens.
  */
  public addEventListener (type : 'validation', listener : UnidocValidator.ValidationListener) : void
  public addEventListener (type : 'completion', listener : UnidocValidator.CompletionListener) : void
  public addEventListener (type : UnidocValidatorEventType, listener : any) : void {
    if (type === UnidocValidatorEventType.VALIDATION) {
      this._validationListeners.add(listener)
    } else if (type === UnidocValidatorEventType.COMPLETION) {
      this._completionListeners.add(listener)
    } else {
      throw new Error(
        'Unable to add the given listener for the "' + type +
        '" type of event because "' + type + '" is not a valid unidoc ' +
        'validator event type, valid event types are : ' +
        UnidocValidatorEventType.ALL.join(', ') + '.'
      )
    }
  }

  /**
  * Remove a registered event listener.
  *
  * @param type - Type of event to stop to listen to.
  * @param listener - A listener to remove.
  */
  public removeEventListener (type : 'validation', listener : UnidocValidator.ValidationListener) : void
  public removeEventListener (type : 'completion', listener : UnidocValidator.CompletionListener) : void
  public removeEventListener (type : UnidocValidatorEventType, listener : any) : void {
    if (type === UnidocValidatorEventType.VALIDATION) {
      this._validationListeners.delete(listener)
    } else if (type === UnidocValidatorEventType.COMPLETION) {
      this._completionListeners.delete(listener)
    } else {
      throw new Error(
        'Unable to remove the given listener for the "' + type +
        '" type of event because "' + type + '" is not a valid unidoc ' +
        'validator event type, valid event types are : ' +
        UnidocValidatorEventType.ALL.join(', ') + '.'
      )
    }
  }
}

export namespace UnidocValidator {
  export type ValidationListener = (validation : UnidocValidation) => void
  export type CompletionListener = () => void
}
