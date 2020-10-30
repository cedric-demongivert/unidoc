import { UnidocProducer } from './UnidocProducer'
import { UnidocProducerEvent } from './UnidocProducerEvent'

export class BasicUnidocProducer<T> implements UnidocProducer<T> {
  private readonly _completionListeners  : Set<UnidocProducer.CompletionListener>
  private readonly _productionListeners  : Set<UnidocProducer.ProductionListener<T>>

  public constructor () {
    this._completionListeners = new Set()
    this._productionListeners = new Set()
  }

  protected produce (value : T) : void {
    for (const listener of this._productionListeners) {
      listener(value)
    }
  }

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
  public addEventListener(event : UnidocProducerEvent, listener : any) : void {
    switch (event) {
      case UnidocProducerEvent.COMPLETION:
        this._completionListeners.add(listener)
        return
      case UnidocProducerEvent.PRODUCTION:
        this._productionListeners.add(listener)
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
  removeEventListener(event : UnidocProducerEvent.ProductionEvent, listener : UnidocProducer.ProductionListener<T>) : void
  /**
  * @see UnidocProducer.removeEventListener
  */
  removeEventListener(event : UnidocProducerEvent.CompletionEvent, listener : UnidocProducer.CompletionListener) : void
  removeEventListener(event : UnidocProducerEvent, listener : any) : void {
    switch (event) {
      case UnidocProducerEvent.COMPLETION:
        this._completionListeners.delete(listener)
        return
      case UnidocProducerEvent.PRODUCTION:
        this._productionListeners.delete(listener)
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
  removeAllEventListener(event : UnidocProducerEvent) : void
  /**
  * @see UnidocProducer.removeAllEventListener
  */
  removeAllEventListener() : void
  removeAllEventListener(event? : UnidocProducerEvent) : void {
    if (event == null) {
      this._completionListeners.clear()
      this._productionListeners.clear()
    } else {
      switch (event) {
        case UnidocProducerEvent.COMPLETION:
          this._completionListeners.clear()
          return
        case UnidocProducerEvent.PRODUCTION:
          this._productionListeners.clear()
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
