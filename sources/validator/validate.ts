import { Observable } from 'rxjs'
import { OperatorFunction } from 'rxjs'

import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocValidationEvent } from '../validation/UnidocValidationEvent'
import { RxJSUnidocInput } from '../producer/RxJSUnidocInput'
import { RxJSUnidocOutput } from '../consumer/RxJSUnidocOutput'

import { UnidocValidator } from './UnidocValidator'

/**
* Transform a stream of events to a stream of validation.
*
* @return An operator that transform a stream of events to a stream of validation.
*/
export function validate(validator: UnidocValidator): OperatorFunction<UnidocEvent, UnidocValidationEvent> {
  return function(input: Observable<UnidocEvent>): Observable<UnidocValidationEvent> {
    validator.subscribe(new RxJSUnidocInput(input))

    const rxOutput: RxJSUnidocOutput<UnidocValidationEvent> = new RxJSUnidocOutput()
    rxOutput.subscribe(validator)

    return rxOutput.observable
  }
}
