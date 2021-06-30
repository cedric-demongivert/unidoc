import { Pack } from '@cedric-demongivert/gl-tool-collection'

import { UnidocListener } from '../stream/UnidocListener'

/**
 * 
 */
export class UnidocBufferizer<Input> extends UnidocListener<Input> {
  /**
   * 
   */
  public buffer: Pack<Input>

  /**
   * 
   */
  public constructor(buffer: Pack<Input>) {
    super()
    this.buffer = buffer
  }

  /**
   * @see UnidocConsumer.handleInitialization
   */
  public start(): void {
    this.buffer.clear()
  }

  /**
   * @see UnidocConsumer.handleProduction
   */
  public next(value: Input): void {
    this.buffer.push(value)
  }

  /**
   * @see UnidocConsumer.handleCompletion
   */
  public success(): void {
    this.buffer.fit()
  }

  /**
   * @see UnidocConsumer.handleFailure
   */
  public failure(error: Error): void {
    console.error(error)
  }
}
