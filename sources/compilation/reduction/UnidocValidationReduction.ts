import { UnidocBlueprint } from '../../blueprint/UnidocBlueprint'

import { UnidocValidationReducer } from './UnidocValidationReducer'

import { UnidocManyBlueprintReducer } from './UnidocManyBlueprintReducer'
import { UnidocObjectReducer } from './UnidocObjectReducer'
import { UnidocObjectReducerConfiguration } from './UnidocObjectReducerConfiguration'
import { UnidocSingleBlueprintReducer } from './UnidocSingleBlueprintReducer'
import { UnidocValidationTextReducer } from './UnidocValidationTextReducer'
import { UnidocValidationTokenReducer } from './UnidocValidationTokenReducer'


export namespace UnidocValidationReduction {
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
  export function blueprint<Result>(blueprint: UnidocBlueprint, reducer: UnidocValidationReducer<any, Result>): UnidocValidationReducer<any, Result> {
    return new UnidocSingleBlueprintReducer(blueprint, reducer)
  }

  /**
  *
  */
  export namespace blueprint {
    /**
    *
    */
    export function many<Result>(blueprint: UnidocBlueprint, reducer: UnidocValidationReducer<any, Result>): UnidocValidationReducer<any, Result[]> {
      return new UnidocManyBlueprintReducer(blueprint, reducer)
    }
  }

  /**
  *
  */
  export function object<Result>(configuration: UnidocObjectReducerConfiguration): UnidocValidationReducer<any, Result> {
    return new UnidocObjectReducer(configuration)
  }
}
