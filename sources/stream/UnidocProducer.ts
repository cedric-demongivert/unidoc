import { UnidocConsumer } from './UnidocConsumer'

/**
 * 
 */
export interface UnidocProducer<Product> {
  /**
   * 
   */
  on(event: UnidocProducer.NEXT, listener: UnidocConsumer.Next<Product>): void

  /**
   * 
   */
  on(event: UnidocProducer.SUCCESS, listener: UnidocConsumer.Success): void

  /**
   * 
   */
  on(event: UnidocProducer.START, listener: UnidocConsumer.Start): void

  /**
   * 
   */
  on(event: UnidocProducer.FAILURE, listener: UnidocConsumer.Failure): void

  /**
   * 
   */
  on(event: UnidocProducer.Event, listener: UnidocConsumer.Listener<Product>): void

  /**
   * 
   */
  off(event: UnidocProducer.NEXT, listener: UnidocConsumer.Next<Product>): void

  /**
   * 
   */
  off(event: UnidocProducer.SUCCESS, listener: UnidocConsumer.Success): void

  /**
   * 
   */
  off(event: UnidocProducer.START, listener: UnidocConsumer.Start): void

  /**
   * 
   */
  off(event: UnidocProducer.FAILURE, listener: UnidocConsumer.Failure): void

  /**
   * 
   */
  off(event: UnidocProducer.Event, listener: UnidocConsumer.Listener<Product>): void

  /**
   * 
   */
  off(event: UnidocProducer.Event): void

  /**
   * 
   */
  off(): void
}

/**
 * 
 */
export namespace UnidocProducer {
  /**
   * 
   */
  export type Event = START | NEXT | SUCCESS | FAILURE

  /**
   * Event triggered just before the production of the first element.
   */
  export type START = 'start'

  /**
   * @see START
   */
  export const START: START = 'start'

  /**
   * Event triggered after the production of an element.
   */
  export type NEXT = 'next'

  /**
   * @see NEXT
   */
  export const NEXT: NEXT = 'next'

  /**
   * Event triggered after the production of the last element.
   */
  export type SUCCESS = 'success'

  /**
   * @see SUCCESS
   */
  export const SUCCESS: SUCCESS = 'success'

  /**
   * Event triggered when an error arise during the production process.
   */
  export type FAILURE = 'failure'

  /**
   * @see FAILURE
   */
  export const FAILURE: FAILURE = 'failure'

  /**
   * 
   */
  export const ALL: Event[] = [
    START,
    NEXT,
    SUCCESS,
    FAILURE
  ]
}