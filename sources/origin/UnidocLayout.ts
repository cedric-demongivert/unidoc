import { Duplicator, Pack } from "@cedric-demongivert/gl-tool-collection"

import { DataObject } from "../DataObject"
import { UnidocLocation } from "./UnidocLocation"
import { UnidocOrigin } from "./UnidocOrigin"

/**
 * The identification of a sequence of symbol from one or more sources.
 */
export class UnidocLayout implements DataObject<UnidocLayout> {
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
  public get first(): UnidocOrigin {
    return this.origins.first
  }

  /**
   * 
   */
  public get firstLocation(): UnidocLocation {
    return this.origins.first.range.start
  }

  /**
   * 
   */
  public get last(): UnidocOrigin {
    return this.origins.last
  }

  /**
   * 
   */
  public get lastLocation(): UnidocLocation {
    return this.origins.last.range.end
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
  public startOf(origin: UnidocLayout): this {
    if (origin.origins.size < 1) {
      this.origins.clear()
      return this
    }

    const origins: Pack<UnidocOrigin> = this.origins

    origins.clear()
    origins.push(origin.origins.first)

    const first: UnidocOrigin = origins.first
    first.atLocation(first.range.start)

    return this
  }

  /**
   * 
   */
  public endOf(origin: UnidocLayout): this {
    if (origin.origins.size < 1) {
      this.origins.clear()
      return this
    }

    const origins: Pack<UnidocOrigin> = this.origins

    origins.clear()
    origins.push(origin.origins.last)

    const first: UnidocOrigin = origins.first
    first.atLocation(first.range.end)

    return this
  }

  /**
   * 
   */
  public reduceToStart(): this {
    const origins: Pack<UnidocOrigin> = this.origins

    if (origins.size < 1) {
      return this
    }

    const first: UnidocOrigin = origins.first

    first.range.end.copy(first.range.start)
    origins.size = 1

    return this
  }

  /**
   * 
   */
  public reduceToEnd(): this {
    const origins: Pack<UnidocOrigin> = this.origins

    if (origins.size < 1) {
      return this
    }

    const first: UnidocOrigin = origins.first

    first.copy(origins.last)
    first.range.start.copy(first.range.end)
    origins.size = 1

    return this
  }

  /**
   * 
   */
  public concat(other: UnidocLayout): this {
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
  public clone(): UnidocLayout {
    return new UnidocLayout().copy(this)
  }

  /**
   * @see DataObject.copy
   */
  public copy(toCopy: UnidocLayout): this {
    this.origins.copy(toCopy.origins)
    return this
  }

  /**
   * @see Object.toString
   */
  public toString(): string {
    const origins: Pack<UnidocOrigin> = this.origins

    if (origins.size > 0) {
      let result: string = origins.first.toString()

      for (let index = 1, size = origins.size; index < size; ++index) {
        result += ', ' + origins.get(index).toString()
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

    if (other instanceof UnidocLayout) {
      return other.origins.equals(this.origins)
    }

    return false
  }
}

/**
 * 
 */
export namespace UnidocLayout {
  /**
   * 
   */
  export const EMPTY: Readonly<UnidocLayout> = new UnidocLayout()

  /**
   * A factory that allows to instantiate UnidocLayout instances
   */
  export function create(): UnidocLayout {
    return new UnidocLayout()
  }


  /**
   * An allocator of UnidocLayout instances.
   */
  export const ALLOCATOR: Duplicator<UnidocLayout> = Duplicator.fromFactory(create)
}