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
  unsubscribe(): void

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

  /**
   * 
   */
  export function feed<Product>(values: Iterator<Product, void, void>, consumer: UnidocConsumer<Product>): void {
    consumer.start()

    let iteratorResult: IteratorResult<Product>

    try {
      iteratorResult = values.next()
    } catch (error) {
      if (error instanceof Error) {
        consumer.failure(error)
      } else {
        consumer.failure(new Error('Generator failed with a non-error message : ' + error + '.'))
      }
      return
    }

    while (!iteratorResult.done) {
      consumer.next(iteratorResult.value)

      try {
        iteratorResult = values.next()
      } catch (error) {
        if (error instanceof Error) {
          consumer.failure(error)
        } else {
          consumer.failure(new Error('Generator failed with a non-error message : ' + error + '.'))
        }
        return
      }
    }

    consumer.success()
  }

  /**
   * 
   */
  export namespace feed {
    /**
     * 
     */
    export function online<Product>(values: Iterator<Product, void, void>, consumer: UnidocConsumer<Product>): void {
      consumer.start()

      let iteratorResult: IteratorResult<Product>

      try {
        iteratorResult = values.next()
      } catch (error) {
        if (error instanceof Error) {
          consumer.failure(error)
        } else {
          consumer.failure(new Error('Generator failed with a non-error message : ' + error + '.'))
        }
        return
      }

      while (!iteratorResult.done) {
        consumer.next(iteratorResult.value)

        try {
          iteratorResult = values.next()
        } catch (error) {
          if (error instanceof Error) {
            consumer.failure(error)
          } else {
            consumer.failure(new Error('Generator failed with a non-error message : ' + error + '.'))
          }
          return
        }
      }
    }
  }
}
