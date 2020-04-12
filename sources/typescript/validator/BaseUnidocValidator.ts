import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocValidation } from '../validation/UnidocValidation'

import { UnidocValidator } from './UnidocValidator'
import { UnidocValidatorEventType } from './UnidocValidatorEventType'

export abstract class BaseUnidocValidator implements UnidocValidator {
  private _validationListeners : Set<UnidocValidator.ValidationListener>
  private _completionListeners : Set<UnidocValidator.CompletionListener>

  public constructor () {
    this._validationListeners = new Set()
    this._completionListeners = new Set()
  }

  /**
  * @see UnidocValidator.next
  */
  public abstract next (event : UnidocEvent) : void

  /**
  * @see UnidocValidator.complete
  */
  public abstract complete () : void

  /**
  * @see UnidocValidator.reset
  */
  public abstract reset () : void

  /**
  * @see UnidocValidator.clear
  */
  public clear() : void {
    this._validationListeners.clear()
    this._completionListeners.clear()
  }

  /**
  * @see UnidocValidator.clone
  */
  public abstract clone () : UnidocValidator

  /**
  * Copy each listener of the given instance.
  *
  * @param toCopy - An instance to copy.
  */
  public copy (toCopy : BaseUnidocValidator) : void {
    this._validationListeners.clear()
    this._completionListeners.clear()

    for (const listener of toCopy._validationListeners) {
      this._validationListeners.add(listener)
    }

    for (const listener of toCopy._completionListeners) {
      this._completionListeners.add(listener)
    }
  }

  /**
  * Publish a validation event.
  *
  * @param validation - A validation event to publish.
  */
  protected emitValidation (validation : UnidocValidation) : void {
    for (const listener of this._validationListeners) {
      listener(validation)
    }
  }

  /**
  * Publish a completion event.
  */
  protected emitCompletion () : void {
    for (const listener of this._completionListeners) {
      listener()
    }
  }

  /**
  * @see UnidocValidator.addEventListener
  */
  public addEventListener(type: "validation", listener: UnidocValidator.ValidationListener): void
  public addEventListener(type: "completion", listener: UnidocValidator.CompletionListener): void
  public addEventListener(type: any, listener: any) {
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
  * @see UnidocValidator.addEventListener
  */
  public removeAllEventListeners(type: "validation"): void
  public removeAllEventListeners(type: "completion"): void
  public removeAllEventListeners(type: "*"): void
  public removeAllEventListeners(type: any) {
    if (type === UnidocValidatorEventType.VALIDATION) {
      this._validationListeners.clear()
    } else if (type === UnidocValidatorEventType.COMPLETION) {
      this._completionListeners.clear()
    } else if (type === '*') {
      this._validationListeners.clear()
      this._completionListeners.clear()
    }else {
      throw new Error(
        'Unable to remove all listeners of the given type of event "' + type +
        '" because "' + type + '" is not a valid unidoc ' +
        'validator event type, valid event types are : ' +
        UnidocValidatorEventType.ALL.join(', ') + ' and *.'
      )
    }
  }

  /**
  * @see UnidocValidator.removeEventListener
  */
  public removeEventListener(type: "validation", listener: UnidocValidator.ValidationListener): void
  public removeEventListener(type: "completion", listener: UnidocValidator.CompletionListener): void
  public removeEventListener(type: any, listener: any) {
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
