import { UnidocProducer } from '../../producer/UnidocProducer'
import { UnidocValidationEvent } from '../../validation/UnidocValidationEvent'

import { UnidocValidationReducer } from './UnidocValidationReducer'
import { UnidocValidationReductionExecutor } from './UnidocValidationReductionExecutor'

/**
* Transform a producer of tokens into a producer of document events.
*
* @param input - A producer of tokens.
*
* @return A producer of document events.
*/
export function reduce<Result>(input: UnidocProducer<UnidocValidationEvent>, reducer: UnidocValidationReducer<any, Result>): UnidocProducer<Result> {
  const executor: UnidocValidationReductionExecutor<Result> = new UnidocValidationReductionExecutor(reducer)

  executor.subscribe(input)

  return executor
}
