import { UnidocProducerEvent } from './UnidocProducerEvent'
import { UnidocProducerListener } from './UnidocProducerListener'

/**
 * 
 */
export interface UnidocProducer<Output> {
  /**
   * 
   */
  on(event: UnidocProducerEvent.NEXT, listener: UnidocProducerListener.Next<Output>): void

  /**
   * 
   */
  on(event: UnidocProducerEvent.SUCCESS, listener: UnidocProducerListener.Success): void

  /**
   * 
   */
  on(event: UnidocProducerEvent.START, listener: UnidocProducerListener.Start): void

  /**
   * 
   */
  on(event: UnidocProducerEvent.FAILURE, listener: UnidocProducerListener.Failure): void

  /**
   * 
   */
  on(event: UnidocProducerEvent, listener: UnidocProducerListener<Output>): void

  /**
   * 
   */
  off(event: UnidocProducerEvent.NEXT, listener: UnidocProducerListener.Next<Output>): void

  /**
   * 
   */
  off(event: UnidocProducerEvent.SUCCESS, listener: UnidocProducerListener.Success): void

  /**
   * 
   */
  off(event: UnidocProducerEvent.START, listener: UnidocProducerListener.Start): void

  /**
   * 
   */
  off(event: UnidocProducerEvent.FAILURE, listener: UnidocProducerListener.Failure): void

  /**
   * 
   */
  off(event: UnidocProducerEvent, listener: UnidocProducerListener<Output>): void

  /**
   * 
   */
  off(event: UnidocProducerEvent): void

  /**
   * 
   */
  off(): void
}

/**
 * 
 */
export namespace UnidocProducer {

}