import { Duplicator } from '@cedric-demongivert/gl-tool-collection'
import { Empty } from 'sources/Empty'

import { UnidocRangeOrigin } from '../../origin/UnidocRangeOrigin'

/**
 * 
 */
export class UnidocImport {
  /**
   * 
   */
  public readonly origin: UnidocRangeOrigin

  /**
   * 
   */
  public protocol: string

  /**
   * 
   */
  public auth: string | undefined

  /**
   * 
   */
  public host: string | undefined

  /**
   * 
   */
  public port: string | undefined

  /**
   * 
   */
  public path: string

  /**
   * 
   */
  public query: string | undefined

  /**
   * 
   */
  public fragment: string | undefined

  /**
   * 
   */
  public mime: string

  /**
   * 
   */
  public constructor() {
    this.origin = new UnidocRangeOrigin(8)
    this.protocol = 'file'
    this.auth = undefined
    this.host = undefined
    this.port = undefined
    this.path = Empty.STRING
    this.query = undefined
    this.fragment = undefined
    this.mime = 'application/octet-stream'
  }

  /**
   * 
   */
  public copy(toCopy: UnidocImport): void {
    this.origin.copy(toCopy.origin)
    this.protocol = toCopy.protocol
    this.auth = toCopy.auth
    this.host = toCopy.host
    this.port = toCopy.port
    this.path = toCopy.path
    this.query = toCopy.query
    this.fragment = toCopy.fragment
    this.mime = toCopy.mime
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
    this.protocol = 'file'
    this.auth = undefined
    this.host = undefined
    this.port = undefined
    this.path = Empty.STRING
    this.query = undefined
    this.fragment = undefined
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
        other.protocol == this.protocol &&
        other.auth == this.auth &&
        other.host == this.host &&
        other.port == this.port &&
        other.path == this.path &&
        other.query == this.query &&
        other.fragment == this.fragment &&
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
