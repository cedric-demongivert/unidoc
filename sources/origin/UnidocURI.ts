import { Duplicator, Pack } from "@cedric-demongivert/gl-tool-collection"
import { Empty } from "@cedric-demongivert/gl-tool-utils"

import { DataObject } from "../DataObject"
import { Optional } from "../Optional"

import { UnidocAuthority } from "./UnidocAuthority"

/**
 * A set of elements that loosely respect the RFC3986 and allows to identify any source of symbols.
 * 
 * @see https://datatracker.ietf.org/doc/html/rfc3986
 */
export class UnidocURI implements DataObject<UnidocURI> {
  /**
   * @see https://datatracker.ietf.org/doc/html/rfc3986#section-3.1
   */
  public scheme: string

  /**
   * @see https://datatracker.ietf.org/doc/html/rfc3986#section-3.2
   */
  public readonly authority: Optional<UnidocAuthority>

  /**
   * @see https://datatracker.ietf.org/doc/html/rfc3986#section-3.3
   */
  public identifier: string

  /**
   * @see https://datatracker.ietf.org/doc/html/rfc3986#section-3.4
   */
  public readonly query: Map<string, string>

  /**
   * @see https://datatracker.ietf.org/doc/html/rfc3986#section-3.5
   */
  public fragment: string | undefined

  /**
   * 
   */
  public constructor(scheme: string = UnidocURI.DEFAULT_SCHEME) {
    this.scheme = scheme
    this.authority = new Optional(new UnidocAuthority(), false)
    this.identifier = Empty.STRING
    this.query = new Map()
    this.fragment = undefined
  }

  /**
   * 
   */
  public asFile(path: string): this {
    this.clear()
    this.scheme = UnidocURI.FILE_SCHEME
    this.identifier = path
    return this
  }

  /**
   * 
   */
  public asRuntime(origin: Function | string): this {
    this.clear()
    this.scheme = UnidocURI.RUNTIME_SCHEME
    this.identifier = typeof origin === 'string' ? origin : origin.name || 'function'
    return this
  }

  /**
   * 
   */
  public setScheme(scheme: string): this {
    this.scheme = scheme
    return this
  }

  /**
   * 
   */
  public setAuthority(authority: UnidocAuthority | undefined): this {
    this.authority.set(authority)
    return this
  }

  /**
   * 
   */
  public deleteAuthority(): this {
    this.authority.delete()
    return this
  }

  /**
   * 
   */
  public setIdentifier(identifier: string): this {
    this.identifier = identifier
    return this
  }

  /**
   * 
   */
  public setQuery(queryToSet: Map<string, string>): this {
    const query: Map<string, string> = this.query

    query.clear()

    for (const [key, value] of queryToSet.entries()) {
      query.set(key, value)
    }

    return this
  }

  /**
   * 
   */
  public mergeQuery(queryToSet: Map<string, string>): this {
    const query: Map<string, string> = this.query

    for (const [key, value] of queryToSet.entries()) {
      query.set(key, value)
    }

    return this
  }

  /**
   * 
   */
  public deleteQuery(): this {
    this.query.clear()
    return this
  }

  /**
   * 
   */
  public setFragment(fragment: string | undefined): this {
    this.fragment = fragment
    return this
  }

  /**
   * 
   */
  public deleteFragment(): this {
    this.fragment = undefined
    return this
  }

  /**
   * @see DataObject.clear
   */
  public clear(): this {
    this.scheme = UnidocURI.DEFAULT_SCHEME
    this.authority.delete()
    this.identifier = Empty.STRING
    this.query.clear()
    this.fragment = undefined
    return this
  }

  /**
   * @see DataObject.clone
   */
  public clone(): UnidocURI {
    return new UnidocURI().copy(this)
  }

  /**
   * @see DataObject.copy
   */
  public copy(toCopy: this): this {
    this.scheme = toCopy.scheme
    this.authority.copy(toCopy.authority)
    this.identifier = toCopy.identifier
    this.setQuery(toCopy.query)
    this.fragment = toCopy.fragment
    return this
  }

  /**
   * @see Object.toString
   */
  public toString(): string {
    let result: string = this.scheme + '://'

    if (this.authority.isDefined()) {
      result += this.authority.get().toString() + '/'
    }

    result += this.identifier

    const query: Map<string, string> = this.query

    if (query.size > 0) {
      result += '?'
      const entries = query.entries()
      let nextEntry = entries.next()

      result += nextEntry.value[0]
      result += '='
      result += nextEntry.value[1]

      while (!(nextEntry = entries.next()).done) {
        result += '&'
        result += nextEntry.value[0]
        result += '='
        result += nextEntry.value[1]
      }
    }

    if (this.fragment) {
      result += '#'
      result += this.fragment
    }

    return result
  }

  /**
   * @see DataObject.equals 
   */
  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocURI) {
      if (this.query.size !== other.query.size) {
        return false
      }

      for (const [key, value] of this.query.entries()) {
        if (other.query.get(key) !== value) {
          return false
        }
      }

      return (
        this.scheme === other.scheme &&
        this.authority.equals(other.authority) &&
        this.identifier === other.identifier &&
        this.fragment === other.fragment
      )
    }

    return false
  }
}

/**
 * 
 */
export namespace UnidocURI {
  /**
   * 
   */
  export const DEFAULT: Readonly<UnidocURI> = Object.freeze(new UnidocURI())

  /**
   *
   */
  export const DEFAULT_SCHEME: string = 'memory'

  /**
   *
   */
  export const RUNTIME_SCHEME: string = 'runtime'

  /**
   *
   */
  export const FILE_SCHEME: string = 'file'

  /**
   * 
   */
  export function create(scheme: string = DEFAULT_SCHEME): UnidocURI {
    return new UnidocURI(scheme)
  }

  /**
   * 
   */
  export function runtime(origin: Function | string): UnidocURI {
    return new UnidocURI().asRuntime(origin)
  }

  /**
   * 
   */
  export function file(path: string): UnidocURI {
    return new UnidocURI().asFile(path)
  }

  /**
   * An allocator of UnidocOrigin instances.
   */
  export const ALLOCATOR: Duplicator<UnidocURI> = Duplicator.fromFactory(create)
}