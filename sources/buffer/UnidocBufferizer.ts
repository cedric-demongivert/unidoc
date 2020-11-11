import { Pack } from '@cedric-demongivert/gl-tool-collection'

import { SubscribableUnidocConsumer } from '../consumer/SubscribableUnidocConsumer'

export class UnidocBufferizer<T> extends SubscribableUnidocConsumer<T> {
  public buffer: Pack<T>

  public constructor(buffer: Pack<T>) {
    super()
    this.buffer = buffer
  }

  /**
  * @see UnidocConsumer.handleInitialization
  */
  public handleInitialization(): void {
    this.buffer.clear()
  }

  /**
  * @see UnidocConsumer.handleProduction
  */
  public handleProduction(value: T): void {
    this.buffer.push(value)
  }

  /**
  * @see UnidocConsumer.handleCompletion
  */
  public handleCompletion(): void {
    this.buffer.fit()
  }

  /**
  * @see UnidocConsumer.handleFailure
  */
  public handleFailure(error: Error): void {
    console.error(error)
  }
}

export namespace UnidocBufferizer {

}
