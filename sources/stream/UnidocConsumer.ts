import { UnidocProducer } from './UnidocProducer'

/**
 * 
 */
export interface UnidocConsumer<Input> {
  /**
   * 
   */
  subscribe(producer: UnidocProducer<Input>): void

  /**
   * 
   */
  unsubscribe(producer: UnidocProducer<Input>): void

  /**
   * 
   */
  start(): void

  /**
   * 
   */
  next(value: Input): void

  /**
   * 
   */
  success(): void

  /**
   * 
   */
  failure(error: Error): void
}
