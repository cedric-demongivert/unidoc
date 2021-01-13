import { UnidocValidationEvent } from '../../validation/UnidocValidationEvent'

import { UnidocManyGroupReducer } from './UnidocManyGroupReducer'
import { UnidocObjectReducer } from './UnidocObjectReducer'
import { UnidocObjectReducerConfiguration } from './UnidocObjectReducerConfiguration'
import { UnidocSingleGroupReducer } from './UnidocSingleGroupReducer'
import { UnidocValidationTextReducer } from './UnidocValidationTextReducer'
import { UnidocValidationTokenReducer } from './UnidocValidationTokenReducer'
import { UnidocMappedReducer } from './UnidocMappedReducer'

export interface UnidocValidationReducer<State, Result> {
  /**
  *
  */
  initialize(state?: State): State

  /**
  *
  */
  reduce(state: State, event: UnidocValidationEvent): State

  /**
  *
  */
  complete(state: State): Result
}

/**
*
*/
export namespace UnidocValidationReducer {
  /**
  *
  */
  const TEXT: UnidocValidationTextReducer = new UnidocValidationTextReducer()

  /**
  *
  */
  const TOKEN: UnidocValidationTokenReducer = new UnidocValidationTokenReducer()

  /**
  *
  */
  export function text(): UnidocValidationReducer<any, string> {
    return TEXT
  }

  /**
  *
  */
  export function token(): UnidocValidationReducer<any, string> {
    return TOKEN
  }

  /**
  *
  */
  export function group<Result>(group: any, reducer: UnidocValidationReducer<any, Result>): UnidocValidationReducer<any, Result> {
    return new UnidocSingleGroupReducer(group, reducer)
  }

  /**
  *
  */
  export namespace group {
    /**
    *
    */
    export function many<Result>(group: any, reducer: UnidocValidationReducer<any, Result>): UnidocValidationReducer<any, Result[]> {
      return new UnidocManyGroupReducer(group, reducer)
    }
  }

  /**
  *
  */
  export function object<Result>(configuration: UnidocObjectReducerConfiguration): UnidocValidationReducer<any, Result> {
    return new UnidocObjectReducer(configuration)
  }

  /**
  *
  */
  export function map<From, To>(reducer: UnidocValidationReducer<any, From>, mapper: (value: From) => To): UnidocValidationReducer<any, To> {
    return new UnidocMappedReducer(reducer, mapper)
  }
}
