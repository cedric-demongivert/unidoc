import { UnidocURI } from '../origin'
import { UnidocSymbol } from '../symbol'
import { UnidocImport } from './UnidocImport'

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
