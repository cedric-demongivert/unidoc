import { UnidocEvent } from "../../event"
import { UnidocProducer } from "../../stream/UnidocProducer"

import { UnidocImport } from "./UnidocImport"
import { UnidocImportFilter } from "./UnidocImportFilter"

/**
 * 
 */
export function extractImports(input: UnidocProducer<UnidocEvent>): [UnidocProducer<UnidocEvent>, UnidocProducer<UnidocImport>] {
  const filter: UnidocImportFilter = new UnidocImportFilter()

  filter.subscribe(input)

  return [filter, filter.importations]
}