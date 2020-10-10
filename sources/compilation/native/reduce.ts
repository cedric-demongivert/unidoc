import { Observable } from 'rxjs'

import { UnidocEvent } from '../../event/UnidocEvent'

import { ReducerCompiler } from './compilation/ReducerCompiler'
import { EventStreamReducer } from './reducer/EventStreamReducer'

import { compile } from './compile'

type Operator<In, Out> = (source : Observable<In>) => Observable<Out>

/**
* Transform a stream of symbols to a stream of tokens.
*
* @return An operator that transform a stream of symbols to a stream of tokens.
*/
export function reduce <T> (reducer : EventStreamReducer<any, T>) : Operator<UnidocEvent, T> {
  return compile(new ReducerCompiler(reducer))
}
