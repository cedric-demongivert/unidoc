import { UnidocProducer } from '../../producer/UnidocProducer'
import { UnidocValidationEvent } from '../../validation/UnidocValidationEvent'

import { UnidocReducer } from './UnidocReducer'
import { UnidocReductionInput } from './UnidocReductionInput'
import { UnidocReductionExecutor } from './UnidocReductionExecutor'
import { UnidocValidationToReductionTranslator } from './UnidocValidationToReductionTranslator'

/**
* Transform a producer of tokens into a producer of document events.
*
* @param input - A producer of tokens.
*
* @return A producer of document events.
*/
export function reduce<Result>(input: UnidocProducer<UnidocReductionInput>, reducer: UnidocReducer.Factory<Result>): UnidocProducer<Result | undefined> {
  const executor: UnidocReductionExecutor<Result> = new UnidocReductionExecutor(reducer)

  executor.subscribe(input)

  return executor
}

/**
*
*/
export namespace reduce {
  /**
  *
  */
  export function validation<Result>(input: UnidocProducer<UnidocValidationEvent>, reducer: UnidocReducer.Factory<Result>): UnidocProducer<Result | undefined> {
    const executor: UnidocReductionExecutor<Result> = new UnidocReductionExecutor(reducer)
    const translator: UnidocValidationToReductionTranslator = new UnidocValidationToReductionTranslator()

    translator.subscribe(input)
    executor.subscribe(translator)

    return executor
  }

  /**
  *
  */
  export function iterator<Result>(input: Iterator<UnidocReductionInput>, reducer: UnidocReducer<Result>): Result | undefined {
    let next: IteratorResult<UnidocReductionInput> = input.next()

    while (!next.done) {
      const result: UnidocReducer.Result<Result> = UnidocReducer.feed(reducer, next.value)

      if (result.done) {
        return result.value
      } else {
        next = input.next()
      }
    }

    return UnidocReducer.finish(reducer)
  }
}
