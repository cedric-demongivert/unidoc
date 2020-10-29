import { UnidocLocation } from '../UnidocLocation'

import { UnidocOrigin } from './UnidocOrigin'
import { UnidocRangeOrigin } from './UnidocRangeOrigin'

/**
* An object that define a continuity between two origins as the origin of a unidoc value.
*/
export class UnidocRangeOriginBuilder {
  /**
  * Instance that is built.
  */
  public readonly state : UnidocRangeOrigin

  /**
  * Origin that is currently built.
  */
  private _builtOrigin : UnidocOrigin

  /**
  * Instantiate a new builder.
  *
  * @param [capacity = 8] - Starting capacity of the range origin to build.
  */
  public constructor (capacity : number = 8) {
    this.state = new UnidocRangeOrigin(capacity)
    this._builtOrigin = this.state.from
  }

  /**
  * Update the capacity of the underlying range origin.
  *
  * @param capacity - The new capacity of the underlying range origin.
  *
  * @return This builder instance for chaining purposes.
  */
  public capacity (capacity : number) : UnidocRangeOriginBuilder {
    this.state.reallocate(capacity)
    return this
  }

  /**
  * Start to define the from origin of the underlying range origin.
  *
  * @return This builder instance for chaining purposes.
  */
  public from () : UnidocRangeOriginBuilder
  /**
  * Copy the given origin as the starting point of the underlying range origin.
  *
  * @param value - A value to use as a starting point of the underlying range origin.
  *
  * @return This builder instance for chaining purposes.
  */
  public from (value : UnidocOrigin) : UnidocRangeOriginBuilder
  public from (value? : UnidocOrigin) : UnidocRangeOriginBuilder {
    if (value) {
      this.state.from.copy(value)
    } else {
      this._builtOrigin = this.state.from
    }

    return this
  }

  /**
  * Start to define the to origin of the underlying range origin.
  *
  * @return This builder instance for chaining purposes.
  */
  public to () : UnidocRangeOriginBuilder
  /**
  * Copy the given origin as the ending point of the underlying range origin.
  *
  * @param value - A value to use as an ending point of the underlying range origin.
  *
  * @return This builder instance for chaining purposes.
  */
  public to (value : UnidocOrigin) : UnidocRangeOriginBuilder
  public to (value? : UnidocOrigin) : UnidocRangeOriginBuilder {
    if (value) {
      this.state.to.copy(value)
    } else {
      this._builtOrigin = this.state.to
    }
    
    return this
  }

  /**
  * Add a runtime element to the part of the underlying range origin that is
  * currently built.
  *
  * @see UnidocOrigin.runtime
  *
  * @return This builder instance for chaining purposes.
  */
  public runtime () : UnidocRangeOriginBuilder {
    this._builtOrigin.runtime()
    return this
  }

  /**
  * Add a text element to the part of the underlying range origin that is
  * currently built.
  *
  * @see UnidocOrigin.text
  *
  * @return This builder instance for chaining purposes.
  */
  public text (line : number, column : number, character : number) : UnidocRangeOriginBuilder
  /**
  * Add a text element to the part of the underlying range origin that is
  * currently built.
  *
  * @see UnidocOrigin.text
  *
  * @return This builder instance for chaining purposes.
  */
  public text (location : UnidocLocation) : UnidocRangeOriginBuilder
  public text (a : any, b? : any, c? : any) : UnidocRangeOriginBuilder {
    this._builtOrigin.text(a, b, c)
    return this
  }

  /**
  * Add a buffer element to the part of the underlying range origin that is
  * currently built.
  *
  * @see UnidocOrigin.buffer
  *
  * @return This builder instance for chaining purposes.
  */
  public buffer (byte : number) : UnidocRangeOriginBuilder {
    this._builtOrigin.buffer(byte)
    return this
  }

  /**
  * Add a resource element to the part of the underlying range origin that is
  * currently built.
  *
  * @see UnidocOrigin.resource
  *
  * @return This builder instance for chaining purposes.
  */
  public resource (unifiedResourceIdentifier : string) : UnidocRangeOriginBuilder {
    this._builtOrigin.resource(unifiedResourceIdentifier)
    return this
  }

  /**
  * Add a network element to the part of the underlying range origin that is
  * currently built.
  *
  * @see UnidocOrigin.network
  *
  * @return This builder instance for chaining purposes.
  */
  public network (address : string) : UnidocRangeOriginBuilder {
    this._builtOrigin.network(address)
    return this
  }

  /**
  * Do nothing but may help to make things fancier.
  *
  * @return This builder instance for chaining purposes.
  */
  public at () : UnidocRangeOriginBuilder {
    return this
  }

  /**
  * Copy the given unidoc range origin.
  *
  * @param toCopy - A unidoc range origin to copy.
  *
  * @return This builder instance for chaining purposes.
  */
  public copy (toCopy : UnidocRangeOrigin) : UnidocRangeOriginBuilder
  /**
  * Make the range origin that is currently built copy the given unidoc
  * origin instance.
  *
  * @param toCopy - A unidoc origin to copy.
  *
  * @return This builder instance for chaining purposes.
  */
  public copy (toCopy : UnidocOrigin) : UnidocRangeOriginBuilder
  public copy (toCopy : UnidocRangeOriginBuilder) : UnidocRangeOriginBuilder
  public copy (toCopy : UnidocOrigin | UnidocRangeOrigin | UnidocRangeOriginBuilder) : UnidocRangeOriginBuilder {
    if (toCopy instanceof UnidocRangeOrigin) {
      this.state.copy(toCopy)
    } else if (toCopy instanceof UnidocRangeOriginBuilder) {
      this.state.copy(toCopy.state)
    } else {
      this._builtOrigin.copy(toCopy)
    }

    return this
  }

  public clone () : UnidocRangeOriginBuilder {
    const result : UnidocRangeOriginBuilder = new UnidocRangeOriginBuilder()

    result.copy(this)

    return result
  }

  /**
  * Clear this builder.
  *
  * @return This builder instance for chaining purposes.
  */
  public clear () : UnidocRangeOriginBuilder {
    this.state.clear()
    return this
  }

  public build () : UnidocRangeOrigin {
    const result : UnidocRangeOrigin = this.state.clone()

    this.state.clear()

    return result
  }

  /**
  * @see Object.equals
  */
  public equals (other : any) : boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocRangeOriginBuilder) {
      return this.state.equals(other.state)
    }

    return false
  }
}

export namespace UnidocRangeOriginBuilder {
  /**
  * Instantiate a new range origin.
  */
  export function create () : UnidocRangeOriginBuilder {
    return new UnidocRangeOriginBuilder()
  }
}
