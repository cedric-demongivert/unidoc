import { UnidocImportResolver } from './UnidocImportResolver'

import { UnidocResource } from './UnidocResource'
import { UnidocImport } from './UnidocImport'

/**
 * 
 */
export class UnidocNullResolver implements UnidocImportResolver {
  /**
   * 
   */
  public resolve(value: UnidocImport): Promise<UnidocResource> | UnidocResource {
    throw 'A null resolver can\'t resolve unidoc resources.'
  }
}

/**
 * 
 */
export namespace UnidocNullResolver {
  /**
   * 
   */
  export const INSTANCE: UnidocNullResolver = new UnidocNullResolver()
}
