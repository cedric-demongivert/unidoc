import { Factory } from '@cedric-demongivert/gl-tool-utils'
import { UnidocConsumer } from './UnidocConsumer'
import { UnidocElement } from './UnidocElement'
import { UnidocProducer } from './UnidocProducer'

/**
 * 
 */
export class UnidocCoroutine<Product> implements UnidocConsumer<Product> {
  /**
   * 
   */
  private readonly _element: UnidocElement<Product>

  /**
   * 
   */
  private readonly _iterator: UnidocCoroutine.Coroutine<Product>

  /**
   * 
   */
  private _producer: UnidocProducer<Product> | undefined

  /**
   * 
   */
  public constructor(iterator: UnidocCoroutine.Definition<Product>) {
    this._element = new UnidocElement()
    this._producer = undefined
    this._iterator = iterator()
    this._iterator.next()

    this.start = this.start.bind(this)
    this.next = this.next.bind(this)
    this.failure = this.failure.bind(this)
    this.success = this.success.bind(this)
  }

  /**
   * @see UnidocConsumer.prototype.subscribe
   */
  public subscribe(producer: UnidocProducer<Product>): void {
    if (this._producer === producer) return
    if (this._producer) this.unsubscribe()

    producer.on(UnidocProducer.START, this.start)
    producer.on(UnidocProducer.NEXT, this.next)
    producer.on(UnidocProducer.FAILURE, this.failure)
    producer.on(UnidocProducer.SUCCESS, this.success)

    this._producer = producer
  }

  /**
   * @see UnidocConsumer.prototype.unsubscribe
   */
  public unsubscribe(): void {
    if (this._producer) {
      const producer: UnidocProducer<Product> = this._producer

      producer.off(UnidocProducer.START, this.start)
      producer.off(UnidocProducer.NEXT, this.next)
      producer.off(UnidocProducer.FAILURE, this.failure)
      producer.off(UnidocProducer.SUCCESS, this.success)

      this._producer = undefined
    }
  }

  /**
   * @see UnidocConsumer.prototype.start
   */
  public start(): void {
    this._iterator.next(UnidocElement.START)
  }

  /**
   * @see UnidocConsumer.prototype.next
   */
  public next(value: Readonly<Product>): void {
    this._iterator.next(this._element.asNext(value))
  }

  /**
   * @see UnidocConsumer.prototype.success
   */
  public success(): void {
    this._iterator.next(UnidocElement.SUCCESS)
  }

  /**
   * @see UnidocConsumer.prototype.failure
   */
  public failure(error: Error): void {
    this._iterator.next(this._element.asFailure(error))
  }
}

/**
 * 
 */
export namespace UnidocCoroutine {
  /**
   * 
   */
  export type Coroutine<Product> = Iterator<void, void, Readonly<UnidocElement<Product>>>

  /**
   * 
   */
  export type Definition<Product> = Factory<Coroutine<Product>>

  /**
   * 
   */
  export function create<Product>(iterator: Definition<Product>): UnidocCoroutine<Product> {
    return new UnidocCoroutine(iterator)
  }

  /**
   * 
   */
  export function feed<Product>(iterator: Iterator<Product>, coroutine: Definition<Product>): void {
    UnidocConsumer.feed(iterator, UnidocCoroutine.create(coroutine))
  }
}