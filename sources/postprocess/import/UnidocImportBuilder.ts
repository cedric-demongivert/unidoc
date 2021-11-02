
import { UnidocRangeOrigin } from 'sources/origin'
import { UnidocOrigin } from '../../origin/UnidocOrigin'

import { parse as parseURI } from 'uri-js'
import { getType as getMimeFromPath } from 'mime'

import { UnidocImport } from './UnidocImport'

/**
 * 
 */
export class UnidocImportBuilder {
  /**
   * 
   */
  private readonly _import: UnidocImport

  /**
   * 
   */
  public get protocol(): string {
    return this._import.protocol
  }

  /**
   * 
   */
  public get auth(): string | undefined {
    return this._import.auth
  }

  /**
   * 
   */
  public get host(): string | undefined {
    return this._import.host
  }

  /**
   * 
   */
  public get port(): string | undefined {
    return this._import.port
  }

  /**
   * 
   */
  public get path(): string {
    return this._import.path
  }

  /**
   * 
   */
  public get query(): string | undefined {
    return this._import.query
  }

  /**
   * 
   */
  public get fragment(): string | undefined {
    return this._import.fragment
  }

  /**
   * 
   */
  public get mime(): string {
    return this._import.mime
  }

  /**
   * 
   */
  public set protocol(protocol: string) {
    this._import.protocol = protocol
  }

  /**
   * 
   */
  public set auth(auth: string | undefined) {
    this._import.auth = auth
  }

  /**
   * 
   */
  public set host(host: string | undefined) {
    this._import.host = host
  }

  /**
   * 
   */
  public set port(port: string | undefined) {
    this._import.port = port
  }

  /**
   * 
   */
  public set path(path: string) {
    this._import.path = path
  }

  /**
   * 
   */
  public set query(query: string | undefined) {
    this._import.query = query
  }

  /**
   * 
   */
  public set fragment(fragment: string | undefined) {
    this._import.fragment = fragment
  }

  /**
   * 
   */
  public set mime(mime: string) {
    this._import.mime = mime
  }

  /**
   * 
   */
  public get origin(): UnidocRangeOrigin {
    return this._import.origin
  }

  /**
   * 
   */
  public set origin(origin: UnidocRangeOrigin) {
    this._import.origin.copy(origin)
  }

  /**
   * 
   */
  public get from(): UnidocOrigin {
    return this._import.origin.from
  }

  /**
   * 
   */
  public set from(origin: UnidocOrigin) {
    this._import.origin.from.copy(origin)
  }

  /**
   * 
   */
  public get to(): UnidocOrigin {
    return this._import.origin.from
  }

  /**
   * 
   */
  public set to(origin: UnidocOrigin) {
    this._import.origin.to.copy(origin)
  }

  /**
   * 
   */
  public constructor() {
    this._import = new UnidocImport()
  }

  /**
   * 
   */
  public setProtocol(protocol?: string | undefined): this {
    this._import.protocol = protocol || 'file'
    return this
  }

  /**
   * 
   */
  public setAuth(auth: string | undefined): this {
    this._import.auth = auth
    return this
  }

  /**
   * 
   */
  public setHost(host: string | undefined): this {
    this._import.host = host
    return this
  }

  /**
   * 
   */
  public setPort(port: string | number | undefined): this {
    this._import.port = typeof port === 'number' ? (port << 0).toString() : port
    return this
  }

  /**
   * 
   */
  public setPath(path: string): this {
    this._import.path = path
    return this
  }

  /**
   * 
   */
  public setQuery(query: string | undefined): this {
    this._import.query = query
    return this
  }

  /**
   * 
   */
  public setFragment(fragment: string | undefined): this {
    this._import.fragment = fragment
    return this
  }

  /**
   * 
   */
  public setMime(mime: string): this {
    this._import.mime = mime
    return this
  }

  /**
   * 
   */
  public setOrigin(origin: UnidocOrigin): this {
    this._import.origin.from.copy(origin)
    this._import.origin.to.copy(origin)
    return this
  }

  /**
   * 
   */
  public setFrom(origin: UnidocOrigin): this {
    this._import.origin.from.copy(origin)
    return this
  }

  /**
   * 
   */
  public setTo(origin: UnidocOrigin): this {
    this._import.origin.to.copy(origin)
    return this
  }

  /**
   * 
   */
  public fromURI(URI: string): this {
    const parsedURI: any = parseURI(URI)
    const unidocImport: UnidocImport = this._import

    unidocImport.protocol = parsedURI.scheme || 'file'
    unidocImport.auth = parsedURI.auth
    unidocImport.host = parsedURI.host
    unidocImport.port = parsedURI.port
    unidocImport.path = parsedURI.path
    unidocImport.query = parsedURI.query
    unidocImport.fragment = parsedURI.fragment

    if (parsedURI.path.endsWith('.unidoc')) {
      unidocImport.mime = 'text/unidoc'
    } else {
      unidocImport.mime = getMimeFromPath(parsedURI.path) || 'application/octet-stream'
    }

    return this
  }

  /**
   * 
   */
  public get(): UnidocImport {
    return this._import
  }

  /**
   * 
   */
  public build(): UnidocImport {
    return this._import.clone()
  }

  /**
   * 
   */
  public clear(): this {
    this._import.clear()
    return this
  }
}

/**
 * 
 */
export namespace UnidocImportBuilder {
  /**
   * 
   */
  export function create(): UnidocImportBuilder {
    return new UnidocImportBuilder()
  }
}
