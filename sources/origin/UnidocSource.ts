import { Duplicator } from "@cedric-demongivert/gl-tool-collection"
import { DataObject } from "../DataObject"

import { UnidocLocation } from "./UnidocLocation"
import { UnidocRange } from "./UnidocRange"

/**
 * The identification of a range of symbol in a source of symbols.
 */
export class UnidocOrigin implements DataObject {
  /**
   * The Unified Resource Identifier (URI) of the source.
   */
  public unifiedResourceIdentifier: string

  /**
   * The range of symbol in the source.
   */
  public readonly location: UnidocRange

  /**
   * 
   */
  public constructor(uri: string = UnidocOrigin.DEFAULT_URI, location?: UnidocRange | null | undefined) {
    this.unifiedResourceIdentifier = UnidocOrigin.DEFAULT_URI
    this.location = location ? location.clone() : new UnidocRange()
  }

  /**
   * 
   */
  public inMemory(name: string): this {
    this.unifiedResourceIdentifier = 'memory://' + name
    return this
  }

  /**
   * 
   */
  public inFile(path: string): this {
    this.unifiedResourceIdentifier = 'file://' + path
    return this
  }

  /**
   * 
   */
  public inURI(uri: string): this {
    this.unifiedResourceIdentifier = uri
    return this
  }

  /**
   * 
   */
  public setLocation(location: UnidocRange): this {
    this.location.copy(location)
    return this
  }

  /**
   * 
   */
  public atLocation(location: UnidocLocation): this {
    this.location.atLocation(location)
    return this
  }

  /**
   * 
   */
  public atCoordinates(column: number, row: number, symbol: number): this {
    this.location.atCoordinates(column, row, symbol)
    return this
  }

  /**
   * 
   */
  public fromLocation(location: UnidocLocation): this {
    this.location.fromLocation(location)
    return this
  }

  /**
   * 
   */
  public fromCoordinates(column: number = 0, row: number = 0, symbol: number = 0): this {
    this.location.fromCoordinates(column, row, symbol)
    return this
  }

  /**
   * 
   */
  public toLocation(location: UnidocLocation): this {
    this.location.toLocation(location)
    return this
  }

  /**
   * 
   */
  public toCoordinates(column: number = 0, row: number = 0, symbol: number = 0): this {
    this.location.toCoordinates(column, row, symbol)
    return this
  }

  /**
   * @see DataObject.clear
   */
  public clear(): this {
    this.unifiedResourceIdentifier = UnidocOrigin.DEFAULT_URI
    this.location.clear()
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
  public copy(toCopy: this): this {
    this.unifiedResourceIdentifier = toCopy.unifiedResourceIdentifier
    this.location.copy(toCopy.location)
    return this
  }

  /**
   * @see Object.toString
   */
  public toString(): string {
    return 'in ' + this.unifiedResourceIdentifier + ' ' + this.location.toString()
  }

  /**
   * @see DataObject.equals 
   */
  public equals(other: any): boolean {
    if (other == null) return false
    if (other == this) return true

    if (other instanceof UnidocOrigin) {
      return (
        other.unifiedResourceIdentifier === this.unifiedResourceIdentifier &&
        other.location.equals(this.location)
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
  export const DEFAULT_URI: string = 'memory://runtime'

  /**
   * 
   */
  export const DEFAULT: Readonly<UnidocOrigin> = new UnidocOrigin()

  /**
   * A factory that allows to instantiate UnidocOrigin instances
   */
  export function create(uri: string = DEFAULT_URI, location?: UnidocRange | null | undefined): UnidocOrigin {
    return new UnidocOrigin(uri, location)
  }


  /**
   * An allocator of UnidocOrigin instances.
   */
  export const ALLOCATOR: Duplicator<UnidocOrigin> = Duplicator.fromFactory(create)
}