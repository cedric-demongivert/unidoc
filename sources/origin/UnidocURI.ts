import { Duplicator, Pack } from "@cedric-demongivert/gl-tool-collection"

import { Comparable } from "../Comparable"
import { DataObject } from "../DataObject"

import { UnidocAuthority } from "./UnidocAuthority"

/**
 * A set of elements that loosely respect the RFC3986 and allows to identify any source of symbols.
 * 
 * @see https://datatracker.ietf.org/doc/html/rfc3986
 */
export class UnidocURI implements DataObject {
  /**
   * @see https://datatracker.ietf.org/doc/html/rfc3986#section-3.1
   */
  public scheme: string

  /**
   * @see https://datatracker.ietf.org/doc/html/rfc3986#section-3.2
   */
  public authority: UnidocAuthority | undefined

  /**
   * @see https://datatracker.ietf.org/doc/html/rfc3986#section-3.3
   */
  public readonly path: Pack<string>

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
    this.authority = undefined
    this.path = Pack.any(4)
    this.query = new Map()
    this.fragment = undefined
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
    this.authority = authority
    return this
  }

  /**
   * 
   */
  public deleteAuthority(): this {
    this.authority = undefined
    return this
  }

  /**
   * 
   */
  public pushPath(element: string): this {
    this.path.push(element)
    return this
  }

  /**
   * 
   */
  public setPath(pathToSet: Iterable<string>): this {
    const path: Pack<string> = this.path

    path.clear()

    for (const element of pathToSet) {
      path.push(element)
    }

    return this
  }

  /**
   * 
   */
  public appendPath(pathToAppend: Iterable<string>): this {
    const path: Pack<string> = this.path

    for (const element of pathToAppend) {
      path.push(element)
    }

    return this
  }

  /**
   * 
   */
  public deletePath(): this {
    this.path.clear()
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
    this.authority = undefined
    this.path.clear()
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
    this.authority = toCopy.authority
    this.path.copy(toCopy.path)
    this.setQuery(toCopy.query)
    this.fragment = toCopy.fragment
    return this
  }

  /**
   * @see Object.toString
   */
  public toString(): string {
    let result: string = this.scheme + '://'

    if (this.authority) {
      result += this.authority.toString() + '/'
    }

    const path: Pack<string> = this.path

    if (path.size > 0) {
      result += path.get(0)

      for (let index = 1, size = path.size; index < size; ++index) {
        result += '/'
        result += path.get(index)
      }
    }

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
        Comparable.equals(this.authority, other.authority) &&
        this.path.equals(other.path) &&
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
  export const DEFAULT_SCHEME: string = 'memory'

  /**
   * 
   */
  export function create(scheme: string = DEFAULT_SCHEME): UnidocURI {
    return new UnidocURI(scheme)
  }


  /**
   * An allocator of UnidocOrigin instances.
   */
  export const ALLOCATOR: Duplicator<UnidocURI> = Duplicator.fromFactory(create)
}