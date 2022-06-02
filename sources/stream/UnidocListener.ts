import { UnidocConsumer } from './UnidocConsumer'
import { UnidocProducer } from './UnidocProducer'

/**
 * 
 */
export class UnidocListener<Product> implements UnidocConsumer<Product> {
  /**
   * 
   */
  private _producer: UnidocProducer<Product> | undefined

  /**
   * 
   */
  public constructor() {
    this.start = this.start.bind(this)
    this.next = this.next.bind(this)
    this.success = this.success.bind(this)
    this.failure = this.failure.bind(this)

    this._producer = undefined
  }

  /**
   * @see UnidocConsumer.prototype.subscribe
   */
  public subscribe(producer: UnidocProducer<Product>): void {
    if (this._producer === producer) return
    if (this._producer) this.unsubscribe()

    if (producer) {
      producer.on(UnidocProducer.START, this.start)
      producer.on(UnidocProducer.NEXT, this.next)
      producer.on(UnidocProducer.SUCCESS, this.success)
      producer.on(UnidocProducer.FAILURE, this.failure)
      this._producer = producer
    }
  }

  /**
   * @see UnidocConsumer.prototype.unsubscribe
   */
  public unsubscribe(): void {
    if (this._producer) {
      const producer: UnidocProducer<Product> = this._producer
      this._producer = undefined

      producer.off(UnidocProducer.START, this.start)
      producer.off(UnidocProducer.NEXT, this.next)
      producer.off(UnidocProducer.SUCCESS, this.success)
      producer.off(UnidocProducer.FAILURE, this.failure)
    }
  }

  /**
   * @see UnidocConsumer.prototype.start
   */
  public start(): void {

  }

  /**
   * @see UnidocConsumer.prototype.next
   */
  public next(value: Readonly<Product>): void {
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