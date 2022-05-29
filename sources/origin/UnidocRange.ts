import { Duplicator } from "@cedric-demongivert/gl-tool-collection"
import { DataObject } from "../DataObject"
import { UnidocLocation } from "./UnidocLocation"

/**
 * The identification of a range of symbols in an unidoc document.
 */
export class UnidocRange implements DataObject {
  /**
   * Coordinates of the first symbol of the range (inclusive). 
   */
  public readonly start: UnidocLocation

  /**
   * Coordinates of the last symbol of the range (exclusive).
   * 
   * If a range is empty, the coordinates of it's last symbol are equal to the coordinates of it's first symbol.
   */
  public readonly end: UnidocLocation

  /**
   * Instantiate a new range at the given coordinates.
   * 
   * If only the starting coordinates are specified, this constructor will return an empty range at the given coordinates.
   * 
   * @param [start] - The starting coordinates of the new range to instantiate.
   * @param [end] - The ending coordinates of the new range to instantiate.
   */
  public constructor(start?: UnidocLocation | undefined | null, end?: UnidocLocation | undefined | null) {
    const definedStart: UnidocLocation = start || UnidocLocation.ZERO

    this.start = definedStart.clone()
    this.end = (end || definedStart).clone()
  }

  /**
   * Update this range as an empty range located at the given coordinates.
   * 
   * @param location - The new coordinates of this range.
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
   * @param column
   * @param row
   * @param symbol
   * 
   * @return This instance for chaining purposes.
   * 
   * @see UnidocLocation.column
   * @see UnidocLocation.row
   * @see UnidocLocation.symbol
   */
  public atCoordinates(column: number, row: number, symbol: number): this {
    this.start.set(column, row, symbol)
    this.end.set(column, row, symbol)
    return this
  }

  /**
   * Update this range starting coordinates.
   * 
   * @param location - The new starting coordinates of this range.
   * 
   * @return This instance for chaining purposes.
   */
  public fromLocation(location: UnidocLocation): this {
    this.start.copy(location)
    return this
  }

  /**
   * Update this range starting coordinates.
   * 
   * @param column
   * @param row
   * @param symbol
   * 
   * @return This instance for chaining purposes.
   * 
   * @see UnidocLocation.column
   * @see UnidocLocation.row
   * @see UnidocLocation.symbol
   */
  public fromCoordinates(column: number, row: number, symbol: number): this {
    this.start.set(column, row, symbol)
    return this
  }

  /**
   * Update this range ending coordinates.
   * 
   * @param location - The new ending coordinates of this range.
   * 
   * @return This instance for chaining purposes.
   */
  public toLocation(location: UnidocLocation): this {
    this.end.copy(location)
    return this
  }

  /**
   * Update this range ending coordinates.
   * 
   * @param column
   * @param row
   * @param symbol
   * 
   * @return This instance for chaining purposes.
   * 
   * @see UnidocLocation.column
   * @see UnidocLocation.row
   * @see UnidocLocation.symbol
   */
  public toCoordinates(column: number, row: number, symbol: number): this {
    this.end.set(column, row, symbol)
    return this
  }

  /**
   * @see Comparable.prototype.equals 
   */
  public equals(other: unknown): boolean {
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
   * 
   */
  public copy(toCopy: UnidocRange): this {
    this.start.copy(toCopy.start)
    this.end.copy(toCopy.end)
    return this
  }

  /**
   * @see Clonable.prototype.clone
   */
  public clone(): UnidocRange {
    return new UnidocRange(this.start, this.end)
  }

  /**
   * @see Object.prototype.toString
   */
  public toString(): string {
    const start = this.start
    const end = this.end

    if (start.equals(end)) {
      return `at ${start.toString()}`
    } else {
      return `from ${start.toString()} to ${end.toString()}`
    }
  }

  /**
   * @see DataObject.prototype.clear
   */
  public clear(): this {
    this.start.clear()
    this.end.clear()
    return this
  }

  /**
   * 
   */
  public setStart(start: UnidocLocation): this {
    this.start.copy(start)
    return this
  }

  /**
   * 
   */
  public setEnd(end: UnidocLocation): this {
    this.end.copy(end)
    return this
  }

  /**
   * 
   */
  public setLocation(location: UnidocLocation): this {
    this.start.copy(location)
    this.end.copy(location)
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
  export function atCoordinates(column: number, row: number, symbol: number): UnidocRange {
    return new UnidocRange().atCoordinates(column, row, symbol)
  }

  /**
   * 
   */
  export function atLocation(location: UnidocLocation): UnidocRange {
    return new UnidocRange().atLocation(location)
  }

  /**
   * 
   */
  export function fromCoordinates(column: number, row: number, symbol: number): UnidocRange {
    return new UnidocRange().fromCoordinates(column, row, symbol)
  }

  /**
   * 
   */
  export function fromLocation(location: UnidocLocation): UnidocRange {
    return new UnidocRange().fromLocation(location)
  }

  /**
   * 
   */
  export const ALLOCATOR: Duplicator<UnidocRange> = Duplicator.fromFactory(create)
}