import { Allocator, Duplicator } from '@cedric-demongivert/gl-tool-collection'
import { DataObject } from '../DataObject'

import { UTF32CodeUnit } from '../symbol/UTF32CodeUnit'

import { UnidocLocation } from './UnidocLocation'

/**
 * Track the position of a cursor in a given UTF32 text.
 */
export class UnidocTracker implements DataObject {
  /**
   * The current location of the cursor.
   */
  public readonly location: UnidocLocation

  /**
   * True, if the previous symbol was an unicode CARRIAGE_RETURN.
   */
  private carriageReturn: boolean

  /**
   * Instantiate a new tracker at the given coordinates.
   * 
   * Return by default a tracker at the begining of the document.
   * 
   * @param [column = 0]
   * @param [row = 0]
   * @param [index = 0]
   * 
   * @see UnidocLocation.column
   * @see UnidocLocation.row
   * @see UnidocLocation.index
   */
  public constructor(column: number = 0, row: number = 0, index: number = 0) {
    this.location = new UnidocLocation(column, row, index)
    this.carriageReturn = false
  }

  /**
   * Feed this tracker with a UTF-16 javascript string.
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
   * Feed this tracker with an UTF32 code unit.
   * 
   * The tracker will update the location of it's cursor to the end of the given unit as if
   * it was the content that follows the ones that was already processed by this tracker.
   * 
   * @param symbol - The symbol to process.
   * 
   * @return This instance for chaining purposes.
   * 
   * @see https://www.unicode.org/reports/tr14/
   */
  public next(symbol: UTF32CodeUnit): this {
    const location: UnidocLocation = this.location

    switch (symbol) {
      case UTF32CodeUnit.CARRIAGE_RETURN:
        location.column = 0
        location.row += 1
        location.symbol += 1
        this.carriageReturn = true
        break
      case UTF32CodeUnit.NEW_LINE:
        if (this.carriageReturn) {
          location.symbol += 1
          this.carriageReturn = false
          break
        }
      case UTF32CodeUnit.VERTICAL_TABULATION:
      case UTF32CodeUnit.FORM_FEED:
      case UTF32CodeUnit.LINE_SEPARATOR:
      case UTF32CodeUnit.PARAGRAPH_SEPARATOR:
      case UTF32CodeUnit.NEXT_LINE:
        location.column = 0
        location.row += 1
        location.symbol += 1
        this.carriageReturn = false
        break
      default:
        location.column += 1
        location.symbol += 1
        this.carriageReturn = false
        break
    }

    return this
  }

  /**
   * @see DataObject.clear
   */
  public clear(): this {
    this.location.clear()
    this.carriageReturn = false
    return this
  }

  /**
   * @see DataObject.copy
   */
  public copy(toCopy: this): this {
    this.location.copy(toCopy.location)
    this.carriageReturn = toCopy.carriageReturn
    return this
  }

  /**
   * @see DataObject.clone
   */
  public clone(): UnidocTracker {
    const result: UnidocTracker = new UnidocTracker()
    result.copy(this)
    return result
  }

  /**
   * @see DataObject.equals
   */
  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocTracker) {
      return (
        other.location.equals(this.location) &&
        other.carriageReturn === this.carriageReturn
      )
    }

    return false
  }
}

/**
 * 
 */
export namespace UnidocTracker {
  /**
   * 
   */
  export function create(column: number = 0, line: number = 0, index: number = 0): UnidocTracker {
    return new UnidocTracker(column, line, index)
  }

  /**
   * 
   */
  export const ALLOCATOR: Allocator<UnidocTracker> = Duplicator.fromFactory(create)
}