import { Duplicator } from '@cedric-demongivert/gl-tool-collection'
import { Empty } from '@cedric-demongivert/gl-tool-utils'

import { UnidocLayout, UnidocURI } from '../../origin'

/**
 * 
 */
export class UnidocImport {
  /**
   * 
   */
  public readonly origin: UnidocLayout

  /**
   * 
   */
  public readonly uri: UnidocURI

  /**
   * 
   */
  public mime: string

  /**
   * 
   */
  public constructor() {
    this.origin = new UnidocLayout()
    this.uri = new UnidocURI()
    this.mime = 'application/octet-stream'
  }

  /**
   * 
   */
  public copy(toCopy: UnidocImport): this {
    this.origin.copy(toCopy.origin)
    this.uri.copy(toCopy.uri)
    this.mime = toCopy.mime
    return this
  }

  /**
   * 
   */
  public clone(): UnidocImport {
    const result: UnidocImport = new UnidocImport()
    result.copy(this)
    return result
  }

  /**
   * 
   */
  public clear(): void {
    this.origin.clear()
    this.uri.clear()
    this.mime = 'application/octet-stream'
  }

  /**
   * 
   */
  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocImport) {
      return (
        other.origin.equals(this.origin) &&
        other.uri.equals(this.uri) &&
        other.mime == this.mime
      )
    }

    return false
  }
}

export namespace UnidocImport {
  /**
  * Return a deep copy of the given instance.
  *
  * @param toCopy - An instance to copy.
  *
  * @return A deep copy of the given instance.
  */
  export function copy(toCopy: UnidocImport): UnidocImport
  /**
   * 
   */
  export function copy(toCopy: null): null
  /**
   * 
   */
  export function copy(toCopy: undefined): undefined
  /**
   * 
   */
  export function copy(toCopy: UnidocImport | null | undefined): UnidocImport | null | undefined {
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
  export function equals(left?: UnidocImport, right?: UnidocImport): boolean {
    return left == null ? left == right : left.equals(right)
  }

  /**
   * 
   */
  export function create(): UnidocImport {
    return new UnidocImport()
  }

  /**
   * 
   */
  export const ALLOCATOR: Duplicator<UnidocImport> = Duplicator.fromFactory(create)
}
