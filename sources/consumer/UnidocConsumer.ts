import { UnidocProducer } from '../producer/UnidocProducer'

export interface UnidocConsumer<T> {
  subscribe <Producer extends UnidocProducer<T>> (producer : Producer) : Producer

  unsubscribe (producer : UnidocProducer<T>) : void

  handleInitialization () : void

  handleProduction (value : T) : void

  handleCompletion () : void

  handleFailure (error : Error) : void
}

export namespace UnidocConsumer {
}
