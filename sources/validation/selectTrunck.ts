import { OperatorFunction } from 'rxjs'

import { UnidocValidationEvent } from './UnidocValidationEvent'

import { select } from './select'
import { UnidocValidationTrunkSelector } from './UnidocValidationTrunkSelector'

/**
* Transform a stream of symbols to a stream of tokens.
*
* @return An operator that transform a stream of symbols to a stream of tokens.
*/
export function selectTrunck(): OperatorFunction<UnidocValidationEvent, UnidocValidationEvent> {
  return select(new UnidocValidationTrunkSelector())
}
