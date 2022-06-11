import { UnidocURI } from '../origin'
import { UnidocSymbol } from '../symbol'
import { UnidocImport } from './UnidocImport'
import { UnidocIteratorResource } from './UnidocIteratorResource'

/**
 * 
 */
export interface UnidocResource {
  /**
   * 
   */
  readonly origin: UnidocURI

  /**
   * 
   */
  readonly import: UnidocImport

  /**
   * 
   */
  hasNext(): boolean

  /**
   * 
   */
  next(): UnidocSymbol | undefined
}

/**
 * 
 */
export namespace UnidocResource {
  /**
   * 
   */
  export const fromIterator = UnidocIteratorResource.create
}