import { UnidocConsumer } from './UnidocConsumer'

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