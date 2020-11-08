import { UnidocEvent } from '../../../event/UnidocEvent'

import { SubscribableUnidocConsumer } from '../../../consumer/SubscribableUnidocConsumer'
import { StaticUnidocProducer } from '../../../producer/StaticUnidocProducer'
import { UnidocProducerEvent } from '../../../producer/UnidocProducerEvent'

import { EventStreamReducer } from '../reducer/EventStreamReducer'

import { NativeCompiler } from './NativeCompiler'

export class ReducerCompiler<T> extends SubscribableUnidocConsumer<UnidocEvent> implements NativeCompiler<T> {
  private readonly _reducer: EventStreamReducer<any, T>
  private readonly _state: any
  private readonly _producer: StaticUnidocProducer<T>

  public constructor(reducer: EventStreamReducer<any, T>) {
    super()
    this._reducer = reducer
    this._state = this._reducer.start()
    this._producer = new StaticUnidocProducer()
  }

  /**
  * @see UnidocConsumer.handleInitialization
  */
  public handleInitialization(): void {
    this._reducer.restart(this._state)
  }

  /**
  * @see UnidocConsumer.handleProduction
  */
  public handleProduction(value: UnidocEvent): void {
    this._reducer.reduce(this._state, value)
  }

  /**
  * @see UnidocConsumer.handleCompletion
  */
  public handleCompletion(): void {
    this._producer.initialize()
    this._producer.produce(this._reducer.complete(this._state))
    this._producer.complete()
  }

  /**
  * @see UnidocConsumer.handleFailure
  */
  public handleFailure(error: Error): void {
    console.error(error)
  }

  /**
  * Update the state of this compiler toke make it as if the compiler was just
  * instantiated.
  */
  public clear(): void {
    this._reducer.restart(this._state)
  }

  /**
  * @see UnidocProducer.addEventListener
  */
  public addEventListener(event: UnidocProducerEvent, listener: any): void {
    this._producer.addEventListener(event, listener)
  }

  /**
  * @see UnidocProducer.removeEventListener
  */
  public removeEventListener(event: UnidocProducerEvent, listener: any): void {
    this._producer.removeEventListener(event, listener)
  }

  /**
  * @see UnidocProducer.removeAllEventListener
  */
  public removeAllEventListener(...parameters: [any?]): void {
    this._producer.removeAllEventListener(...parameters)
  }
}

export namespace ReducerCompiler {
}
