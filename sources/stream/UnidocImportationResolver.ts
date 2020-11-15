import { UnidocImportation } from './UnidocImportation'
import { UnidocResource } from './UnidocResource'

export class UnidocImportationResolver {
  public async resolve(value: UnidocImportation): Promise<UnidocResource> {
    throw new Error('UnidocImportationResolver#resolve was not implemented.')
  }
}
