import { Duplicator } from '@cedric-demongivert/gl-tool-collection'

import { DataObject } from '../DataObject'
import { Random } from '../Random'

/**
* The location of a symbol in a unidoc document.
*/
export class UnidocLocation implements DataObject {
  /**
  * The zero location.
  */
  public static ZERO: UnidocLocation = new UnidocLocation(0, 0, 0)

  /**
  * A document column.
  */
  public column: number

  /**
  * A document line.
  */
  public line: number

  /**
  * A document symbol.
  */
  public index: number

  /**
  * Instantiate a new unidoc location.
  *
  * @param [column = 0] - Document column.
  * @param [line = 0] - Document line.
  * @param [index = 0] - Buffer index.
  */
  public constructor(column: number = 0, line: number = 0, index: number = 0) {
    this.column = column
    this.line = line
    this.index = index
  }

  /**
  * Update this location by adding the given columns, lines and indices.
  *
  * @param column - Columns to add.
  * @param line - Lines to add.
  * @param index - Indices to add.
  * 
  * @return This instance for chaining purposes.
  */
  public add(column: number, line: number, index: number): this {
    this.column += column
    this.line += line
    this.index += index

    return this
  }

  /**
  * Update this location by subtracting the given columns, lines and indices.
  *
  * @param column - Columns to subtract.
  * @param line - Lines to subtract.
  * @param index - Indices to subtract.
  * 
  * @return This instance for chaining purposes.
  */
  public subtract(column: number, line: number, index: number): this {
    this.column = column > this.column ? 0 : this.column - column
    this.line = line > this.line ? 0 : this.line - line
    this.index = index > this.index ? 0 : this.index - index

    return this
  }

  /**
  * Update this location.
  *
  * @param column - Document column.
  * @param line - Document line.
  * @param index - Buffer index.
  * 
  * @return This instance for chaining purposes.
  */
  public set(line: number, column: number, index: number): this {
    this.column = column
    this.line = line
    this.index = index
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
    this.line = toCopy.line
    this.index = toCopy.index
    return this
  }

  /**
  * @see DataObject.clear
  */
  public clear(): this {
    this.column = 0
    this.line = 0
    this.index = 0
    return this
  }

  /**
  * @see Object.toString
  */
  public toString(): string {
    return `${this.column}:${this.line}/${this.index}`
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
        other.line === this.line &&
        other.index === this.index
      )
    }

    return false
  }
}

/**
 * 
 */
export namespace UnidocLocation {
  /**
   * 
   */
  export function create(line: number = 0, column: number = 0, index: number = 0): UnidocLocation {
    return new UnidocLocation(line, column, index)
  }

  /**
   * 
   */
  export const ALLOCATOR: Duplicator<UnidocLocation> = Duplicator.fromFactory(create)
}
