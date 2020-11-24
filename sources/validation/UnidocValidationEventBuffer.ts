import { Pack } from '@cedric-demongivert/gl-tool-collection'
import { Sequence } from '@cedric-demongivert/gl-tool-collection'

import { UnidocBuffer } from '../buffer/UnidocBuffer'
import { SubscribableUnidocConsumer } from '../consumer/SubscribableUnidocConsumer'

import { UnidocValidationEvent } from './UnidocValidationEvent'

export class UnidocValidationEventBuffer extends SubscribableUnidocConsumer<UnidocValidationEvent> {
  private readonly _events: Pack<UnidocValidationEvent>

  public readonly events: Sequence<UnidocValidationEvent>

  /**
  * Instantiate a new empty event buffer with the given capacity.
  *
  * @param [capacity = 32] - Capacity of the buffer to instantiate.
  */
  public constructor(capacity: number = 32) {
    super()
    this._events = Pack.instance(UnidocValidationEvent.ALLOCATOR, capacity)
    this.events = this._events.view()
  }

  /**
  * @see Pack.capacity
  */
  public get capacity(): number {
    return this._events.capacity
  }

  /**
  * @see Pack.size
  */
  public get size(): number {
    return this._events.size
  }

  /**
  * @see Pack.size
  */
  public set size(newSize: number) {
    this._events.size = newSize
  }

  /**
  * @see UnidocConsumer.handleInitialization
  */
  public handleInitialization(): void {

  }

  /**
  * @see UnidocConsumer.handleProduction
  */
  public handleProduction(value: UnidocValidationEvent): void {
    this.push(value)
  }

  /**
  * @see UnidocConsumer.handleCompletion
  */
  public handleCompletion(): void {

  }

  /**
  * @see UnidocConsumer.handleFailure
  */
  public handleFailure(error: Error): void {

  }

  /**
  * @see Pack.fit
  */
  public fit(): void {
    this._events.fit()
  }

  /**
  * @see Pack.reallocate
  */
  public reallocate(capacity: number): void {
    this._events.reallocate(capacity)
  }

  /**
  * @see Pack.get
  */
  public get(index: number): UnidocValidationEvent {
    return this._events.get(index)
  }

  /**
  * @see Pack.push
  */
  public push(event: UnidocValidationEvent): void {
    this._events.push(event)
  }

  /**
  * @see Pack.delete
  */
  public delete(index: number): void {
    this._events.delete(index)
  }

  /**
  * @see Pack.deleteMany
  */
  public deleteMany(index: number, length: number): void {
    this._events.deleteMany(index, length)
  }

  /**
  * Reset this token buffer.
  */
  public concat(events: Iterable<UnidocValidationEvent>): void {
    for (const event of events) {
      this._events.push(event)
    }
  }

  /**
  * Reset this token buffer.
  */
  public copy(events: Iterable<UnidocValidationEvent>): void {
    this._events.clear()

    for (const event of events) {
      this._events.push(event)
    }
  }

  /**
  * Reset this token buffer.
  */
  public clear(): void {
    this._events.clear()
  }

  public toString(): string {
    let result: string = '['

    for (let index = 0; index < this._events.size; ++index) {
      if (index > 0) result += ','
      result += '\r\n' + this._events.get(index).toString()
    }

    if (this._events.size > 0) result += '\r\n'
    result += ']'

    return result
  }

  /**
  * @see Object.equals
  */
  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocValidationEventBuffer) {
      if (other.events.size !== this._events.size) return false

      for (let index = 0, size = this._events.size; index < size; ++index) {
        if (!other.events.get(index).equals(this._events.get(index))) {
          return false
        }
      }

      return true
    }

    return false
  }

  public expect(other: any): boolean {
    UnidocBuffer.expect(other instanceof UnidocValidationEventBuffer ? other._events : other, this._events)
    return true
  }
}

export namespace UnidocValidationEventBuffer {

}
