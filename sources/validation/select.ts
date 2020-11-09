import { Observable } from 'rxjs'
import { OperatorFunction } from 'rxjs'

import { RxJSUnidocInput } from '../producer/RxJSUnidocInput'
import { RxJSUnidocOutput } from '../consumer/RxJSUnidocOutput'

import { UnidocValidationSelector } from './UnidocValidationSelector'
import { UnidocValidationEvent } from './UnidocValidationEvent'

/**
* Transform a stream of symbols to a stream of tokens.
*
* @return An operator that transform a stream of symbols to a stream of tokens.
*/
export function select(selector: UnidocValidationSelector): OperatorFunction<UnidocValidationEvent, UnidocValidationEvent> {
  return function(input: Observable<UnidocValidationEvent>): Observable<UnidocValidationEvent> {
    selector.subscribe(new RxJSUnidocInput(input))

    const rxOutput: RxJSUnidocOutput<UnidocValidationEvent> = new RxJSUnidocOutput()
    rxOutput.subscribe(selector)

    return rxOutput.observable
  }
}
