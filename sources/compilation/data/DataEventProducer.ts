import { ListenableUnidocProducer } from '../../stream/ListenableUnidocProducer'

import { DataEvent } from './DataEvent'

/**
*
*/
export class DataEventProducer extends ListenableUnidocProducer<DataEvent> {
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
    this.produce()
    return this
  }

  /**
  *
  */
  public object(): DataEventProducer {
    this._event.object()
    this.produce()
    return this
  }

  /**
  *
  */
  public array(): DataEventProducer {
    this._event.array()
    this.produce()
    return this
  }

  /**
  *
  */
  public map(): DataEventProducer {
    this._event.map()
    this.produce()
    return this
  }

  /**
  *
  */
  public swap(value: any): DataEventProducer {
    this._event.swap(value)
    this.produce()
    return this
  }

  /**
  *
  */
  public move(...fields: Array<string | number>): DataEventProducer {
    this._event.move(...fields)
    this.produce()
    return this
  }

  /**
  *
  */
  public back(): DataEventProducer {
    this._event.back()
    this.produce()
    return this
  }

  /**
  *
  */
  public set(...parameters: Array<any>): DataEventProducer {
    this._event.set(...parameters)
    this.produce()
    return this
  }

  /**
  *
  */
  public push(...parameters: Array<any>): DataEventProducer {
    this._event.push(...parameters)
    this.produce()
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
