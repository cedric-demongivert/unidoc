import { Duplicator } from "@cedric-demongivert/gl-tool-collection"
import { DataObject } from "../DataObject"

/**
 * An implementation of the Section 3.2 of RFC3986 for describing an authority.
 * 
 * @see https://datatracker.ietf.org/doc/html/rfc3986#section-3.2
 */
export class UnidocAuthority implements DataObject {
  /**
   * @see https://datatracker.ietf.org/doc/html/rfc3986#section-3.2.2
   */
  public host: string

  /**
   * @see https://datatracker.ietf.org/doc/html/rfc3986#section-3.2.1
   */
  public userInfo: string | undefined

  /**
   * @see https://datatracker.ietf.org/doc/html/rfc3986#section-3.2.3
   */
  public port: number | undefined

  /**
   * Instantiate a new authority.
   * 
   * @param [host=UnidocAuthority.DEFAULT_HOST]
   * 
   * @see https://datatracker.ietf.org/doc/html/rfc3986#section-3.2.2
   */
  public constructor(host: string = UnidocAuthority.DEFAULT_HOST) {
    this.host = host
    this.userInfo = undefined
    this.port = undefined
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
   * @see DataObject.clear
   */
  public clear(): this {
    this.host = UnidocAuthority.DEFAULT_HOST
    this.userInfo = undefined
    this.port = undefined
    return this
  }

  /**
   * @see DataObject.clone
   */
  public clone(): UnidocAuthority {
    return new UnidocAuthority().copy(this)
  }

  /**
   * @see DataObject.copy
   */
  public copy(toCopy: UnidocAuthority): this {
    this.host = toCopy.host
    this.userInfo = toCopy.userInfo
    this.port = toCopy.port
    return this
  }

  /**
   * @see Object.toString
   */
  public toString(): string {
    return (this.userInfo == null ? '' : this.userInfo + '@') + this.host + (this.port == null ? '' : ':' + this.port.toString())
  }

  /**
   * @see DataObject.equals 
   */
  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocAuthority) {
      return (
        other.host === this.host &&
        other.userInfo === this.userInfo &&
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
  export const LOOPBACK: Readonly<UnidocAuthority> = new UnidocAuthority('127.0.0.1')

  /**
   * 
   */
  export function create(host: string = DEFAULT_HOST): UnidocAuthority {
    return new UnidocAuthority(DEFAULT_HOST)
  }


  /**
   * 
   */
  export const ALLOCATOR: Duplicator<UnidocAuthority> = Duplicator.fromFactory(create)
}