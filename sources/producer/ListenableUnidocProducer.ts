import { UnidocProducer } from './UnidocProducer'
import { UnidocProducerEvent } from './UnidocProducerEvent'

/**
* A implementation of the unidoc producer interface that is listenable.
*/
export class ListenableUnidocProducer<T> implements UnidocProducer<T> {
  private readonly _completionListeners : Set<UnidocProducer.CompletionListener>
  private readonly _productionListeners : Set<UnidocProducer.ProductionListener<T>>
  private readonly _initializationListeners : Set<UnidocProducer.InitializationListener>
  private readonly _failureListeners : Set<UnidocProducer.FailureListener>

  /**
  * Instantiate a new
  */
  public constructor () {
    this._completionListeners = new Set()
    this._productionListeners = new Set()
    this._initializationListeners = new Set()
    this._failureListeners = new Set()
  }

  /**
  * Notify the initialization of the production process.
  */
  protected initialize () : void {
    for (const listener of this._initializationListeners) {
      listener()
    }
  }

  /**
  * Notify a failure of the production process.
  */
  protected fail (error : Error) : void {
    for (const listener of this._failureListeners) {
      listener(error)
    }
  }

  /**
  * Notify the production of an element.
  */
  protected produce (value : T) : void {
    for (const listener of this._productionListeners) {
      listener(value)
    }
  }

  /**
  * Notify the completion of the production process.
  */
  protected complete () : void {
    for (const listener of this._completionListeners) {
      listener()
    }
  }

  /**
  * @see UnidocProducer.addEventListener
  */
  public addEventListener(event : UnidocProducerEvent.ProductionEvent, listener : UnidocProducer.ProductionListener<T>) : void
  /**
  * @see UnidocProducer.addEventListener
  */
  public addEventListener(event : UnidocProducerEvent.CompletionEvent, listener : UnidocProducer.CompletionListener) : void
  /**
  * @see UnidocProducer.addEventListener
  */
  public addEventListener(event : UnidocProducerEvent.FailureEvent, listener : UnidocProducer.FailureListener) : void
  /**
  * @see UnidocProducer.addEventListener
  */
  public addEventListener(event : UnidocProducerEvent.InitializationEvent, listener : UnidocProducer.InitializationListener) : void
  public addEventListener(event : UnidocProducerEvent, listener : any) : void {
    switch (event) {
      case UnidocProducerEvent.COMPLETION:
        this._completionListeners.add(listener)
        return
      case UnidocProducerEvent.PRODUCTION:
        this._productionListeners.add(listener)
        return
      case UnidocProducerEvent.FAILURE:
        this._failureListeners.add(listener)
        return
      case UnidocProducerEvent.INITIALIZATION:
        this._initializationListeners.add(listener)
        return
      default:
        throw new Error(
          'Unable to register the given listener for event type #' + event +
          ' "' + UnidocProducerEvent.toString(event) + '" because the given ' +
          'event type does not exists or is not supported.'
        )
    }
  }

  /**
  * @see UnidocProducer.removeEventListener
  */
  public removeEventListener(event : UnidocProducerEvent.ProductionEvent, listener : UnidocProducer.ProductionListener<T>) : void
  /**
  * @see UnidocProducer.removeEventListener
  */
  public removeEventListener(event : UnidocProducerEvent.CompletionEvent, listener : UnidocProducer.CompletionListener) : void
  /**
  * @see UnidocProducer.removeEventListener
  */
  public removeEventListener(event : UnidocProducerEvent.FailureEvent, listener : UnidocProducer.FailureListener) : void
  /**
  * @see UnidocProducer.removeEventListener
  */
  public removeEventListener(event : UnidocProducerEvent.InitializationEvent, listener : UnidocProducer.InitializationListener) : void
  public removeEventListener(event : UnidocProducerEvent, listener : any) : void {
    switch (event) {
      case UnidocProducerEvent.COMPLETION:
        this._completionListeners.delete(listener)
        return
      case UnidocProducerEvent.PRODUCTION:
        this._productionListeners.delete(listener)
        return
      case UnidocProducerEvent.FAILURE:
        this._failureListeners.delete(listener)
        return
      case UnidocProducerEvent.INITIALIZATION:
        this._initializationListeners.delete(listener)
        return
      default:
        throw new Error(
          'Unable to remove the given listener for event type #' + event +
          ' "' + UnidocProducerEvent.toString(event) + '" because the given ' +
          'event type does not exists or is not supported.'
        )
    }
  }

  /**
  * @see UnidocProducer.removeAllEventListener
  */
  public removeAllEventListener(event : UnidocProducerEvent) : void
  /**
  * @see UnidocProducer.removeAllEventListener
  */
  public removeAllEventListener() : void
  public removeAllEventListener(event? : UnidocProducerEvent) : void {
    if (event == null) {
      this._completionListeners.clear()
      this._productionListeners.clear()
      this._initializationListeners.clear()
      this._failureListeners.clear()
    } else {
      switch (event) {
        case UnidocProducerEvent.COMPLETION:
          this._completionListeners.clear()
          return
        case UnidocProducerEvent.PRODUCTION:
          this._productionListeners.clear()
          return
        case UnidocProducerEvent.FAILURE:
          this._failureListeners.clear()
          return
        case UnidocProducerEvent.INITIALIZATION:
          this._initializationListeners.clear()
          return
        default:
          throw new Error(
            'Unable to remove all event listener of event type #' + event +
            ' "' + UnidocProducerEvent.toString(event) + '" because the given ' +
            'event type does not exists or is not supported.'
          )
      }
    }
  }
}
