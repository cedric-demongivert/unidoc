import { Duplicator, InstancePack, Sequence } from "@cedric-demongivert/gl-tool-collection"

import { DataObject } from "../DataObject"

import { UnidocSection } from "./UnidocSection"

/**
 * A path to a given location in a source of symbols.
 */
export class UnidocPath extends InstancePack<UnidocSection> implements DataObject<UnidocPath> {
  /**
   * 
   */
  public constructor(capacity: number = 8) {
    super(UnidocSection.DUPLICATOR, capacity)
  }

  /**
   * @see DataObject.clone
   */
  public clone(): UnidocPath {
    const result: UnidocPath = new UnidocPath(this.capacity)
    result.copy(this)
    return result
  }

  /**
   * 
   */
  public copy(path: Sequence<UnidocSection>): this {
    super.copy(path)
    return this
  }

  /**
  * @see Object.toString
  */
  public toString(): string {
    if (this.size > 0) {
      let result: string = this.first.toString()

      for (let index = 1; index < this.size; ++index) {
        result += ', ' + this.get(index).toString()
      }

      return result
    } else {
      return 'undefined origin'
    }
  }

  /**
  * @see DataObject.equals
  */
  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocPath) {
      if (other.size !== this.size) {
        return false
      }

      for (let index = 0, size = this.size; index < size; ++index) {
        if (!other.get(index).equals(this.get(index))) {
          return false
        }
      }

      return true
    }

    return false
  }
}

export namespace UnidocPath {
  /**
   * 
   */
  export function create(capacity: number = 8): UnidocPath {
    return new UnidocPath(capacity)
  }

  /**
   * 
   */
  export const DUPLICATOR: Duplicator<UnidocPath> = Duplicator.fromFactory(create)
}