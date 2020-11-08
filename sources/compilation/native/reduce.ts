import { OperatorFunction } from 'rxjs'

import { UnidocEvent } from '../../event/UnidocEvent'

import { ReducerCompiler } from './compilation/ReducerCompiler'
import { EventStreamReducer } from './reducer/EventStreamReducer'

import { compile } from './compile'

/**
* Transform a stream of symbols to a stream of tokens.
*
* @return An operator that transform a stream of symbols to a stream of tokens.
*/
export function reduce<T>(reducer: EventStreamReducer<any, T>): OperatorFunction<UnidocEvent, T> {
  return compile(new ReducerCompiler<T>(reducer))
}
