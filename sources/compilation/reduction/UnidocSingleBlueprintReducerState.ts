import { UnidocValidationEvent } from '../../validation/UnidocValidationEvent'

import { UnidocSingleBlueprintReducingStep } from './UnidocSingleBlueprintReducingStep'
import { UnidocValidationReducer } from './UnidocValidationReducer'

export class UnidocSingleBlueprintReducerState<State, Result> {
  /**
  *
  */
  public state: State | undefined

  /**
  *
  */
  public step: UnidocSingleBlueprintReducingStep

  /**
  *
  */
  public depth: number

  /**
  *
  */
  public constructor() {
    this.state = undefined
    this.step = UnidocSingleBlueprintReducingStep.DEFAULT
    this.depth = 0
  }

  /**
  *
  */
  public initialize(reducer: UnidocValidationReducer<State, Result>, event: UnidocValidationEvent): UnidocSingleBlueprintReducerState<State, Result> {
    this.state = reducer.reduce(reducer.initialize(this.state), event)
    this.step = UnidocSingleBlueprintReducingStep.CONTENT
    this.depth += 1
    return this
  }

  /**
  *
  */
  public enter(reducer: UnidocValidationReducer<State, Result>, event: UnidocValidationEvent): UnidocSingleBlueprintReducerState<State, Result> {
    this.state = reducer.reduce(this.state!, event)
    this.depth += 1
    return this
  }

  /**
  *
  */
  public next(reducer: UnidocValidationReducer<State, Result>, event: UnidocValidationEvent): UnidocSingleBlueprintReducerState<State, Result> {
    this.state = reducer.reduce(this.state!, event)
    return this
  }

  /**
  *
  */
  public exit(reducer: UnidocValidationReducer<State, Result>, event: UnidocValidationEvent): UnidocSingleBlueprintReducerState<State, Result> {
    this.depth -= 1
    this.state = reducer.reduce(this.state!, event)

    if (this.depth === 0) {
      this.step = UnidocSingleBlueprintReducingStep.TRAILING
    }

    return this
  }

  /**
  *
  */
  public complete(reducer: UnidocValidationReducer<State, Result>): Result {
    return reducer.complete(this.state!)
  }

  /**
  *
  */
  public clear(): UnidocSingleBlueprintReducerState<State, Result> {
    this.step = UnidocSingleBlueprintReducingStep.DEFAULT
    this.depth = 0
    return this
  }
}
