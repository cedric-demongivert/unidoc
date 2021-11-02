import { Allocator, Duplicator } from '@cedric-demongivert/gl-tool-collection'
import { DataObject } from 'sources/DataObject'

import { UTF32CodeUnit } from '../symbol/UTF32CodeUnit'

import { UnidocLocation } from './UnidocLocation'
import { UnidocLocationTrackerState } from './UnidocLocationTrackerState'

/**
 * Track the position of a cursor in a given UTF32 text.
 */
export class UnidocLocationTracker implements DataObject {
  /**
   * The current location of the cursor.
   */
  public readonly location: UnidocLocation

  /**
   * The current inner-state of this tracker.
   */
  private _state: UnidocLocationTrackerState

  /**
   * Instantiate a new tracker.
   */
  public constructor(column: number = 0, row: number = 0, index: number = 0) {
    this.location = new UnidocLocation(column, row, index)
    this._state = UnidocLocationTrackerState.DEFAULT
  }

  /**
   * Feed this tracker with a Javascript string.
   * 
   * The tracker will update the location of it's cursor to the end of the given string as if
   * it was the content that follows the one that was already processed by this tracker.
   * 
   * @param value - The string to give to this tracker.
   * 
   * @return This instance for chaining purposes.
   */
  public nextString(value: string): this {
    for (const symbol of UTF32CodeUnit.fromString(value)) {
      this.next(symbol)
    }

    return this
  }

  /**
   * Feed this tracker with an UTF32 code unit..
   * 
   * The tracker will update the location of it's cursor to the end of the given unit as if
   * it was the content that follows the ones that was already processed by this tracker.
   * 
   * @param symbol - The symbol to process.
   * 
   * @return This instance for chaining purposes.
   */
  public next(symbol: UTF32CodeUnit): this {
    const location: UnidocLocation = this.location

    switch (symbol) {
      case UTF32CodeUnit.CARRIAGE_RETURN:
        location.column = 0
        location.line += 1
        location.index += 1
        this._state = UnidocLocationTrackerState.RETURN
        break
      case UTF32CodeUnit.NEW_LINE:
        if (this._state === UnidocLocationTrackerState.RETURN) {
          location.index += 1
          this._state = UnidocLocationTrackerState.SYMBOL
        } else {
          location.column = 0
          location.line += 1
          location.index += 1
        }
        break
      default:
        location.line += 1
        location.index += 1
        this._state = UnidocLocationTrackerState.SYMBOL
        break
    }

    return this
  }

  /**
   * @see DataObject.clear
   */
  public clear(): this {
    this.location.clear()
    this._state = UnidocLocationTrackerState.DEFAULT
    return this
  }

  /**
   * @see DataObject.copy
   */
  public copy(toCopy: this): this {
    this.location.copy(toCopy.location)
    this._state = toCopy._state
    return this
  }

  /**
   * @see DataObject.clone
   */
  public clone(): UnidocLocationTracker {
    const result: UnidocLocationTracker = new UnidocLocationTracker()
    result.copy(this)
    return result
  }

  /**
   * @see DataObject.equals
   */
  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocLocationTracker) {
      return other.location.equals(this.location) &&
        other._state === this._state
    }

    return false
  }
}

/**
 * 
 */
export namespace UnidocLocationTracker {
  /**
   * 
   */
  export function create(column: number = 0, line: number = 0, index: number = 0): UnidocLocationTracker {
    return new UnidocLocationTracker(column, line, index)
  }

  /**
   * 
   */
  export const ALLOCATOR: Allocator<UnidocLocationTracker> = Duplicator.fromFactory(create)
}