import { UnidocValidationEvent } from '../../validation/UnidocValidationEvent'

import { UnidocValidationReducer } from './UnidocValidationReducer'

export class UnidocManyGroupReducerState<State, Result> {
  /**
  *
  */
  public state: State | undefined

  /**
  *
  */
  public depth: number

  /**
  *
  */
  public result: Result[]

  /**
  *
  */
  public constructor() {
    this.state = undefined
    this.result = []
    this.depth = 0
  }

  /**
  *
  */
  public initialize(reducer: UnidocValidationReducer<State, Result>, event: UnidocValidationEvent): UnidocManyGroupReducerState<State, Result> {
    this.state = reducer.reduce(reducer.initialize(this.state), event)
    this.result = []
    this.depth += 1
    return this
  }

  /**
  *
  */
  public enter(reducer: UnidocValidationReducer<State, Result>, event: UnidocValidationEvent): UnidocManyGroupReducerState<State, Result> {
    this.state = reducer.reduce(this.state!, event)
    this.depth += 1
    return this
  }

  /**
  *
  */
  public next(reducer: UnidocValidationReducer<State, Result>, event: UnidocValidationEvent): UnidocManyGroupReducerState<State, Result> {
    this.state = reducer.reduce(this.state!, event)
    return this
  }

  /**
  *
  */
  public exit(reducer: UnidocValidationReducer<State, Result>, event: UnidocValidationEvent): UnidocManyGroupReducerState<State, Result> {
    this.depth -= 1
    this.state = reducer.reduce(this.state!, event)

    if (this.depth === 0) {
      this.result.push(reducer.complete(this.state))
    }

    return this
  }

  /**
  *
  */
  public complete(reducer: UnidocValidationReducer<State, Result>): Result[] {
    if (this.depth > 0) {
      this.result.push(reducer.complete(this.state!))
    }

    return this.result
  }

  /**
  *
  */
  public clear(): UnidocManyGroupReducerState<State, Result> {
    this.depth = 0
    this.result = []
    return this
  }
}
