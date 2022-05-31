import { UnidocProducer } from "./UnidocProducer"
import { UnidocConsumer } from "./UnidocConsumer"

/**
 * 
 */
export class UnidocSink<Product> implements UnidocProducer<Product> {
  /**
   * 
   */
  private readonly _startListeners: Set<UnidocConsumer.Start>

  /**
   * 
   */
  private readonly _nextListeners: Set<UnidocConsumer.Next<Product>>

  /**
   * 
   */
  private readonly _successListeners: Set<UnidocConsumer.Success>

  /**
   * 
   */
  private readonly _failureListeners: Set<UnidocConsumer.Failure>

  /**
   * Instantiate a new sink.
   */
  public constructor() {
    this._startListeners = new Set()
    this._nextListeners = new Set()
    this._successListeners = new Set()
    this._failureListeners = new Set()
  }

  /**
   * Notify the begining of the production process.
   */
  public start(): void {
    for (const listener of this._startListeners) {
      listener()
    }
  }

  /**
   * Notify a failure of the production process.
   */
  public fail(error: Error): void {
    for (const listener of this._failureListeners) {
      listener(error)
    }
  }

  /**
   * Notify the production of an element.
   */
  public next(produce: Product): void {
    for (const listener of this._nextListeners) {
      listener(produce)
    }
  }

  /**
   * Notify the success of the production process.
   */
  public success(): void {
    for (const listener of this._successListeners) {
      listener()
    }
  }

  /**
   * @see UnidocProducer.prototype.on
   */
  public on(event: UnidocProducer.START, listener: UnidocConsumer.Start): void

  /**
   * @see UnidocProducer.prototype.on
   */
  public on(event: UnidocProducer.NEXT, listener: UnidocConsumer.Next<Product>): void

  /**
   * @see UnidocProducer.prototype.on
   */
  public on(event: UnidocProducer.SUCCESS, listener: UnidocConsumer.Success): void

  /**
   * @see UnidocProducer.prototype.on
   */
  public on(event: UnidocProducer.FAILURE, listener: UnidocConsumer.Failure): void

  /**
   * @see UnidocProducer.prototype.on
   */
  public on(event: UnidocProducer.FAILURE, listener: UnidocConsumer.Listener<Product>): void

  /**
   *
   */
  public on(event: UnidocProducer.Event, listener: UnidocConsumer.Listener<Product>): void {
    switch (event) {
      case UnidocProducer.SUCCESS:
        this._successListeners.add(listener as UnidocConsumer.Success)
        return
      case UnidocProducer.NEXT:
        this._nextListeners.add(listener as UnidocConsumer.Next<Product>)
        return
      case UnidocProducer.FAILURE:
        this._failureListeners.add(listener as UnidocConsumer.Failure)
        return
      case UnidocProducer.START:
        this._startListeners.add(listener as UnidocConsumer.Start)
        return
      default:
        throw new Error(
          `Unable to register the given listener for event type "${event}" ` +
          'because the given event type does not exists or is not supported.'
        )
    }
  }

  /**
   * @see UnidocProducer.prototype.off
   */
  public off(event: UnidocProducer.START, listener: UnidocConsumer.Start): void

  /**
   * @see UnidocProducer.prototype.off
   */
  public off(event: UnidocProducer.NEXT, listener: UnidocConsumer.Next<Product>): void

  /**
   * @see UnidocProducer.prototype.off
   */
  public off(event: UnidocProducer.SUCCESS, listener: UnidocConsumer.Success): void

  /**
   * @see UnidocProducer.prototype.off
   */
  public off(event: UnidocProducer.FAILURE, listener: UnidocConsumer.Failure): void

  /**
   * @see UnidocProducer.prototype.off
   */
  public off(event: UnidocProducer.Event, listener: UnidocConsumer.Listener<Product>): void

  /**
   * @see UnidocProducer.prototype.off
   */
  public off(event: UnidocProducer.Event): void

  /**
   * @see UnidocProducer.prototype.off
   */
  public off(): void

  /**
   * 
   */
  public off(event?: UnidocProducer.Event | undefined, listener?: UnidocConsumer.Listener<Product> | undefined): void {
    if (event === undefined) {
      this._startListeners.clear()
      this._nextListeners.clear()
      this._successListeners.clear()
      this._failureListeners.clear()
    } else if (listener === undefined) {
      switch (event) {
        case UnidocProducer.SUCCESS:
          return this._successListeners.clear()
        case UnidocProducer.NEXT:
          return this._nextListeners.clear()
        case UnidocProducer.FAILURE:
          return this._failureListeners.clear()
        case UnidocProducer.START:
          return this._startListeners.clear()
        default:
          throw new Error(
            `Unable to remove all event listener of event type "${event}" ` +
            'because the given event type does not exists or is not supported.'
          )
      }
    } else {
      switch (event) {
        case UnidocProducer.SUCCESS:
          this._successListeners.delete(listener as UnidocConsumer.Success)
          return
        case UnidocProducer.NEXT:
          this._nextListeners.delete(listener as UnidocConsumer.Next<Product>)
          return
        case UnidocProducer.FAILURE:
          this._failureListeners.delete(listener as UnidocConsumer.Failure)
          return
        case UnidocProducer.START:
          this._startListeners.delete(listener as UnidocConsumer.Start)
          return
        default:
          throw new Error(
            `Unable to remove the given listener for event type "${event}" ` +
            'because the given event type does not exists or is not supported.'
          )
      }
    }
  }
}

/**
 * 
 */
export namespace UnidocSink {
  /**
   * 
   */
  export function create<Produce>(): UnidocSink<Produce> {
    return new UnidocSink()
  }
}