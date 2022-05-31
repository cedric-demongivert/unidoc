import { Duplicator } from "@cedric-demongivert/gl-tool-collection"

import { DataObject } from "../DataObject"

/**
 * An implementation of the Section 3.2 of RFC3986 for describing an authority.
 * 
 * @see https://datatracker.ietf.org/doc/html/rfc3986#section-3.2
 */
export class UnidocAuthority implements DataObject<UnidocAuthority> {
  /**
   * @see https://datatracker.ietf.org/doc/html/rfc3986#section-3.2.1
   */
  public userInfo: string | undefined

  /**
   * @see https://datatracker.ietf.org/doc/html/rfc3986#section-3.2.2
   */
  public host: string

  /**
   * @see https://datatracker.ietf.org/doc/html/rfc3986#section-3.2.3
   */
  public port: number | undefined

  /**
   * Instantiate a new authority.
   * 
   * @param [userInfo]
   * @param [host=UnidocAuthority.DEFAULT_HOST]
   * @param [port]
   * 
   * @see https://datatracker.ietf.org/doc/html/rfc3986#section-3.2.2
   */
  public constructor(userInfo?: string | undefined, host: string = UnidocAuthority.DEFAULT_HOST, port?: number | undefined) {
    this.userInfo = userInfo
    this.host = host
    this.port = port
  }

  /**
   * 
   */
  public setUserInfo(userInfo: string | undefined): this {
    this.userInfo = userInfo
    return this
  }

  /**
   * 
   */
  public deleteUserInfo(): this {
    this.userInfo = undefined
    return this
  }

  /**
   * 
   */
  public setHost(host: string): this {
    this.host = host
    return this
  }

  /**
   * 
   */
  public setPort(port: number | undefined): this {
    this.port = port
    return this
  }

  /**
   * 
   */
  public deletePort(): this {
    this.port = undefined
    return this
  }

  /**
   * @see Clearable.prototype.clear
   */
  public clear(): this {
    this.userInfo = undefined
    this.host = UnidocAuthority.DEFAULT_HOST
    this.port = undefined
    return this
  }

  /**
   * @see Clonable.prototype.clone
   */
  public clone(): UnidocAuthority {
    return new UnidocAuthority().copy(this)
  }

  /**
   * 
   */
  public copy(toCopy: Readonly<UnidocAuthority>): this {
    this.userInfo = toCopy.userInfo
    this.host = toCopy.host
    this.port = toCopy.port
    return this
  }

  /**
   * @see Object.prototype.toString
   */
  public toString(): string {
    return (this.userInfo == null ? '' : this.userInfo + '@') + this.host + (this.port == null ? '' : ':' + this.port.toString())
  }

  /**
   * @see Comparable.prototype.equals 
   */
  public equals(other: unknown): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocAuthority) {
      return (
        other.userInfo === this.userInfo &&
        other.host === this.host &&
        other.port === this.port
      )
    }

    return false
  }
}

/**
 * 
 */
export namespace UnidocAuthority {
  /**
   * 
   */
  export const DEFAULT_HOST: string = '127.0.0.1'

  /**
   * 
   */
  export const LOOPBACK: Readonly<UnidocAuthority> = Object.freeze(new UnidocAuthority(undefined, DEFAULT_HOST))

  /**
   * 
   */
  export function create(userInfo?: string | undefined, host: string = DEFAULT_HOST, port?: number | undefined): UnidocAuthority {
    return new UnidocAuthority(userInfo, host, port)
  }

  /**
   * 
   */
  export const ALLOCATOR: Duplicator<UnidocAuthority> = Duplicator.fromFactory(create)
}