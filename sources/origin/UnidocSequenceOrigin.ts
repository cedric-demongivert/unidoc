import { Duplicator, Pack } from "@cedric-demongivert/gl-tool-collection"

import { DataObject } from "../DataObject"
import { UnidocOrigin } from "./UnidocOrigin"

// UnidocManyrigin
/**
 * The identification of a sequence of symbol from one or more sources.
 */
export class UnidocSequenceOrigin implements DataObject {
  /**
   * 
   */
  public readonly origins: Pack<UnidocOrigin>

  /**
   * 
   */
  public constructor(capacity: number = 2) {
    this.origins = Pack.instance(UnidocOrigin.ALLOCATOR, capacity)
  }

  /**
   * 
   */
  public push(origin: UnidocOrigin): this {
    const origins: Pack<UnidocOrigin> = this.origins

    if (origins.size > 0 && origins.last.isPreceding(origin)) {
      origins.last.range.end.copy(origin.range.end)
    } else {
      origins.push(origin)
    }

    return this
  }

  /**
   * 
   */
  public concat(other: UnidocSequenceOrigin): this {
    if (other.origins.size > 0) {
      const origins: Pack<UnidocOrigin> = this.origins
      const otherOrigins: Pack<UnidocOrigin> = other.origins

      if (origins.size > 0) {
        let index = 0

        if (origins.last.isPreceding(otherOrigins.first)) {
          origins.last.range.end.copy(otherOrigins.first.range.end)
          index += 1
        }

        for (let size = otherOrigins.size; index < size; ++index) {
          origins.push(otherOrigins.get(index))
        }

        return this
      } else {
        return this.copy(other)
      }
    }

    return this
  }

  /**
   * @see DataObject.clear
   */
  public clear(): this {
    this.origins.clear()
    return this
  }

  /**
   * @see DataObject.clone
   */
  public clone(): UnidocSequenceOrigin {
    return new UnidocSequenceOrigin().copy(this)
  }

  /**
   * @see DataObject.copy
   */
  public copy(toCopy: UnidocSequenceOrigin): this {
    this.origins.copy(toCopy.origins)
    return this
  }

  /**
   * @see Object.toString
   */
  public toString(): string {
    const origins: Pack<UnidocOrigin> = this.origins

    if (origins.size > 0) {
      let result: string = 'in ' + origins.first.toString() + ' ' + origins.first.toString()

      for (let index = 1, size = origins.size; index < size; ++index) {
        result += ', in ' + origins.first.toString() + ' ' + origins.first.toString()
      }

      return result
    } else {
      return 'of unknown origin'
    }
  }

  /**
   * @see DataObject.equals 
   */
  public equals(other: any): boolean {
    if (other == null) return false
    if (other == this) return true

    if (other instanceof UnidocSequenceOrigin) {
      return other.origins.equals(this.origins)
    }

    return false
  }
}

/**
 * 
 */
export namespace UnidocSequenceOrigin {
  /**
   * 
   */
  export const DEFAULT: Readonly<UnidocSequenceOrigin> = new UnidocSequenceOrigin()

  /**
   * A factory that allows to instantiate UnidocSequenceOrigin instances
   */
  export function create(): UnidocSequenceOrigin {
    return new UnidocSequenceOrigin()
  }


  /**
   * An allocator of UnidocSequenceOrigin instances.
   */
  export const ALLOCATOR: Duplicator<UnidocSequenceOrigin> = Duplicator.fromFactory(create)
}