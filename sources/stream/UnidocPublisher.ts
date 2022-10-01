import { UnidocConsumer } from './UnidocConsumer'
import { UnidocProducer } from './UnidocProducer'
import { UnidocSink } from './UnidocSink'

/**
 * 
 */
export class UnidocPublisher<Product> implements UnidocProducer<Product>{
  /**
   * 
   */
  protected readonly output: UnidocSink<Product>

  /**
   * Instantiate a new
   */
  public constructor() {
    this.output = new UnidocSink()
  }

  /**
   * @see UnidocProducer.prototype.on
   */
  public on(event: UnidocProducer.START, listener: UnidocConsumer.Start): void
  /**
   * @see UnidocProducer.prototype.on
   */
  public on(event: UnidocProducer.NEXT, listener: UnidocConsumer.Next<Product>): void
  /**
   * @see UnidocProducer.prototype.on
   */
  public on(event: UnidocProducer.SUCCESS, listener: UnidocConsumer.Success): void
  /**
   * @see UnidocProducer.prototype.on
   */
  public on(event: UnidocProducer.FAILURE, listener: UnidocConsumer.Failure): void
  /**
   * @see UnidocProducer.prototype.on
   */
  public on(event: UnidocProducer.Event, listener: UnidocConsumer.Listener<Product>): void
  /**
   * 
   */
  public on(event: any, listener: any): void {
    this.output.on(event, listener)
  }

  /**
   * @see UnidocProducer.prototype.off
   */
  public off(event: UnidocProducer.START, listener: UnidocConsumer.Start): void
  /**
   * @see UnidocProducer.prototype.off
   */
  public off(event: UnidocProducer.NEXT, listener: UnidocConsumer.Next<Product>): void
  /**
   * @see UnidocProducer.prototype.off
   */
  public off(event: UnidocProducer.SUCCESS, listener: UnidocConsumer.Success): void
  /**
   * @see UnidocProducer.prototype.off
   */
  public off(event: UnidocProducer.FAILURE, listener: UnidocConsumer.Failure): void
  /**
   * @see UnidocProducer.prototype.off
   */
  public off(event: UnidocProducer.Event, listener: UnidocConsumer.Listener<Product>): void
  /**
   * @see UnidocProducer.prototype.off
   */
  public off(event: UnidocProducer.Event): void
  /**
   * @see UnidocProducer.prototype.off
   */
  public off(): void
  /**
   * 
   */
  public off(event?: any, listener?: any): void {
    this.output.off(event, listener)
  }
}