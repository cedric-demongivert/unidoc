import { Duplicator } from '@cedric-demongivert/gl-tool-collection'

import { UnidocPath } from '../origin/UnidocPath'

import { DataObject } from '../DataObject'

import { UTF16CodeUnit } from './UTF16CodeUnit'
import { UTF32CodeUnit } from './UTF32CodeUnit'

/**
 * A symbol of an unidoc document.
 */
export class UnidocSymbol implements DataObject {
  /**
   * UTF-32 code unit of the symbol.
   */
  public code: UTF32CodeUnit

  /**
   * Origin of this symbol in the underlying source of symbol.
   */
  public readonly origin: UnidocPath

  /**
   * Instantiate a new null symbol of unknown origin.
   * 
   * @see DataObject
   */
  public constructor() {
    this.code = UTF32CodeUnit.NULL
    this.origin = new UnidocPath()
  }

  /**
   * Update the symbol's UTF-32 code unit.
   *
   * @param symbol - The new symbol's UTF-32 code unit.
   *
   * @return This symbol instance for chaining purposes.
   */
  public setSymbol(symbol: UTF32CodeUnit): this {
    this.code = symbol
    return this
  }

  /**
   * Update the origin of this symbol.
   *
   * @param origin - The new origin of this symbol.
   *
   * @return This symbol instance for chaining purposes.
   */
  public setOrigin(origin: UnidocPath): this {
    this.origin.copy(origin)
    return this
  }

  /**
   * @see DataObject.copy
   */
  public copy(toCopy: this): this {
    this.code = toCopy.code
    this.origin.copy(toCopy.origin)
    return this
  }

  /**
  * @see DataObject.clone
  */
  public clone(): UnidocSymbol {
    const result: UnidocSymbol = new UnidocSymbol()
    result.copy(this)
    return result
  }

  /**
  * @see DataObject.clear
  */
  public clear(): this {
    this.code = UTF32CodeUnit.NULL
    this.origin.clear()
    return this
  }

  /**
  * @see DataObject.toString
  */
  public toString(): string {
    return (
      this.constructor.name + ' ' + UTF32CodeUnit.toDebugString(this.code) + ' ' + this.origin.toString()
    )
  }

  /**
  * @see DataObject.equals
  */
  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocSymbol) {
      return (
        other.code === this.code &&
        other.origin.equals(this.origin)
      )
    }

    return false
  }
}

export namespace UnidocSymbol {
  /**
   * Instantiate and initialize a symbol.
   *
   * @param [symbol = UTF32CodeUnit.NULL] - The unicode symbol to wrap.
   * @param [origin = UnidocPath.create()] - The origin of the symbol.
   *
   * @return The requested unidoc symbol instance.
   */
  export function create(symbol: UTF16CodeUnit = UTF32CodeUnit.NULL, origin: UnidocPath = UnidocPath.create()): UnidocSymbol {
    return new UnidocSymbol().setSymbol(symbol).setOrigin(origin)
  }

  /**
   * An allocator of unidoc symbol instances.
   */
  export const ALLOCATOR: Duplicator<UnidocSymbol> = Duplicator.fromFactory(create)
}
