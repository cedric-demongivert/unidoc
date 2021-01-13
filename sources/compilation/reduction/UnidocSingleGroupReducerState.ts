import { UnidocValidationEvent } from '../../validation/UnidocValidationEvent'

import { UnidocSingleGroupReducingStep } from './UnidocSingleGroupReducingStep'
import { UnidocValidationReducer } from './UnidocValidationReducer'

export class UnidocSingleGroupReducerState<State, Result> {
  /**
  *
  */
  public state: State | undefined

  /**
  *
  */
  public step: UnidocSingleGroupReducingStep

  /**
  *
  */
  public depth: number

  /**
  *
  */
  public constructor() {
    this.state = undefined
    this.step = UnidocSingleGroupReducingStep.DEFAULT
    this.depth = 0
  }

  /**
  *
  */
  public initialize(reducer: UnidocValidationReducer<State, Result>, event: UnidocValidationEvent): UnidocSingleGroupReducerState<State, Result> {
    this.state = reducer.reduce(reducer.initialize(this.state), event)
    this.step = UnidocSingleGroupReducingStep.CONTENT
    this.depth += 1
    return this
  }

  /**
  *
  */
  public enter(reducer: UnidocValidationReducer<State, Result>, event: UnidocValidationEvent): UnidocSingleGroupReducerState<State, Result> {
    this.state = reducer.reduce(this.state!, event)
    this.depth += 1
    return this
  }

  /**
  *
  */
  public next(reducer: UnidocValidationReducer<State, Result>, event: UnidocValidationEvent): UnidocSingleGroupReducerState<State, Result> {
    this.state = reducer.reduce(this.state!, event)
    return this
  }

  /**
  *
  */
  public exit(reducer: UnidocValidationReducer<State, Result>, event: UnidocValidationEvent): UnidocSingleGroupReducerState<State, Result> {
    this.depth -= 1
    this.state = reducer.reduce(this.state!, event)

    if (this.depth === 0) {
      this.step = UnidocSingleGroupReducingStep.TRAILING
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
  public clear(): UnidocSingleGroupReducerState<State, Result> {
    this.step = UnidocSingleGroupReducingStep.DEFAULT
    this.depth = 0
    return this
  }
}
