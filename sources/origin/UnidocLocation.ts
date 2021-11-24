import { Duplicator } from '@cedric-demongivert/gl-tool-collection'

import { DataObject } from '../DataObject'

/**
 * A set of coordinates that identify a symbol in a document.
 */
export class UnidocLocation implements DataObject {
  /**
   * The location that identify the first symbol of a document.
   */
  public static ZERO: UnidocLocation = new UnidocLocation(0, 0, 0)

  /**
   * The number of symbols to skip from the begining of the current row in order to get to the identified symbol.
   */
  public column: number

  /**
   * The number of rows to skip from the begining of the current document in order to get to the row that contain the identified symbol.
   */
  public row: number

  /**
   * The number of symbols to skip from the begining of the document in order to get to the identified symbol.
   */
  public symbol: number

  /**
   * Instantiate a new unidoc location in accordance with the given set of coordinates.
   *
   * @param [column = 0]
   * @param [row = 0]
   * @param [symbol = 0]
   * 
   * @see UnidocLocation.column
   * @see UnidocLocation.row
   * @see UnidocLocation.symbol
   */
  public constructor(column: number = 0, row: number = 0, symbol: number = 0) {
    this.column = column
    this.row = row
    this.symbol = symbol
  }

  /**
   * Move this location after the next non-linebreaking symbol.
   * 
   * @param [times = 1]
   * 
   * @return This instance for chaining purposes.
   */
  public next(times: number = 1): this {
    this.column += times
    this.symbol += times
    return this
  }

  /**
   * Move this location after the next linebreaking symbol.
   * 
   * @param [times = 1]
   * 
   * @return This instance for chaining purposes.
   */
  public break(times: number = 1): this {
    this.column = 0
    this.row += times
    this.symbol += times
    return this
  }

  /**
   * Update this location by adding the given values to the matching coordinates.
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
  public add(column: number, row: number, symbol: number): this {
    this.column += column
    this.row += row
    this.symbol += symbol

    return this
  }

  /**
   * Update this location by subtracting the given values to the matching coordinates.
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
  public subtract(column: number, row: number, symbol: number): this {
    this.column = column > this.column ? 0 : this.column - column
    this.row = row > this.row ? 0 : this.row - row
    this.symbol = symbol > this.symbol ? 0 : this.symbol - symbol

    return this
  }

  /**
   * Update this location by setting the matching coordinates to the given values.
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
  public set(column: number, row: number, symbol: number): this {
    this.column = column
    this.row = row
    this.symbol = symbol

    return this
  }

  /**
   * Update this location by setting the matching coordinate to the given value.
   * 
   * @return This instance for chaining purposes.
   * 
   * @see UnidocLocation.column
   */
  public setColumn(column: number): this {
    this.column = column
    return this
  }

  /**
   * Update this location by setting the matching coordinate to the given value.
   * 
   * @return This instance for chaining purposes.
   * 
   * @see UnidocLocation.row
   */
  public setRow(row: number): this {
    this.row = row
    return this
  }

  /**
   * Update this location by setting the matching coordinate to the given value.
   * 
   * @return This instance for chaining purposes.
   * 
   * @see UnidocLocation.symbol
   */
  public setSymbol(symbol: number): this {
    this.symbol = symbol
    return this
  }

  /**
   * @see DataObject.clone
   */
  public clone(): UnidocLocation {
    const result: UnidocLocation = new UnidocLocation()
    result.copy(this)
    return result
  }

  /**
   * @see DataObject.copy
   */
  public copy(toCopy: this): this {
    this.column = toCopy.column
    this.row = toCopy.row
    this.symbol = toCopy.symbol
    return this
  }

  /**
   * @see DataObject.clear
   */
  public clear(): this {
    this.column = 0
    this.row = 0
    this.symbol = 0
    return this
  }

  /**
   * @see Object.toString
   */
  public toString(): string {
    return `${this.column}:${this.row}/${this.symbol}`
  }

  /**
   * @see DataObject.equals
   */
  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocLocation) {
      return (
        other.column === this.column &&
        other.row === this.row &&
        other.symbol === this.symbol
      )
    }

    return false
  }

  /**
   * 
   */
  public *[Symbol.iterator](): Generator<number> {
    yield this.column
    yield this.row
    yield this.symbol
  }
}

/**
 * 
 */
export namespace UnidocLocation {
  /**
   * Instantiate a new unidoc location in accordance with the given set of coordinates.
   *
   * @param [column = 0]
   * @param [row = 0]
   * @param [symbol = 0]
   * 
   * @see UnidocLocation.column
   * @see UnidocLocation.row
   * @see UnidocLocation.symbol
   */
  export function create(column: number = 0, row: number = 0, symbol: number = 0): UnidocLocation {
    return new UnidocLocation(column, row, symbol)
  }

  /**
   * An allocator that allows to track a pool of objects for classes that want to optimize the overall memory usage.
   */
  export const ALLOCATOR: Duplicator<UnidocLocation> = Duplicator.fromFactory(create)
}
