import { UnidocConsumer } from "./UnidocConsumer"
import { UnidocPublisher } from "./UnidocPublisher"
import { UnidocProducer } from "./UnidocProducer"

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
   * @see UnidocConsumer.prototype.subscribe
   */
  public subscribe(producer: UnidocProducer<Input>): void {
    producer.on(UnidocProducer.START, this.start)
    producer.on(UnidocProducer.NEXT, this.next)
    producer.on(UnidocProducer.SUCCESS, this.success)
    producer.on(UnidocProducer.FAILURE, this.failure)
  }

  /**
   * @see UnidocConsumer.prototype.unsubscribe
   */
  public unsubscribe(producer: UnidocProducer<Input>): void {
    producer.off(UnidocProducer.START, this.start)
    producer.off(UnidocProducer.NEXT, this.next)
    producer.off(UnidocProducer.SUCCESS, this.success)
    producer.off(UnidocProducer.FAILURE, this.failure)
  }

  /**
   * @see UnidocConsumer.prototype.start
   */
  public start(): void {

  }

  /**
   * @see UnidocConsumer.prototype.next
   */
  public next(value: Input): void {
    console.warn('Unhandled production of value %o. To suppress this warning, override the next method.', value)
  }

  /**
   * @see UnidocConsumer.prototype.success
   */
  public success(): void {

  }

  /**
   * @see UnidocConsumer.prototype.failure
   */
  public failure(error: Error): void {
    console.warn('Unhandled failure %o. To suppress this warning, override the failure method.', error)
  }
}
