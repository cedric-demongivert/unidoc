import { SubscribableUnidocConsumer } from '../../consumer/SubscribableUnidocConsumer'
import { UnidocProducer } from '../../producer/UnidocProducer'
import { StaticUnidocProducer } from '../../producer/StaticUnidocProducer'
import { UnidocValidationEvent } from '../../validation/UnidocValidationEvent'

import { UnidocValidationReducer } from './UnidocValidationReducer'

export class UnidocValidationReductionExecutor<Result> extends SubscribableUnidocConsumer<UnidocValidationEvent> implements UnidocProducer<Result> {
  /**
  *
  */
  public readonly reducer: UnidocValidationReducer<any, Result>

  /**
  *
  */
  private _state: any

  /**
  *
  */
  private _output: StaticUnidocProducer<Result>

  /**
  *
  */
  public constructor(reducer: UnidocValidationReducer<any, Result>) {
    super()

    this.reducer = reducer
    this._state = undefined
    this._output = new StaticUnidocProducer()
  }

  /**
  * @see UnidocConsumer.handleInitialization
  */
  public handleInitialization(): void {
    this._state = this.reducer.initialize(this._state)
    this._output.initialize()
  }

  /**
  * @see UnidocConsumer.handleProduction
  */
  public handleProduction(event: UnidocValidationEvent): void {
    this._state = this.reducer.reduce(this._state, event)
  }

  /**
  * @see UnidocConsumer.handleCompletion
  */
  public handleCompletion(): void {
    this._output.produce(this.reducer.complete(this._state))
    this._output.complete()
  }

  /**
  * @see UnidocConsumer.handleFailure
  */
  public handleFailure(error: Error): void {
    this._output.fail(error)
  }

  /**
  * @see UnidocProducer.addEventListener
  */
  public addEventListener(event: any, listener: any): void {
    this._output.addEventListener(event, listener)
  }

  /**
  * @see UnidocProducer.removeEventListener
  */
  public removeEventListener(event: any, listener: any): void {
    this._output.removeEventListener(event, listener)
  }

  /**
  * @see UnidocProducer.removeAllEventListener
  */
  public removeAllEventListener(...parameters: [any?]): void {
    this._output.removeAllEventListener(...parameters)
  }
}
