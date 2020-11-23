import { ListenableUnidocProducer } from '../../producer/ListenableUnidocProducer'

import { DataEvent } from './DataEvent'

export class DataEventProducer extends ListenableUnidocProducer<DataEvent> {
  private _index: number
  private readonly _event: DataEvent

  public constructor() {
    super()
    this._index = 0
    this._event = new DataEvent()
  }

  public fromRoot(): DataEventProducer {
    this._event.path.clear()
    return this
  }

  public atNode(value: string): DataEventProducer {
    this._event.path.push(value)
    return this
  }

  public atIndex(value: number): DataEventProducer {
    this._event.path.push(value)
    return this
  }

  public withValue(value: any): DataEventProducer {
    this._event.value = value
    return this
  }

  /**
  * @see ListenableUnidocProducer.initialize
  */
  public initialize(): void {
    this.clear()
    super.initialize()
  }

  /**
  * @see ListenableUnidocProducer.produce
  */
  public produce(event: DataEvent = this._event): void {
    event.index = this._index
    this._index += 1
    super.produce(event)
  }

  /**
  * @see ListenableUnidocProducer.complete
  */
  public complete(): void {
    super.complete()
  }

  public clear() {
    this._index = 0
    this._event.clear()
  }
}

export namespace DataEventProducer {
}
