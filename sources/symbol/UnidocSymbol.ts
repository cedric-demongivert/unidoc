import { Allocator } from '@cedric-demongivert/gl-tool-collection'

import { UnidocRangeOrigin } from '../origin/UnidocRangeOrigin'

import { CodePoint } from './CodePoint'

/**
* A symbol of a unidoc document.
*/
export class UnidocSymbol {
  /**
  * Unicode code point of the symbol.
  */
  public symbol: CodePoint

  /**
  * Origin of this symbol. If the origin is a range the begining is the
  * including starting location of the symbol and the termination is the
  * excluding ending location of this symbol.
  */
  public readonly origin: UnidocRangeOrigin

  /**
  * Instantiate a new empty unidoc symbol.
  */
  public constructor() {
    this.symbol = 0
    this.origin = new UnidocRangeOrigin(4).runtime()
  }

  /**
  * Update the underlying symbol.
  *
  * @param symbol - The new underlying symbol as a unidoc code point.
  *
  * @return This symbol instance for chaining purposes.
  */
  public setSymbol(symbol: CodePoint): UnidocSymbol {
    this.symbol = symbol
    return this
  }

  /**
  * Update the origin of this symbol.
  *
  * @param origin - The new origin of this symbol.
  *
  * @return This symbol instance for chaining purposes.
  */
  public setOrigin(origin: UnidocRangeOrigin): UnidocSymbol {
    this.origin.copy(origin)
    return this
  }

  /**
  * Copy an existing unidoc symbol.
  *
  * @param toCopy - An existing unidoc symbol to copy.
  */
  public copy(toCopy: UnidocSymbol): void {
    this.symbol = toCopy.symbol
    this.origin.copy(toCopy.origin)
  }

  /**
  * @return A copy of this symbol.
  */
  public clone(): UnidocSymbol {
    const result: UnidocSymbol = new UnidocSymbol()
    result.copy(this)
    return result
  }

  /**
  * Reset this instance to it's initial state.
  */
  public clear(): void {
    this.symbol = 0
    this.origin.clear()
    this.origin.runtime()
  }

  /**
  * @see Object.toString
  */
  public toString(): string {
    let result: string = 'symbol('

    result += CodePoint.toDebugString(this.symbol)
    result += ') '
    result += this.origin.toString()

    return result
  }

  /**
  * @see Object.equals
  */
  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocSymbol) {
      return other.symbol === this.symbol &&
        other.origin.equals(this.origin)
    }

    return false
  }
}

export namespace UnidocSymbol {
  /**
  * Return true if the given instances of unidoc symbol are equals.
  *
  * @param left - The instance to use as a left operand.
  * @param right - The instance to use as a right operand.
  *
  * @return True if both operands are equals.
  */
  export function equals(left: UnidocSymbol | null, right: UnidocSymbol | null): boolean {
    return left == null ? left === right : left.equals(right)
  }

  /**
  * Instantiate and initialize a symbol.
  *
  * @param [symbol = 0] - The unicode symbol to wrap.
  * @param [origin = UnidocRangeOrigin.runtime()] - The origin of the symbol.
  *
  * @return The requested unidoc symbol instance.
  */
  export function create(symbol: CodePoint = 0, origin: UnidocRangeOrigin = UnidocRangeOrigin.runtime()): UnidocSymbol {
    return new UnidocSymbol().setSymbol(symbol).setOrigin(origin)
  }

  export function copy(toCopy: undefined): undefined
  export function copy(toCopy: null): null
  export function copy(toCopy: UnidocSymbol): UnidocSymbol
  /**
  * Copy the given instance of unidoc symbol.
  *
  * @param toCopy - The instance of unidoc symbol to copy.
  *
  * @return A copy of the given instance.
  */
  export function copy(toCopy: UnidocSymbol | null | undefined): UnidocSymbol | null | undefined {
    return toCopy == null ? toCopy : toCopy.clone()
  }

  /**
  * An allocator of unidoc symbol instances.
  */
  export const ALLOCATOR: Allocator<UnidocSymbol> = Allocator.fromFactory(create)
}
