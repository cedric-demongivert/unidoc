import { UnidocValidationEvent } from '../../validation/UnidocValidationEvent'

import { UnidocObjectReducerConfiguration } from './UnidocObjectReducerConfiguration'

export class UnidocObjectReducerState {
  /**
  *
  */
  public state: any

  /**
  *
  */
  public readonly configuration: UnidocObjectReducerConfiguration

  /**
  *
  */
  public constructor(configuration: UnidocObjectReducerConfiguration) {
    this.configuration = configuration
    this.state = {}
  }

  /**
  *
  */
  public initialize(): UnidocObjectReducerState {
    const state: any = this.state
    const configuration: UnidocObjectReducerConfiguration = this.configuration

    for (const key of Object.keys(configuration)) {
      state[key] = configuration[key].initialize(state[key])
    }

    return this
  }

  /**
  *
  */
  public reduce(event: UnidocValidationEvent): UnidocObjectReducerState {
    const state: any = this.state
    const configuration: UnidocObjectReducerConfiguration = this.configuration

    for (const key of Object.keys(configuration)) {
      state[key] = configuration[key].reduce(state[key], event)
    }

    return this
  }

  /**
  *
  */
  public complete(): any {
    const result: any = {}
    const state: any = this.state
    const configuration: UnidocObjectReducerConfiguration = this.configuration

    for (const key of Object.keys(configuration)) {
      result[key] = configuration[key].complete(state[key])
    }

    return result
  }

  /**
  *
  */
  public clear(): UnidocObjectReducerState {
    return this
  }
}
