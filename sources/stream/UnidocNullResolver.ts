import { UnidocSymbolReader } from '../reader/UnidocSymbolReader'

import { UnidocImportationResolver } from './UnidocImportationResolver'

export class UnidocNullResolver implements UnidocImportationResolver {
  public resolve(identifier: string): UnidocSymbolReader {
    throw 'A null resolver can\'t resolve unidoc symbol source identifier.'
  }

  public begin(identifier: string): void {

  }

  public end(identifier: string): void {

  }
}

export namespace UnidocNullResolver {
  export const INSTANCE: UnidocNullResolver = new UnidocNullResolver()
}
