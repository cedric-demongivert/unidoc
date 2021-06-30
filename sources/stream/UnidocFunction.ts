import { UnidocConsumer } from "./UnidocConsumer"
import { UnidocPublisher } from "./UnidocPublisher"
import { UnidocProducer } from "./UnidocProducer"
import { UnidocProducerEvent } from "./UnidocProducerEvent"

/**
 * 
 */
export class UnidocFunction<Input, Output = Input> extends UnidocPublisher<Output> implements UnidocConsumer<Input> {
  /**
   * 
   */
  public constructor() {
    super()
    this.start = this.start.bind(this)
    this.next = this.next.bind(this)
    this.success = this.success.bind(this)
    this.failure = this.failure.bind(this)
  }

  /**
   * @see UnidocConsumer.subscribe
   */
  public subscribe(producer: UnidocProducer<Input>): void {
    producer.on(UnidocProducerEvent.START, this.start)
    producer.on(UnidocProducerEvent.NEXT, this.next)
    producer.on(UnidocProducerEvent.SUCCESS, this.success)
    producer.on(UnidocProducerEvent.FAILURE, this.failure)
  }

  /**
   * @see UnidocConsumer.unsubscribe
   */
  public unsubscribe(producer: UnidocProducer<Input>): void {
    producer.off(UnidocProducerEvent.START, this.start)
    producer.off(UnidocProducerEvent.NEXT, this.next)
    producer.off(UnidocProducerEvent.SUCCESS, this.success)
    producer.off(UnidocProducerEvent.FAILURE, this.failure)
  }

  /**
   * @see UnidocConsumer.start
   */
  public start(): void {

  }

  /**
   * @see UnidocConsumer.next
   */
  public next(value: Input): void {
    console.warn('Unhandled production of value %o. To suppress this warning, override the next method.', value)
  }

  /**
   * @see UnidocConsumer.success
   */
  public success(): void {

  }

  /**
   * @see UnidocConsumer.failure
   */
  public failure(error: Error): void {
    console.warn('Unhandled failure %o. To suppress this warning, override the failure method.', error)
  }
}
