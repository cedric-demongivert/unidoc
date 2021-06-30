import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocValidationEvent } from '../validation/UnidocValidationEvent'

import { UnidocConsumer } from '../stream/UnidocConsumer'
import { UnidocProducer } from '../stream/UnidocProducer'

import { UnidocKissValidator } from './kiss/UnidocKissValidator'
import { UnidocKissValidatorResolver } from './kiss/UnidocKissValidatorResolver'

import { UnidocNFAValidationGraph } from './nfa/UnidocNFAValidationGraph'
import { UnidocNFAValidationGraphResolver } from './nfa/UnidocNFAValidationGraphResolver'

/**
*
*/
export interface UnidocValidator extends UnidocConsumer<UnidocEvent>, UnidocProducer<UnidocValidationEvent> { }

/**
*
*/
export namespace UnidocValidator {
  /**
   *  
   */
  export function validate(events: UnidocProducer<UnidocEvent>, validator: UnidocValidator): UnidocProducer<UnidocValidationEvent> {
    validator.subscribe(events)
    return validator
  }

  /**
  *
  */
  export function kiss(events: UnidocProducer<UnidocEvent>, validator: UnidocKissValidator.Factory): UnidocProducer<UnidocValidationEvent>
  /**
   * 
   */
  export function kiss(validator: UnidocKissValidator.Factory): UnidocValidator
  /**
   * 
   */
  export function kiss(...parameters: any[]): UnidocValidator {
    const validator: UnidocKissValidator.Factory = parameters.length === 1 ? parameters[0] : parameters[1]
    const events: UnidocProducer<UnidocEvent> | undefined = parameters.length === 1 ? undefined : parameters[0]

    const resolver: UnidocKissValidatorResolver = new UnidocKissValidatorResolver(validator)

    if (events != null) {
      resolver.subscribe(events)
    }

    return resolver
  }

  /**
  *
  */
  export function graph(events: UnidocProducer<UnidocEvent>, graph: UnidocNFAValidationGraph): UnidocProducer<UnidocValidationEvent>
  /**
  *
  */
  export function graph(graph: UnidocNFAValidationGraph): UnidocValidator
  /**
  *
  */
  export function graph(...parameters: any[]): UnidocValidator {
    const graph: UnidocNFAValidationGraph = parameters.length === 1 ? parameters[0] : parameters[1]
    const events: UnidocProducer<UnidocEvent> | undefined = parameters.length === 1 ? undefined : parameters[0]

    const resolver: UnidocNFAValidationGraphResolver = new UnidocNFAValidationGraphResolver()
    resolver.validate(graph)

    if (events != null) {
      resolver.subscribe(events)
    }

    return resolver
  }
}
