import { UnidocImport } from './UnidocImport'
import { UnidocResource } from './UnidocResource'

/**
 * 
 */
export interface UnidocImportResolver {
  /**
   * 
   */
  resolve(value: UnidocImport): Promise<UnidocResource> | UnidocResource
}
