import { UnidocProducerEvent } from './UnidocProducerEvent'

export interface UnidocProducer<T> {
  addEventListener (event : UnidocProducerEvent.ProductionEvent, listener : UnidocProducer.ProductionListener<T>) : void
  addEventListener (event : UnidocProducerEvent.CompletionEvent, listener : UnidocProducer.CompletionListener) : void

  removeEventListener (event : UnidocProducerEvent.ProductionEvent, listener : UnidocProducer.ProductionListener<T>) : void
  removeEventListener (event : UnidocProducerEvent.CompletionEvent, listener : UnidocProducer.CompletionListener) : void

  removeAllEventListener (event : UnidocProducerEvent) : void
  removeAllEventListener () : void
}

export namespace UnidocProducer {
  export type ProductionListener<T> = (value : T) => void
  export type CompletionListener = () => void
}
