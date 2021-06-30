import { Pack } from '@cedric-demongivert/gl-tool-collection'

import { UnidocFunction } from '../../stream/UnidocFunction'
import { UnidocProducerEvent } from '../../stream/UnidocProducerEvent'

import { DataPath } from './DataPath'
import { Data } from './Data'
import { DataEvent } from './DataEvent'
import { DataEventType } from './DataEventType'

export class DataEventCompiler extends UnidocFunction<DataEvent, any> {
  /**
  *
  */
  private readonly _stack: Pack<any>

  /**
  *
  */
  private readonly _path: DataPath

  /**
  *
  */
  public constructor(capacity: number = 16) {
    super()

    this._stack = Pack.any(capacity)
    this._path = new DataPath(capacity)
  }

  /**
  *
  */
  public start(): void {
    this.output.start()
    this._stack.push(undefined)
  }

  /**
  *
  */
  public next(value: DataEvent): void {
    switch (value.type) {
      case DataEventType.MOVE:
        this.move(value.path)
        break
      case DataEventType.BACK:
        this.back()
        break
      case DataEventType.OBJECT:
        this.object()
        break
      case DataEventType.ARRAY:
        this.array()
        break
      case DataEventType.MAP:
        this.map()
        break
      case DataEventType.SWAP:
        this.swap(value.value)
        break
      case DataEventType.SET:
        this.set(value.path, value.value)
        break
      case DataEventType.PUSH:
        this.push(value.path, value.value)
        break
      case DataEventType.PUBLISH:
        this.publish()
        break
      default:
        throw new Error(
          'Unable to handle production of event of type ' +
          DataEventType.toDebugString(value.type) + ' because no procedure ' +
          'was defined for that.'
        )
    }
  }

  /**
  *
  */
  public move(path: DataPath): void {
    let current: any = this._stack.last

    for (const element of path.elements) {
      current = Data.move(current, element)

      this._stack.push(current)
      this._path.push(element)
    }
  }

  /**
  *
  */
  public back(): void {
    if (this._path.size > 0) {
      this._stack.pop()
      this._path.pop()
    } else {
      throw new Error('Unable to move back from the root of the declaration.')
    }
  }

  /**
  *
  */
  public object(): void {
    const value: any = this._stack.last

    if (value == null) {
      this._stack.set(this._stack.lastIndex, {})
    } else if (typeof value === 'object') {
      if (value instanceof Array) {
        throw new Error(
          'Unable to define the current value as an object as the current ' +
          'value is an array.'
        )
      } else if (value instanceof Map) {
        throw new Error(
          'Unable to define the current value as an object as the current ' +
          'value is a map.'
        )
      } else {
        return
      }
    } else {
      throw new Error(
        'Unable to define the current value as an object as the current ' +
        'value is a primitive value.'
      )
    }
  }

  /**
  *
  */
  public array(): void {
    const value: any = this._stack.last

    if (value == null) {
      this._stack.set(this._stack.lastIndex, [])
    } else if (typeof value === 'object') {
      if (value instanceof Array) {
        return
      } else if (value instanceof Map) {
        throw new Error(
          'Unable to define the current value as an array as the current ' +
          'value is a map.'
        )
      } else {
        throw new Error(
          'Unable to define the current value as an array as the current ' +
          'value is an object.'
        )
      }
    } else {
      throw new Error(
        'Unable to define the current value as an array as the current ' +
        'value is a primitive value.'
      )
    }
  }

  /**
  *
  */
  public map(): void {
    const value: any = this._stack.last

    if (value == null) {
      this._stack.set(this._stack.lastIndex, new Map())
    } else if (typeof value === 'object') {
      if (value instanceof Array) {
        throw new Error(
          'Unable to define the current value as a map as the current ' +
          'value is an array.'
        )
      } else if (value instanceof Map) {
        return
      } else {
        throw new Error(
          'Unable to define the current value as a map as the current ' +
          'value is an object.'
        )
      }
    } else {
      throw new Error(
        'Unable to define the current value as a map as the current ' +
        'value is a primitive value.'
      )
    }
  }

  /**
  *
  */
  public swap(value: any): void {
    this._stack.set(this._stack.lastIndex, value)
  }

  /**
  *
  */
  public set(path: DataPath, value: any): void {
    Data.setIn(this._stack.last, path, value)
  }

  /**
  *
  */
  public push(path: DataPath, value: any): void {
    Data.pushIn(this._stack.last, path, value)
  }

  /**
  *
  */
  public publish(): void {
    const result: any = this._stack.first
    this._stack.clear()
    this._path.clear()
    this._stack.push(undefined)
    this.output.next(result)
  }

  /**
  *
  */
  public success(): void {
    const result: any = this._stack.first
    this._stack.clear()
    this._path.clear()
    this.output.next(result)
    this.output.success()
  }

  /**
  *
  */
  public failure(error: Error): void {
    this.output.fail(error)
  }

  /**
  * Update the state of this compiler to make it as if it was just
  * instantiated.
  */
  public clear(): void {
    this._stack.clear()
    this.off()
  }
}

export namespace DataEventCompiler {
}
