import { UnidocValidation } from '../validation/UnidocValidation'

export class ValidationBus {
  private _validationListeners : Set<ValidationBus.ValidationListener>
  private _completionListeners : Set<ValidationBus.CompletionListener>

  public constructor () {
    this._completionListeners = new Set()
    this._validationListeners = new Set()
  }

  public emit (validation : UnidocValidation) : void {
    for (const validationListener of this._validationListeners) {
      validationListener(validation)
    }
  }

  public complete () : void {
    for (const completionListener of this._completionListeners) {
      completionListener()
    }
  }

  public addValidationListener (listener : ValidationBus.ValidationListener) : void {
    this._validationListeners.add(listener)
  }

  public deleteValidationListener (listener : ValidationBus.ValidationListener) : void {
    this._validationListeners.delete(listener)
  }

  public addCompletionListener (listener : ValidationBus.CompletionListener) : void {
    this._completionListeners.add(listener)
  }

  public deleteCompletionListener (listener : ValidationBus.CompletionListener) : void {
    this._completionListeners.delete(listener)
  }

  public clear () : void {
    this._validationListeners.clear()
    this._completionListeners.clear()
  }
}

export namespace ValidationBus {
  export type ValidationListener = (validation : UnidocValidation) => void
  export type CompletionListener = () => void
}
