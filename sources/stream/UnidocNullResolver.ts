import { UnidocImportationResolver } from './UnidocImportationResolver'

import { UnidocResource } from './UnidocResource'
import { UnidocImportation } from './UnidocImportation'

export class UnidocNullResolver extends UnidocImportationResolver {
  public async resolve(value: UnidocImportation): Promise<UnidocResource> {
    throw 'A null resolver can\'t resolve unidoc resources.'
  }
}

export namespace UnidocNullResolver {
  export const INSTANCE: UnidocNullResolver = new UnidocNullResolver()
}
