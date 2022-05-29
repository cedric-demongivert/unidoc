import { Duplicator } from "@cedric-demongivert/gl-tool-collection"

import { DataObject } from "../DataObject"

import { UnidocLocation } from "./UnidocLocation"
import { UnidocRange } from "./UnidocRange"
import { UnidocURI } from "./UnidocURI"

/**
 * The identification of a range of symbol from one source.
 */
export class UnidocOrigin implements DataObject {
  /**
   * The source that contains the identified range of symbol.
   */
  public readonly source: UnidocURI

  /**
   * The coordinates of the identified range of symbol.
   */
  public readonly range: UnidocRange

  /**
   * 
   */
  public constructor(source?: UnidocURI | undefined, range?: UnidocRange | undefined) {
    this.source = source ? source.clone() : new UnidocURI()
    this.range = range ? range.clone() : new UnidocRange()
  }

  /**
   * 
   */
  public isPreceding(other: UnidocOrigin): boolean {
    return (
      this.source.equals(other.source) &&
      this.range.end.equals(other.range.start)
    )
  }

  /**
   * 
   */
  public isFollowing(other: UnidocOrigin): boolean {
    return (
      this.source.equals(other.source) &&
      this.range.start.equals(other.range.end)
    )
  }

  /**
   * Update the source that contains the identified range of symbol.
   * 
   * @param source - The new source that contains the identified range of symbol.
   * 
   * @return This instance for chaining purposes.
   */
  public setSource(source: UnidocURI): this {
    this.source.copy(source)
    return this
  }

  /**
   * @see UnidocRange.atCoordinates
   * 
   * @return This instance for chaining purposes.
   */
  public atCoordinates(column: number, row: number, symbol: number): this {
    this.range.atCoordinates(column, row, symbol)
    return this
  }

  /**
   * @see UnidocRange.atLocation
   * 
   * @return This instance for chaining purposes.
   */
  public atLocation(location: UnidocLocation): this {
    this.range.atLocation(location)
    return this
  }

  /**
   * @see UnidocRange.fromCoordinates
   * 
   * @return This instance for chaining purposes.
   */
  public fromCoordinates(column: number, row: number, symbol: number): this {
    this.range.fromCoordinates(column, row, symbol)
    return this
  }

  /**
   * @see UnidocRange.fromLocation
   * 
   * @return This instance for chaining purposes.
   */
  public fromLocation(location: UnidocLocation): this {
    this.range.fromLocation(location)
    return this
  }

  /**
   * @see UnidocRange.toCoordinates
   * 
   * @return This instance for chaining purposes.
   */
  public toCoordinates(column: number, row: number, symbol: number): this {
    this.range.toCoordinates(column, row, symbol)
    return this
  }

  /**
   * @see UnidocRange.toLocation
   * 
   * @return This instance for chaining purposes.
   */
  public toLocation(location: UnidocLocation): this {
    this.range.toLocation(location)
    return this
  }

  /**
   * @see DataObject.clear
   * 
   * @return This instance for chaining purposes.
   */
  public clear(): this {
    this.source.clear()
    this.range.clear()
    return this
  }

  /**
   * @see DataObject.clone
   */
  public clone(): UnidocOrigin {
    return new UnidocOrigin().copy(this)
  }

  /**
   * @see DataObject.copy
   */
  public copy(toCopy: UnidocOrigin): this {
    this.source.copy(toCopy.source)
    this.range.copy(toCopy.range)
    return this
  }

  /**
   * @see Object.toString
   */
  public toString(): string {
    return 'in ' + this.source.toString() + ' ' + this.range.toString()
  }

  /**
   * @see DataObject.equals 
   */
  public equals(other: any): boolean {
    if (other == null) return false
    if (other == this) return true

    if (other instanceof UnidocOrigin) {
      return (
        other.source.equals(this.source) &&
        other.range.equals(this.range)
      )
    }

    return false
  }
}

/**
 * 
 */
export namespace UnidocOrigin {
  /**
   * 
   */
  export const DEFAULT: Readonly<UnidocOrigin> = new UnidocOrigin()

  /**
   * A factory that allows to instantiate UnidocOrigin instances
   */
  export function create(source?: UnidocURI | undefined, range?: UnidocRange | undefined): UnidocOrigin {
    return new UnidocOrigin(source, range)
  }


  /**
   * An allocator of UnidocOrigin instances.
   */
  export const ALLOCATOR: Duplicator<UnidocOrigin> = Duplicator.fromFactory(create)
}