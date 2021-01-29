import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocValidationEvent } from '../validation/UnidocValidationEvent'

import { UnidocProducer } from '../producer/UnidocProducer'
import { UnidocConsumer } from '../consumer/UnidocConsumer'

import { UnidocKissValidator } from './kiss/UnidocKissValidator'
import { UnidocKissValidatorResolver } from './kiss/UnidocKissValidatorResolver'

import { UnidocNFAValidationGraph } from './nfa/UnidocNFAValidationGraph'
import { UnidocNFAValidationGraphResolver } from './nfa/UnidocNFAValidationGraphResolver'

/**
*
*/
export interface UnidocValidator extends UnidocProducer<UnidocValidationEvent>, UnidocConsumer<UnidocEvent> { }

/**
*
*/
export namespace UnidocValidator {
  /**
  *
  */
  export function kiss(validator: UnidocKissValidator.Factory): UnidocValidator {
    return new UnidocKissValidatorResolver(validator)
  }

  /**
  *
  */
  export function graph(graph: UnidocNFAValidationGraph): UnidocValidator {
    const resolver: UnidocNFAValidationGraphResolver = new UnidocNFAValidationGraphResolver()
    resolver.validate(graph)
    return resolver
  }
}
