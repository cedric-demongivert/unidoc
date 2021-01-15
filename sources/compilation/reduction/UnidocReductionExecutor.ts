import { SubscribableUnidocConsumer } from '../../consumer/SubscribableUnidocConsumer'
import { UnidocProducer } from '../../producer/UnidocProducer'
import { StaticUnidocProducer } from '../../producer/StaticUnidocProducer'

import { UnidocReductionInput } from './UnidocReductionInput'

import { UnidocReducer } from './UnidocReducer'

export class UnidocReductionExecutor<Result> extends SubscribableUnidocConsumer<UnidocReductionInput> implements UnidocProducer<Result | undefined> {
  /**
  *
  */
  public readonly reducerFactory: UnidocReducer.Factory<Result>

  /**
  *
  */
  private _reducer: UnidocReducer<Result> | undefined

  /**
  *
  */
  private _output: StaticUnidocProducer<Result | undefined>

  /**
  *
  */
  public constructor(reducerFactory: UnidocReducer.Factory<Result>) {
    super()

    this.reducerFactory = reducerFactory
    this._reducer = undefined
    this._output = new StaticUnidocProducer()
  }

  /**
  * @see UnidocConsumer.handleInitialization
  */
  public handleInitialization(): void {
    this._reducer = this.reducerFactory()
    this._output.initialize()
  }

  /**
  * @see UnidocConsumer.handleProduction
  */
  public handleProduction(event: UnidocReductionInput): void {
    if (this._reducer) {
      const result: UnidocReducer.Result<Result> = UnidocReducer.feed(this._reducer, event)

      if (result.done) {
        this._output.produce(result.value)
        this._reducer = undefined
      }
    }
  }

  /**
  * @see UnidocConsumer.handleCompletion
  */
  public handleCompletion(): void {
    if (this._reducer) {
      this._output.produce(UnidocReducer.finish(this._reducer))
      this._reducer = undefined
    }

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
