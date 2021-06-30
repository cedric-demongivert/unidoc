import { UnidocSymbolGenerator } from '../source/UnidocSymbolGenerator'

import { UnidocImportation } from './UnidocImportation'

const EMPTY_STRING: string = ''

/**
 * 
 */
export class UnidocResource {
  /**
   * 
   */
  public readonly origin: UnidocImportation

  /**
   * 
   */
  public resource: string

  /**
   * 
   */
  public reader: UnidocSymbolGenerator

  /**
   * 
   */
  public constructor() {
    this.origin = new UnidocImportation()
    this.resource = EMPTY_STRING
    this.reader = UnidocSymbolGenerator.fromNothing()
  }

  /**
   * 
   */
  public copy(toCopy: UnidocResource): void {
    this.origin.copy(toCopy.origin)
    this.resource = toCopy.resource
    this.reader = toCopy.reader
  }

  /**
   * 
   */
  public clone(): UnidocResource {
    const result: UnidocResource = new UnidocResource()
    result.copy(this)
    return result
  }

  /**
   * 
   */
  public clear(): void {
    this.origin.clear()
    this.resource = EMPTY_STRING
    this.reader = UnidocSymbolGenerator.fromNothing()
  }
}
