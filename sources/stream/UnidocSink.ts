import { UnidocProducer } from "./UnidocProducer"
import { UnidocProducerEvent } from "./UnidocProducerEvent"
import { UnidocProducerListener } from "./UnidocProducerListener"

/**
 * 
 */
export class UnidocSink<Output> implements UnidocProducer<Output> {
  /**
   * 
   */
  private readonly _startListeners: Set<UnidocProducerListener.Start>

  /**
   * 
   */
  private readonly _nextListeners: Set<UnidocProducerListener.Next<Output>>

  /**
   * 
   */
  private readonly _successListeners: Set<UnidocProducerListener.Success>

  /**
   * 
   */
  private readonly _failureListeners: Set<UnidocProducerListener.Failure>

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
  public next(produce: Output): void {
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
   * @see UnidocProducer.on
   */
  public on(event: UnidocProducerEvent.START, listener: UnidocProducerListener.Start): void

  /**
   * @see UnidocProducer.on
   */
  public on(event: UnidocProducerEvent.NEXT, listener: UnidocProducerListener.Next<Output>): void

  /**
   * @see UnidocProducer.on
   */
  public on(event: UnidocProducerEvent.SUCCESS, listener: UnidocProducerListener.Success): void

  /**
   * @see UnidocProducer.on
   */
  public on(event: UnidocProducerEvent.FAILURE, listener: UnidocProducerListener.Failure): void

  /**
   *
   */
  public on(event: UnidocProducerEvent, listener: any): void {
    switch (event) {
      case UnidocProducerEvent.SUCCESS:
        this._successListeners.add(listener)
        return
      case UnidocProducerEvent.NEXT:
        this._nextListeners.add(listener)
        return
      case UnidocProducerEvent.FAILURE:
        this._failureListeners.add(listener)
        return
      case UnidocProducerEvent.START:
        this._startListeners.add(listener)
        return
      default:
        throw new Error(
          'Unable to register the given listener for event type "' + event +
          '" because the given event type does not exists or is not supported.'
        )
    }
  }

  /**
   * @see UnidocProducer.off
   */
  public off(event: UnidocProducerEvent.START, listener: UnidocProducerListener.Start): void

  /**
   * @see UnidocProducer.off
   */
  public off(event: UnidocProducerEvent.NEXT, listener: UnidocProducerListener.Next<Output>): void

  /**
   * @see UnidocProducer.off
   */
  public off(event: UnidocProducerEvent.SUCCESS, listener: UnidocProducerListener.Success): void

  /**
   * @see UnidocProducer.off
   */
  public off(event: UnidocProducerEvent.FAILURE, listener: UnidocProducerListener.Failure): void

  /**
   * @see UnidocProducer.off
   */
  public off(event: UnidocProducerEvent): void

  /**
   * @see UnidocProducer.off
   */
  public off(): void

  /**
   * 
   */
  public off(event?: UnidocProducerEvent | undefined, listener?: any): void {
    if (event === undefined) {
      this._startListeners.clear()
      this._nextListeners.clear()
      this._successListeners.clear()
      this._failureListeners.clear()
    } else if (listener === undefined) {
      switch (event) {
        case UnidocProducerEvent.SUCCESS:
          return this._successListeners.clear()
        case UnidocProducerEvent.NEXT:
          return this._nextListeners.clear()
        case UnidocProducerEvent.FAILURE:
          return this._failureListeners.clear()
        case UnidocProducerEvent.START:
          return this._startListeners.clear()
        default:
          throw new Error(
            'Unable to remove all event listener of event type "' + event +
            '" because the given event type does not exists or is not supported.'
          )
      }
    } else {
      switch (event) {
        case UnidocProducerEvent.SUCCESS:
          this._successListeners.delete(listener)
          return
        case UnidocProducerEvent.NEXT:
          this._nextListeners.delete(listener)
          return
        case UnidocProducerEvent.FAILURE:
          this._failureListeners.delete(listener)
          return
        case UnidocProducerEvent.START:
          this._startListeners.delete(listener)
          return
        default:
          throw new Error(
            'Unable to remove the given listener for event type "' + event +
            '" because the given event type does not exists or is not supported.'
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