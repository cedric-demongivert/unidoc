import { Duplicator } from '@cedric-demongivert/gl-tool-collection'
import { Empty } from '@cedric-demongivert/gl-tool-utils'

import { UnidocLayout } from '../../origin'
import { UnidocImportScheme } from './UnidocImportScheme'

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
  public scheme: string

  /**
   * 
   */
  public identifier: string

  /**
   * 
   */
  public mime: string

  /**
   * 
   */
  public constructor() {
    this.origin = new UnidocLayout()
    this.scheme = UnidocImportScheme.FILE
    this.identifier = Empty.STRING
    this.mime = UnidocImport.OCTET_STREAM_MIME
  }

  /**
   * 
   */
  public setScheme(scheme: string): this {
    this.scheme = UnidocImportScheme.get(scheme)
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
  public setMime(mime: string): this {
    this.mime = mime
    return this
  }

  /**
   * 
   */
  public setOrigin(origin: UnidocLayout): this {
    this.origin.copy(origin)
    return this
  }

  /**
   * 
   */
  public copy(toCopy: UnidocImport): this {
    this.origin.copy(toCopy.origin)
    this.scheme = toCopy.scheme
    this.identifier = toCopy.identifier
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
    this.scheme = UnidocImportScheme.FILE
    this.identifier = Empty.STRING
    this.mime = UnidocImport.OCTET_STREAM_MIME
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
        other.scheme === this.scheme &&
        other.identifier === this.identifier &&
        other.mime == this.mime
      )
    }

    return false
  }

  /**
   * 
   */
  public toString(): string {
    return `${this.constructor.name} ${this.scheme}://${this.identifier} as ${this.mime} from ${this.origin.toString()}`
  }
}

export namespace UnidocImport {
  /**
   * 
   */
  export const OCTET_STREAM_MIME: 'application/octet-stream' = 'application/octet-stream'

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
