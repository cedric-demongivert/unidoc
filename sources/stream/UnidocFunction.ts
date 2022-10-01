import { Clonable } from "@cedric-demongivert/gl-tool-utils"
import { UnidocBufferizer } from "./UnidocBufferizer"
import { UnidocConsumer } from "./UnidocConsumer"
import { UnidocDuplicator } from "./UnidocDuplicator"
import { UnidocElement } from "./UnidocElement"
import { UnidocElementType } from "./UnidocElementType"
import { UnidocProducer } from "./UnidocProducer"

/**
 * 
 */
export interface UnidocFunction<Input, Output = Input> extends UnidocConsumer<Input>, UnidocProducer<Output> {

}

/**
 * 
 */
export namespace UnidocFunction {
  /**
   * 
   */
  export type Chain<Input, Output> = (
    [UnidocFunction<Input, Output>] |
    [UnidocFunction<Input, unknown>, ...Array<UnidocFunction<unknown, unknown>>, UnidocFunction<unknown, Output>]
  )

  /**
   * 
   */
  function* dump<Output>(output: Array<UnidocElement<Output>>): IterableIterator<Output> {
    for (const element of output) {
      switch (element.type) {
        case UnidocElementType.START:
          break
        case UnidocElementType.NEXT:
          yield element.value as Output
          break
        case UnidocElementType.FAILURE:
          throw element.value
        case UnidocElementType.SUCCESS:
          return true
        default:
          throw new Error()
      }
    }

    output.length = 0
    return false
  }

  /**
   * 
   */
  function* exec<Input, Output = Input>(input: Iterator<Input>, target: UnidocFunction<Input, Output>, output: Array<UnidocElement<Output>>): IterableIterator<Output> {
    target.start()

    if (yield* dump(output)) return

    let iteration: IteratorResult<Input> = input.next()

    while (!iteration.done) {
      target.next(iteration.value)

      if (yield* dump(output)) return

      iteration = input.next()
    }

    target.success()

    if (yield* dump(output)) return
  }


  /**
   * 
   */
  export function iterate<Input, Output = Input>(input: Iterator<Input>, target: UnidocFunction<Input, Output>): IterableIterator<Output> {
    return exec(input, target, UnidocBufferizer.bufferize(target))
  }

  /**
   * 
   */
  export function iterateClonable<Input, Output extends Clonable<Output>>(input: Iterator<Input>, target: UnidocFunction<Input, Output>): IterableIterator<Output> {
    return exec(input, target, UnidocDuplicator.duplicate(target))
  }
}