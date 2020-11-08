import { Observable } from 'rxjs'
import { OperatorFunction } from 'rxjs'

import { RxJSUnidocOutput } from '../../consumer/RxJSUnidocOutput'
import { RxJSUnidocInput } from '../../producer/RxJSUnidocInput'

import { UnidocEvent } from '../../event/UnidocEvent'

import { NativeCompiler } from './compilation/NativeCompiler'

/**
* Transform a stream of symbols to a stream of tokens.
*
* @return An operator that transform a stream of symbols to a stream of tokens.
*/
export function compile<T>(compiler: NativeCompiler<T>): OperatorFunction<UnidocEvent, T> {
  return function(input: Observable<UnidocEvent>): Observable<T> {
    compiler.subscribe(new RxJSUnidocInput(input))

    const rxOutput: RxJSUnidocOutput<T> = new RxJSUnidocOutput()
    rxOutput.subscribe(compiler)

    return rxOutput.observable
  }
}
