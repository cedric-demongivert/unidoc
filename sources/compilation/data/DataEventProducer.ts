import { UnidocPublisher } from '../../stream/UnidocPublisher'

import { DataEvent } from './DataEvent'

/**
*
*/
export class DataEventProducer extends UnidocPublisher<DataEvent> {
  /**
  *
  */
  private _index: number

  /**
  *
  */
  private readonly _event: DataEvent

  /**
  *
  */
  public constructor() {
    super()
    this._index = 0
    this._event = new DataEvent()
  }


  /**
  *
  */
  public publish(): DataEventProducer {
    this._event.publish()
    this.next()
    return this
  }

  /**
  *
  */
  public object(): DataEventProducer {
    this._event.object()
    this.next()
    return this
  }

  /**
  *
  */
  public array(): DataEventProducer {
    this._event.array()
    this.next()
    return this
  }

  /**
  *
  */
  public map(): DataEventProducer {
    this._event.map()
    this.next()
    return this
  }

  /**
  *
  */
  public swap(value: any): DataEventProducer {
    this._event.swap(value)
    this.next()
    return this
  }

  /**
  *
  */
  public move(...fields: Array<string | number>): DataEventProducer {
    this._event.move(...fields)
    this.next()
    return this
  }

  /**
  *
  */
  public back(): DataEventProducer {
    this._event.back()
    this.next()
    return this
  }

  /**
  *
  */
  public set(...parameters: Array<any>): DataEventProducer {
    this._event.set(...parameters)
    this.next()
    return this
  }

  /**
  *
  */
  public push(...parameters: Array<any>): DataEventProducer {
    this._event.push(...parameters)
    this.next()
    return this
  }

  /**
  * @see ListenableUnidocProducer.initialize
  */
  public start(): void {
    this.clear()
    this.output.start()
  }

  /**
  * @see ListenableUnidocProducer.produce
  */
  public next(event: DataEvent = this._event): void {
    event.index = this._index
    this._index += 1
    this.output.next(event)
  }

  /**
  * @see ListenableUnidocProducer.complete
  */
  public success(): void {
    this.output.success()
  }

  /**
  *
  */
  public clear() {
    this._index = 0
    this._event.clear()
  }
}

export namespace DataEventProducer {
}
