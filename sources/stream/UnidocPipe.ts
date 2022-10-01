import { UnidocConsumer } from "./UnidocConsumer"
import { UnidocFunction } from "./UnidocFunction"
import { UnidocProducer } from "./UnidocProducer"

/**
 * 
 */
export class UnidocPipe<Input, Output> implements UnidocFunction<Input, Output> {
  /**
   * 
   */
  private readonly _input: UnidocConsumer<Input>

  /**
   * 
   */
  private readonly _output: UnidocProducer<Output>

  /**
   * 
   */
  public constructor(elements: UnidocFunction.Chain<Input, Output>) {
    const functions: Array<any> = elements

    this._input = functions[0]
    this._output = functions[functions.length - 1]

    for (let index = 1; index < functions.length; ++index) {
      functions[index].subscribe(functions[index - 1])
    }
  }

  /**
   * @see UnidocConsumer.subscribe
   */
  public subscribe(producer: UnidocProducer<Input>): void {
    this._input.subscribe(producer)
  }

  /**
   * @see UnidocConsumer.unsubscribe
   */
  public unsubscribe(): void {
    this._input.unsubscribe()
  }

  /**
   * @see UnidocConsumer.start
   */
  public start(): void {
    this._input.start()
  }

  /**
   * @see UnidocConsumer.next
   */
  public next(value: Readonly<Input>): void {
    this._input.next(value)
  }

  /**
   * @see UnidocConsumer.success
   */
  public success(): void {
    this._input.success()
  }

  /**
   * @see UnidocConsumer.failure
   */
  public failure(error: Error): void {
    this._input.failure(error)
  }

  /**
   * @see UnidocProducer.on
   */
  public on(event: UnidocProducer.NEXT, listener: UnidocConsumer.Next<Output>): void
  public on(event: UnidocProducer.SUCCESS, listener: UnidocConsumer.Success): void
  public on(event: UnidocProducer.START, listener: UnidocConsumer.Start): void
  public on(event: UnidocProducer.FAILURE, listener: UnidocConsumer.Failure): void
  public on(event: UnidocProducer.Event, listener: UnidocConsumer.Listener<Output>): void
  public on(event: UnidocProducer.Event, listener: UnidocConsumer.Listener<Output>): void {
    this._output.on(event, listener)
  }

  /**
   * @see UnidocProducer.off
   */
  public off(event: UnidocProducer.NEXT, listener: UnidocConsumer.Next<Output>): void
  public off(event: UnidocProducer.SUCCESS, listener: UnidocConsumer.Success): void
  public off(event: UnidocProducer.START, listener: UnidocConsumer.Start): void
  public off(event: UnidocProducer.FAILURE, listener: UnidocConsumer.Failure): void
  public off(event: UnidocProducer.Event, listener: UnidocConsumer.Listener<Output>): void
  public off(event: UnidocProducer.Event): void
  public off(): void
  public off(event?: any, listener?: any): void {
    this._output.off(event, listener)
  }
}

/**
 * 
 */
export namespace UnidocPipe {
  /**
   * 
   */
  export function create<Input, Output>(elements: UnidocFunction.Chain<Input, Output>): UnidocPipe<Input, Output> {
    return new UnidocPipe(elements)
  }

  /**
   * 
   */
  export function of<Input, Output>(...elements: UnidocFunction.Chain<Input, Output>): UnidocPipe<Input, Output> {
    return new UnidocPipe(elements)
  }
}