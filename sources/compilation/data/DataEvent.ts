import { Allocator } from '@cedric-demongivert/gl-tool-collection'

import { DataEventType } from './DataEventType'
import { DataPath } from './DataPath'

/**
*
*/
export class DataEvent {
  /**
  *
  */
  public index: number

  /**
  *
  */
  public type: DataEventType

  /**
  *
  */
  public readonly path: DataPath

  /**
  *
  */
  public value: any

  /**
  *
  */
  public constructor() {
    this.index = 0
    this.type = DataEventType.DEFAULT
    this.value = undefined
    this.path = new DataPath(8)
  }

  /**
  *
  */
  public publish(): void {
    this.type = DataEventType.PUBLISH
    this.value = undefined
    this.path.clear()
  }

  /**
  *
  */
  public object(): void {
    this.type = DataEventType.OBJECT
    this.value = undefined
    this.path.clear()
  }

  /**
  *
  */
  public array(): void {
    this.type = DataEventType.ARRAY
    this.value = undefined
    this.path.clear()
  }

  /**
  *
  */
  public map(): void {
    this.type = DataEventType.MAP
    this.value = undefined
    this.path.clear()
  }

  /**
  *
  */
  public swap(value: any): void {
    this.type = DataEventType.SWAP
    this.value = value
    this.path.clear()
  }

  /**
  *
  */
  public move(...fields: Array<string | number>): void {
    this.type = DataEventType.MOVE
    this.value = undefined
    this.path.clear()

    for (const field of fields) {
      this.path.push(field)
    }
  }

  /**
  *
  */
  public back(): void {
    this.type = DataEventType.BACK
    this.value = undefined
    this.path.clear()
  }

  /**
  *
  */
  public set(...parameters: Array<any>): void {
    this.type = DataEventType.SET
    this.value = parameters[parameters.length - 1]
    this.path.clear()

    for (let index = 0, size = parameters.length - 1; index < size; ++index) {
      this.path.push(parameters[index])
    }
  }

  /**
  *
  */
  public push(...parameters: Array<any>): void {
    this.type = DataEventType.PUSH
    this.value = parameters[parameters.length - 1]
    this.path.clear()

    for (let index = 0, size = parameters.length - 1; index < size; ++index) {
      this.path.push(parameters[index])
    }
  }

  /**
  *
  */
  public clear(): void {
    this.index = 0
    this.type = DataEventType.DEFAULT
    this.value = undefined
  }

  /**
  *
  */
  public copy(toCopy: DataEvent): void {
    this.index = toCopy.index
    this.type = toCopy.type
    this.value = toCopy.value
  }

  /**
  *
  */
  public clone(): DataEvent {
    const result: DataEvent = new DataEvent()
    result.copy(this)
    return result
  }

  /**
  * @see Object.toString
  */
  public toString(): string {
    let result: string = '#' + this.index

    switch (this.type) {
      case DataEventType.MOVE:
        return result + ' move ' + this.path.toString()
      case DataEventType.BACK:
        return result + ' back'
      case DataEventType.OBJECT:
        return result + ' object'
      case DataEventType.ARRAY:
        return result + ' array'
      case DataEventType.MAP:
        return result + ' map'
      case DataEventType.SWAP:
        return result + ' swap to ' + this.value
      case DataEventType.SET:
        return result + ' set ' + this.path.toString() + ' ' + this.value
      case DataEventType.PUSH:
        return result + ' push ' + this.path.toString() + ' ' + this.value
      default:
        throw new Error(
          'Unable to map a data event of type ' +
          DataEventType.toDebugString(this.type) + ' to a string because ' +
          'no procedure was defined for that.'
        )
    }
  }

  /**
  * @see Object.equals
  */
  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof DataEvent) {
      return (
        other.index === this.index &&
        other.type === this.type &&
        other.value === this.value
      )
    }

    return false
  }
}

export namespace DataEvent {
  /**
  * Return a deep copy of the given instance.
  *
  * @param toCopy - An instance to copy.
  *
  * @return A deep copy of the given instance.
  */
  export function copy(toCopy: DataEvent): DataEvent
  export function copy(toCopy: null): null
  export function copy(toCopy: undefined): undefined
  export function copy(toCopy: DataEvent | null | undefined): DataEvent | null | undefined {
    return toCopy == null ? toCopy : toCopy.clone()
  }

  export function create(): DataEvent {
    return new DataEvent()
  }

  export const ALLOCATOR: Allocator<DataEvent> = Allocator.fromFactory(create)
}
