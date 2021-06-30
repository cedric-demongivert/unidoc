import { UnidocFunction } from '../../stream/UnidocFunction'

import { UnidocObject } from '../../UnidocObject'

import { UnidocReductionInput } from './UnidocReductionInput'

import { UnidocReducer } from './UnidocReducer'

export class UnidocReductionExecutor<Result> extends UnidocFunction<UnidocReductionInput, Result> {
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
  public constructor(reducerFactory: UnidocReducer.Factory<Result>) {
    super()

    this.reducerFactory = reducerFactory
    this._reducer = undefined
  }

  /**
  * @see UnidocConsumer.handleInitialization
  */
  public start(): void {
    this._reducer = this.reducerFactory()
    this.output.start()
  }

  /**
  * @see UnidocConsumer.handleProduction
  */
  public next(event: UnidocReductionInput): void {
    if (this._reducer) {
      const result: UnidocReducer.Result<Result> = UnidocReducer.feed(this._reducer, event)

      if (result.done) {
        this.output.next(result.value)
        this._reducer = undefined
      }
    }
  }

  /**
  * @see UnidocConsumer.handleCompletion
  */
  public success(): void {
    if (this._reducer) {
      this.output.next(UnidocReducer.finish(this._reducer))
      this._reducer = undefined
    }

    this.output.success()
  }

  /**
  * @see UnidocConsumer.handleFailure
  */
  public failure(error: Error): void {
    this.output.fail(error)
  }
}
