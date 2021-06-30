import { UnidocProducer } from './UnidocProducer'
import { UnidocProducerEvent } from './UnidocProducerEvent'
import { UnidocProducerListener } from './UnidocProducerListener'
import { UnidocSink } from './UnidocSink'

/**
 * 
 */
export class UnidocPublisher<Output> implements UnidocProducer<Output>{
  /**
   * 
   */
  protected readonly output: UnidocSink<Output>

  /**
   * Instantiate a new
   */
  public constructor() {
    this.output = new UnidocSink()
  }

  /**
   * @see UnidocProducer.on
   */
  public on(event: UnidocProducerEvent.START, listener: UnidocProducerListener.Start): void
  /**
   * @see UnidocProducer.on
   */
  public on(event: UnidocProducerEvent.NEXT, listener: UnidocProducerListener.Next<Output>): void
  /**
   * @see UnidocProducer.on
   */
  public on(event: UnidocProducerEvent.SUCCESS, listener: UnidocProducerListener.Success): void
  /**
   * @see UnidocProducer.on
   */
  public on(event: UnidocProducerEvent.FAILURE, listener: UnidocProducerListener.Failure): void
  /**
   * @see UnidocProducer.on
   */
  public on(event: UnidocProducerEvent, listener: UnidocProducerListener<Output>): void
  /**
   * 
   */
  public on(event: any, listener: any): void {
    this.output.on(event, listener)
  }

  /**
   * @see UnidocProducer.off
   */
  public off(event: UnidocProducerEvent.START, listener: UnidocProducerListener.Start): void
  /**
   * @see UnidocProducer.off
   */
  public off(event: UnidocProducerEvent.NEXT, listener: UnidocProducerListener.Next<Output>): void
  /**
   * @see UnidocProducer.off
   */
  public off(event: UnidocProducerEvent.SUCCESS, listener: UnidocProducerListener.Success): void
  /**
   * @see UnidocProducer.off
   */
  public off(event: UnidocProducerEvent.FAILURE, listener: UnidocProducerListener.Failure): void
  /**
   * @see UnidocProducer.off
   */
  public off(event: UnidocProducerEvent): void
  /**
   * @see UnidocProducer.off
   */
  public off(): void
  /**
   * 
   */
  public off(event?: any, listener?: any): void {
    this.output.off(event, listener)
  }
}