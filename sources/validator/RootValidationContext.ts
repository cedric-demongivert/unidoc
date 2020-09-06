import { UnidocValidation } from '../validation/UnidocValidation'
import { UnidocEvent } from '../event/UnidocEvent'

import { UnidocValidationContext } from './UnidocValidationContext'
import { RootValidationContextEventType } from './RootValidationContextEventType'

export class RootValidationContext implements UnidocValidationContext {
  /**
  * A set of functions to call when a validation object is emitted.
  */
  private readonly _validationListeners : Set<RootValidationContext.ValidationListener>

  /**
  * A set of functions to call when the entire validation process ends.
  */
  private readonly _completionListeners : Set<RootValidationContext.CompletionListener>

  /**
  * The event to validate.
  */
  public readonly event : UnidocEvent

  /**
  * A validation instance to use for publishing.
  */
  public readonly validation : UnidocValidation

  /**
  * Instantiate a new empty context.
  */
  public constructor () {
    this._validationListeners = new Set<RootValidationContext.ValidationListener>()
    this._completionListeners = new Set<RootValidationContext.CompletionListener>()
    this.event = new UnidocEvent()
    this.validation = new UnidocValidation()
  }

  /**
  * Publish the given validation.
  *
  * @param [validation = this.validation] - The validation message to emit.
  */
  public publish (validation : UnidocValidation = this.validation) : void {
    for (const listener of this._validationListeners) {
      listener(validation)
    }
  }

  /**
  * Publish a completion event.
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
  public addEventListener (type : 'validation', listener : RootValidationContext.ValidationListener) : void
  public addEventListener (type : 'completion', listener : RootValidationContext.CompletionListener) : void
  public addEventListener (type : RootValidationContextEventType, listener : any) : void {
    if (type === RootValidationContextEventType.VALIDATION) {
      this._validationListeners.add(listener)
    } else if (type === RootValidationContextEventType.COMPLETION) {
      this._completionListeners.add(listener)
    } else {
      throw new Error(
        'Unable to add the given listener for the "' + type +
        '" type of event because "' + type + '" is not a valid unidoc ' +
        'validator event type, valid event types are : ' +
        RootValidationContextEventType.ALL.join(', ') + '.'
      )
    }
  }

  /**
  * Remove a registered event listener.
  *
  * @param type - Type of event to stop to listen to.
  * @param listener - A listener to remove.
  */
  public removeEventListener (type : 'validation', listener : RootValidationContext.ValidationListener) : void
  public removeEventListener (type : 'completion', listener : RootValidationContext.CompletionListener) : void
  public removeEventListener (type : RootValidationContextEventType, listener : any) : void {
    if (type === RootValidationContextEventType.VALIDATION) {
      this._validationListeners.delete(listener)
    } else if (type === RootValidationContextEventType.COMPLETION) {
      this._completionListeners.delete(listener)
    } else {
      throw new Error(
        'Unable to remove the given listener for the "' + type +
        '" type of event because "' + type + '" is not a valid unidoc ' +
        'validator event type, valid event types are : ' +
        RootValidationContextEventType.ALL.join(', ') + '.'
      )
    }
  }
}

export namespace RootValidationContext {
  export type ValidationListener = (validation : UnidocValidation) => void
  export type CompletionListener = () => void
}
