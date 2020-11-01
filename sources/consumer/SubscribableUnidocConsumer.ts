import { UnidocProducer } from '../producer/UnidocProducer'
import { UnidocProducerEvent } from '../producer/UnidocProducerEvent'

import { UnidocConsumer } from './UnidocConsumer'

export abstract class SubscribableUnidocConsumer<T> implements UnidocConsumer<T> {
  public constructor () {
    this.handleInitialization = this.handleInitialization.bind(this)
    this.handleProduction = this.handleProduction.bind(this)
    this.handleCompletion = this.handleCompletion.bind(this)
    this.handleFailure = this.handleFailure.bind(this)
  }

  /**
  * @see UnidocConsumer.subscribe
  */
  public subscribe <Producer extends UnidocProducer<T>> (producer : Producer) : Producer {
    producer.addEventListener(UnidocProducerEvent.INITIALIZATION, this.handleInitialization)
    producer.addEventListener(UnidocProducerEvent.PRODUCTION, this.handleProduction)
    producer.addEventListener(UnidocProducerEvent.COMPLETION, this.handleCompletion)
    producer.addEventListener(UnidocProducerEvent.FAILURE, this.handleFailure)
    return producer
  }

  /**
  * @see UnidocConsumer.unsubscribe
  */
  public unsubscribe (producer : UnidocProducer<T>) : void {
    producer.removeEventListener(UnidocProducerEvent.INITIALIZATION, this.handleInitialization)
    producer.removeEventListener(UnidocProducerEvent.PRODUCTION, this.handleProduction)
    producer.removeEventListener(UnidocProducerEvent.COMPLETION, this.handleCompletion)
    producer.removeEventListener(UnidocProducerEvent.FAILURE, this.handleFailure)
  }

  /**
  * @see UnidocConsumer.handleInitialization
  */
  public abstract handleInitialization () : void

  /**
  * @see UnidocConsumer.handleProduction
  */
  public abstract  handleProduction (value : T) : void

  /**
  * @see UnidocConsumer.handleCompletion
  */
  public abstract  handleCompletion () : void

  /**
  * @see UnidocConsumer.handleFailure
  */
  public abstract  handleFailure (error : Error) : void
}

export namespace SubscribableUnidocConsumer {

}
