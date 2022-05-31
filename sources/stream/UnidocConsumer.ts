import { UnidocProducer } from './UnidocProducer'

/**
 * 
 */
export interface UnidocConsumer<Product> {
  /**
   * 
   */
  subscribe(producer: UnidocProducer<Product>): void

  /**
   * 
   */
  unsubscribe(producer: UnidocProducer<Product>): void

  /**
   * 
   */
  start(): void

  /**
   * 
   */
  next(value: Readonly<Product>): void

  /**
   * 
   */
  success(): void

  /**
   * 
   */
  failure(error: Error): void
}

/**
 * 
 */
export namespace UnidocConsumer {
  /**
   * 
   */
  export type Listener<Product> = Next<Product> | Start | Success | Failure

  /**
   * 
   */
  export type Next<Product> = (value: Readonly<Product>) => void

  /**
   * 
   */
  export type Start = () => void

  /**
   * 
   */
  export type Success = () => void

  /**
   * 
   */
  export type Failure = (error: Error) => void
}
