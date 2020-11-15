import { UnidocSymbolReader } from '../reader/UnidocSymbolReader'

export interface UnidocImportationResolver {
  resolve(identifier: string): UnidocSymbolReader

  begin(identifier: string): void

  end(identifier: string): void
}
