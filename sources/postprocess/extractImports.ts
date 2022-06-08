import { UnidocEvent } from "../event"
import { UnidocProducer } from "../stream"
import { UnidocImport } from "../context"

import { UnidocImportExtractor } from "./UnidocImportExtractor"

/**
 * 
 */
export function extractImports(input: UnidocProducer<UnidocEvent>): [UnidocProducer<UnidocEvent>, UnidocProducer<UnidocImport>] {
  const filter: UnidocImportExtractor = new UnidocImportExtractor()

  filter.subscribe(input)

  return [filter, filter.imports]
}