import { Allocator } from '@cedric-demongivert/gl-tool-collection'

import { UnidocRangeOrigin } from '../origin/UnidocRangeOrigin'

const EMPTY_STRING: string = ''

export class UnidocImportation {
  public readonly origin: UnidocRangeOrigin
  public resource: string

  public constructor() {
    this.origin = new UnidocRangeOrigin(8)
    this.resource = EMPTY_STRING
  }

  public copy(toCopy: UnidocImportation): void {
    this.origin.copy(toCopy.origin)
    this.resource = toCopy.resource
  }

  public clone(): UnidocImportation {
    const result: UnidocImportation = new UnidocImportation()
    result.copy(this)
    return result
  }

  public clear(): void {
    this.origin.clear()
    this.resource = EMPTY_STRING
  }

  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocImportation) {
      return (
        other.origin.equals(this.origin) &&
        other.resource === this.resource
      )
    }

    return false
  }
}

export namespace UnidocImportation {
  /**
  * Return a deep copy of the given instance.
  *
  * @param toCopy - An instance to copy.
  *
  * @return A deep copy of the given instance.
  */
  export function copy(toCopy: UnidocImportation): UnidocImportation
  export function copy(toCopy: null): null
  export function copy(toCopy: undefined): undefined
  export function copy(toCopy: UnidocImportation | null | undefined): UnidocImportation | null | undefined {
    return toCopy == null ? toCopy : toCopy.clone()
  }

  /**
  * Return true if both object instances are equals.
  *
  * @param left - The first operand.
  * @param right - The second operand.
  *
  * @return True if both operand are equals.
  */
  export function equals(left?: UnidocImportation, right?: UnidocImportation): boolean {
    return left == null ? left == right : left.equals(right)
  }

  export function create(): UnidocImportation {
    return new UnidocImportation()
  }

  export const ALLOCATOR: Allocator<UnidocImportation> = Allocator.fromFactory(create)
}
