
import { UnidocEvent } from '../event'
import { UnidocElement } from '../stream'

/**
 *
 */
export type UnidocReduction<Product> = (
  Generator<UnidocReduction.REQUEST, Product, UnidocReduction.Input>
)

/**
 *
 */
export namespace UnidocReduction {
  /**
   * 
   */
  export type CURRENT = true

  /**
   * 
   */
  export const CURRENT: CURRENT = true

  /**
   * 
   */
  export type NEXT = false

  /**
   * 
   */
  export const NEXT: NEXT = false

  /**
   * 
   */
  export type REQUEST = CURRENT | NEXT

  /**
   * 
   */
  export type Result<Product> = IteratorResult<REQUEST, Product>

  /**
   * 
   */
  export type Input = Readonly<UnidocElement<Readonly<UnidocEvent>>>

  /**
   *
   */
  export function push<Product>(value: Input, reduction: UnidocReduction<Product>): Result<Product> {
    let result: Result<Product> = reduction.next(value)

    while (!result.done && result.value) {
      result = reduction.next(value)
    }

    return result
  }

  /**
   *
   */
  export function feed<Product>(producer: Iterable<Readonly<UnidocEvent>>, reduction: UnidocReduction<Product>): Product {
    const element: UnidocElement = UnidocElement.DUPLICATOR.allocate()
    let result: Result<Product> = push(UnidocElement.start(), reduction)

    for (const input of producer) {
      if (!result.done) {
        result = push(element.asNext(input), reduction)
      }
    }

    UnidocElement.DUPLICATOR.free(element)
    if (!result.done) {
      result = push(UnidocElement.success(), reduction)
    }


    if (!result.done) {
      throw new Error(
        `Unable to finalize the reduction process because the underlying process as not finished yet, ` +
        `please look at your reducer logic, all reducers must stop after the reception of a success event.`
      )
    }

    return result.value
  }

  /**
   *
   */
  export function stop<Product>(producer: Iterable<Readonly<UnidocEvent>>, reduction: UnidocReduction<Product>): Readonly<Input> {
    const element: UnidocElement = UnidocElement.DUPLICATOR.allocate()

    let result: Result<Product> = push(UnidocElement.start(), reduction)

    if (result.done) {
      UnidocElement.DUPLICATOR.free(element)
      return UnidocElement.start()
    }

    for (const input of producer) {
      if (!result.done) {
        result = push(element.asNext(input), reduction)
      }

      if (result.done) {
        return element
      }
    }

    UnidocElement.DUPLICATOR.free(element)

    if (!result.done) {
      result = push(UnidocElement.success(), reduction)
    }


    if (!result.done) {
      throw new Error(
        `Unable to finalize the reduction process because the underlying process as not finished yet, ` +
        `please look at your reducer logic, all reducers must stop after the reception of a success event.`
      )
    }

    return UnidocElement.success()
  }
}
