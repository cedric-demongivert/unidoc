import { Allocator } from '@cedric-demongivert/gl-tool-collection'

import { UnidocPath } from '../path/UnidocPath'
import { CodePoint } from '../CodePoint'
import { UnidocLocation } from '../UnidocLocation'

/**
* A symbol of a unidoc document.
*/
export class UnidocSymbol {
  public symbol : CodePoint
  public readonly location : UnidocPath

  /**
  * Instantiate a new empty unidoc symbol.
  */
  public constructor () {
    this.symbol = 0
    this.location = new UnidocPath(2)
  }

  /**
  * Copy an existing unidoc symbol.
  *
  * @param toCopy - An existing unidoc symbol to copy.
  */
  public copy (toCopy : UnidocSymbol) : void {
    this.symbol = toCopy.symbol
    this.location.copy(toCopy.location)
  }

  /**
  * @return A copy of this symbol.
  */
  public clone () : UnidocSymbol {
    const result : UnidocSymbol = new UnidocSymbol()
    result.copy(this)
    return result
  }

  /**
  * Reset this instance to it's initial state.
  */
  public clear () : void {
    this.symbol = 0
    this.location.clear()
  }

  /**
  * @see Object.toString
  */
  public toString () : string {
    let result : string = 'symbol('

    result += CodePoint.toDebugString(this.symbol)
    result += ') in '
    result += this.location.toString()

    return result
  }

  /**
  * @see Object.equals
  */
  public equals (other : any) : boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocSymbol) {
      return other.symbol === this.symbol &&
             other.location.equals(this.location)
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
  export function equals (left : UnidocSymbol | null, right : UnidocSymbol | null) : boolean {
    return left == null ? left === right : left.equals(right)
  }

  /**
  * Create an instance of unidoc symbol extracted from memory by using the given
  * configuration string.
  *
  * @param configuration - Configuration to map to an instance of unidoc symbol.
  *
  * @return An instance of unidoc symbol in accordance with the given configuration.
  */
  export function fromMemory (configuration : string) : UnidocSymbol {
    const codePoint : CodePoint | undefined = configuration.codePointAt(0)
    const location : UnidocLocation = (
      UnidocLocation.fromString(configuration.substr(1))
    )

    if (codePoint == null) {
      throw new Error('Unable to extract unidoc symbol from "' + configuration + '".')
    } else {
      return create(codePoint, UnidocPath.create(1).pushMemory(location))
    }
  }

  /**
  * Instantiate and initialize a symbol.
  *
  * @param [symbol = 0] - The unicode symbol to wrap.
  * @param [path = UnidocPath.EMPTY] - The location of the symbol.
  *
  * @return The requested unidoc symbol instance.
  */
  export function create (symbol : CodePoint = 0, location : UnidocPath = UnidocPath.EMPTY) : UnidocSymbol {
    const result : UnidocSymbol = new UnidocSymbol()
    result.symbol = symbol
    result.location.copy(location)

    return result
  }

  export function copy (toCopy : undefined) : undefined
  export function copy (toCopy : null) : null
  export function copy (toCopy : UnidocSymbol) : UnidocSymbol
  /**
  * Copy the given instance of unidoc symbol.
  *
  * @param toCopy - The instance of unidoc symbol to copy.
  *
  * @return A copy of the given instance.
  */
  export function copy (toCopy : UnidocSymbol | null | undefined) : UnidocSymbol | null | undefined {
    return toCopy == null ? toCopy : toCopy.clone()
  }

  /**
  * An allocator of unidoc symbol instances.
  */
  export const ALLOCATOR : Allocator<UnidocSymbol> = {
    /**
    * @see Allocator.copy
    */
    allocate () : UnidocSymbol {
      return new UnidocSymbol()
    },

    /**
    * @see Allocator.copy
    */
    copy (source : UnidocSymbol, destination : UnidocSymbol) : void {
      destination.copy(source)
    },

    /**
    * @see Allocator.clear
    */
    clear (instance : UnidocSymbol) : void {
      instance.clear()
    }
  }
}
