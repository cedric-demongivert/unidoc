import { Duplicator } from "@cedric-demongivert/gl-tool-collection"
import { DataObject } from "../DataObject"
import { UnidocLocation } from "./UnidocLocation"

/**
 * The description of a given range of symbols in an unidoc document.
 */
export class UnidocRange implements DataObject {
  /**
   * Starting location of this range (inclusive). 
   */
  public readonly start: UnidocLocation

  /**
   * Ending location of this range (exclusive).
   */
  public readonly end: UnidocLocation

  /**
   * Instantiate a new range with the given starting and ending coordinates.
   * 
   * Instantiate an empty range at zero coordinates by default.
   * If only start is specified, it instantiate an empty range at the given starting coordinates.
   * 
   * @param [start] - The starting coordinates of the new range to instantiate.
   * @param [end] - The ending coordinates of the new range to instantiate.
   */
  public constructor(start?: UnidocLocation | undefined | null, end?: UnidocLocation | undefined | null) {
    this.start = start ? start.clone() : new UnidocLocation()
    this.end = end ? end.clone() : (start ? start.clone() : new UnidocLocation())
  }

  /**
   * Update this range as an empty range located at the given coordinates.
   * 
   * @param location - The next coordinates of this range.
   * 
   * @return This instance for chaining purposes.
   */
  public atLocation(location: UnidocLocation): this {
    this.start.copy(location)
    this.end.copy(location)

    return this
  }

  /**
   * Update this range as an empty range located at the given coordinates.
   * 
   * @param [column = 0]
   * @param [line = 0]
   * @param [index = 0]
   * 
   * @return This instance for chaining purposes.
   */
  public atCoordinates(column: number = 0, line: number = 0, index: number = 0): this {
    this.start.set(column, line, index)
    this.end.set(column, line, index)

    return this
  }

  /**
   * Update this range as a range containing the symbols between the given coordinates.
   * 
   * @param start - The starting coordinates of the range.
   * @param end - The ending coordinates of the range.
   * 
   * @return This instance for chaining purposes.
   */
  public betweenLocations(start: UnidocLocation, end: UnidocLocation): this {
    this.start.copy(start)
    this.end.copy(end)

    return this
  }

  /**
   * Update this range as a range containing the symbols between the given coordinates.
   * 
   * @param [startingColumn = 0]
   * @param [startingLine = 0]
   * @param [startingIndex = 0]
   * @param [endingColumn = 0]
   * @param [endingLine = 0]
   * @param [endingIndex = 0]
   * 
   * @return This instance for chaining purposes.
   */
  public betweenCoordinates(
    startingColumn: number = 0, startingLine: number = 0, startingIndex: number = 0,
    endingColumn: number = 0, endingLine: number = 0, endingIndex: number = 0
  ): this {
    this.start.set(startingColumn, startingLine, startingIndex)
    this.end.set(endingColumn, endingLine, endingIndex)

    return this
  }

  /**
   * @see DataObject.equals 
   */
  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocRange) {
      return (
        other.start.equals(this.start) &&
        other.end.equals(this.end)
      )
    }

    return false
  }

  /**
   * @see DataObject.copy
   */
  public copy(toCopy: this): this {
    this.start.copy(toCopy.start)
    this.end.copy(toCopy.end)
    return this
  }

  /**
   * @see DataObject.clone
   */
  public clone(): UnidocRange {
    return new UnidocRange(this.start, this.end)
  }

  /**
   * @see Object.toString
   */
  public toString(): string {
    if (this.start.equals(this.end)) {
      return `at ${this.start.toString()}`
    } else {
      return `from ${this.start.toString()} to ${this.end.toString()}`
    }
  }


  /**
   * @see DataObject.clear
   */
  public clear(): this {
    this.start.clear()
    this.end.clear()
    return this
  }
}

/**
 * 
 */
export namespace UnidocRange {
  /**
   * 
   */
  export const ZERO: Readonly<UnidocRange> = Object.freeze(new UnidocRange())

  /**
   * 
   */
  export function create(start?: UnidocLocation | undefined | null, end?: UnidocLocation | undefined | null): UnidocRange {
    return new UnidocRange(start, end)
  }

  /**
   * 
   */
  export function atCoordinates(column: number = 0, line: number = 0, index: number = 0): UnidocRange {
    return new UnidocRange().atCoordinates(column, line, index)
  }

  /**
   * 
   */
  export function betweenCoordinates(
    startingColumn: number = 0, startingLine: number = 0, startingIndex: number = 0,
    endingColumn: number = 0, endingLine: number = 0, endingIndex: number = 0,
  ): UnidocRange {
    return new UnidocRange().betweenCoordinates(
      startingColumn,
      startingLine,
      startingIndex,
      endingColumn,
      endingLine,
      endingIndex
    )
  }

  /**
   * 
   */
  export const ALLOCATOR: Duplicator<UnidocRange> = Duplicator.fromFactory(create)
}