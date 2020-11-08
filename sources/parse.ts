import { Observable } from 'rxjs'
import { OperatorFunction } from 'rxjs'

import { UnidocParser } from './parser/UnidocParser'
import { UnidocEvent } from './event/UnidocEvent'
import { UnidocToken } from './token/UnidocToken'
import { RxJSUnidocInput } from './producer/RxJSUnidocInput'
import { RxJSUnidocOutput } from './consumer/RxJSUnidocOutput'

/**
* Transform a stream of symbols to a stream of tokens.
*
* @return An operator that transform a stream of symbols to a stream of tokens.
*/
export function parse(): OperatorFunction<UnidocToken, UnidocEvent> {
  return function(input: Observable<UnidocToken>): Observable<UnidocEvent> {
    const parser: UnidocParser = new UnidocParser()
    parser.subscribe(new RxJSUnidocInput(input))

    const rxOutput: RxJSUnidocOutput<UnidocEvent> = new RxJSUnidocOutput()
    rxOutput.subscribe(parser)

    return rxOutput.observable
  }
}
