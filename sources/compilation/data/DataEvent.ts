import { Allocator } from '@cedric-demongivert/gl-tool-collection'

import { DataPath } from './DataPath'

export class DataEvent {
  public index: number
  public readonly path: DataPath
  public value: any

  public constructor(capacity: number = 16) {
    this.index = 0
    this.path = new DataPath(capacity)
    this.value = null
  }

  public clear(): void {
    this.index = 0
    this.path.clear()
    this.value = null
  }

  public copy(toCopy: DataEvent): void {
    this.index = toCopy.index
    this.path.copy(toCopy.path)
    this.value = toCopy.value
  }

  public clone(): DataEvent {
    const result: DataEvent = new DataEvent(this.path.capacity)
    result.copy(this)
    return result
  }

  /**
  * @see Object.toString
  */
  public toString(): string {
    return '#' + this.index + ' ' + this.path.toString() + ' => ' + this.value
  }

  /**
  * @see Object.equals
  */
  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof DataEvent) {
      if (typeof other.value === 'object' && other.value.equals) {
        if (!other.value.equals(this.value)) {
          return false
        }
      } else if (other.value !== this.value) {
        return false
      }

      return (
        other.index === this.index &&
        other.path.equals(this.path)
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
